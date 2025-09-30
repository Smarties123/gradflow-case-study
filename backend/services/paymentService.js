import dotenv from 'dotenv';
import stripe from 'stripe';
import pool from '../config/db.js';

dotenv.config();

const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);

const NON_ACTIVE_STATUSES = new Set(['canceled', 'incomplete_expired']);

export const constructStripeEvent = (payload, signature, endpointSecret) => {
  return stripeClient.webhooks.constructEvent(payload, signature, endpointSecret);
};

export const retrieveStripeCustomer = async (customerId) => {
  return stripeClient.customers.retrieve(customerId);
};

export async function markUserAsMemberByEmail(email, stripeCustomerId) {
  if (!email) throw new Error('Email is required');

  try {
    const result = await pool.query(
      `UPDATE "Users" 
       SET "IsMember" = $1, "StripeCustomerId" = $2 
       WHERE "Email" = $3 
       RETURNING *`,
      [true, stripeCustomerId, email]
    );

    if (result.rowCount === 0) {
      console.warn('No user found with email:', email);
      return null;
    }

    console.log(`User ${email} marked as member:`);
    return result.rows[0];
  } catch (err) {
    console.error('Error updating user membership:', err);
    throw err;
  }
}

export async function markUserAsNotMemberByStripeCustomerId(stripeCustomerId, userId) {
  if (!stripeCustomerId && !userId) throw new Error('customerID or userID is required');

  const values = [false];
  let whereClause = '';

  if (stripeCustomerId && userId) {
    values.push(stripeCustomerId, userId);
    whereClause = '"StripeCustomerId" = $2 OR "UserId" = $3';
  } else if (stripeCustomerId) {
    values.push(stripeCustomerId);
    whereClause = '"StripeCustomerId" = $2';
  } else {
    values.push(userId);
    whereClause = '"UserId" = $2';
  }

  try {
    const result = await pool.query(
      `UPDATE "Users" 
       SET "IsMember" = $1, "StripeCustomerId" = NULL
       WHERE ${whereClause}
       RETURNING *`,
      values
    );

    if (result.rowCount === 0) {
      console.warn('No user found with customerId or userId:', stripeCustomerId ?? userId);
      return null;
    }

    console.log(`User ${result.rows[0].Email} marked as not a member:`);
    return result.rows[0];
  } catch (err) {
    console.error(`Error updating user membership: for user ${stripeCustomerId ?? userId}`, err);
    throw err;
  }
}

const getSubscriptionsNeedingCancellation = async (customerId) => {
  if (!customerId) return [];

  const subscriptions = [];
  let startingAfter;

  do {
    const response = await stripeClient.subscriptions.list({
      customer: customerId,
      status: 'all',
      limit: 100,
      ...(startingAfter ? { starting_after: startingAfter } : {}),
    });

    const activeSubscriptions = response.data.filter(
      (subscription) => !NON_ACTIVE_STATUSES.has(subscription.status)
    );

    subscriptions.push(...activeSubscriptions);
    startingAfter = response.has_more && response.data.length > 0
      ? response.data[response.data.length - 1].id
      : undefined;
  } while (startingAfter);

  return subscriptions;
};

const findCustomerWithActiveSubscription = async (email) => {
  if (!email) return null;

  let startingAfter;

  do {
    const response = await stripeClient.customers.list({
      email,
      limit: 100,
      ...(startingAfter ? { starting_after: startingAfter } : {}),
    });

    for (const candidate of response.data) {
      const candidateSubscriptions = await getSubscriptionsNeedingCancellation(candidate.id);
      if (candidateSubscriptions.length > 0) {
        return { customer: candidate, subscriptions: candidateSubscriptions };
      }
    }

    startingAfter = response.has_more && response.data.length > 0
      ? response.data[response.data.length - 1].id
      : undefined;
  } while (startingAfter);

  return null;
};

const ensureCustomerForCheckout = async (email) => {
  if (!email) {
    const error = new Error('Email is required to create a checkout session');
    error.statusCode = 400;
    throw error;
  }

  let fallbackCustomer = null;
  let startingAfter;

  do {
    const response = await stripeClient.customers.list({
      email,
      limit: 100,
      ...(startingAfter ? { starting_after: startingAfter } : {}),
    });

    for (const candidate of response.data) {
      const candidateSubscriptions = await getSubscriptionsNeedingCancellation(candidate.id);
      if (candidateSubscriptions.length > 0) {
        return { customer: candidate, hasActiveSubscription: true };
      }
      if (!fallbackCustomer) {
        fallbackCustomer = candidate;
      }
    }

    startingAfter = response.has_more && response.data.length > 0
      ? response.data[response.data.length - 1].id
      : undefined;
  } while (startingAfter);

  return { customer: fallbackCustomer, hasActiveSubscription: false };
};

export const createCheckoutSessionForPlan = async ({ email, plan, successUrl, cancelUrl, couponId }) => {
  if (!email || typeof email !== 'string') {
    const error = new Error('Email is required to create a checkout session.');
    error.statusCode = 400;
    throw error;
  }

  const normalizedPlan = plan?.toLowerCase();
  if (!['monthly', 'yearly'].includes(normalizedPlan)) {
    const error = new Error('Invalid plan. Use "monthly" or "yearly".');
    error.statusCode = 400;
    throw error;
  }

  const priceId =
    normalizedPlan === 'monthly'
      ? process.env.STRIPE_MONTHLY_PRICE_ID
      : process.env.STRIPE_YEARLY_PRICE_ID;

  if (!priceId) {
    const error = new Error(`Missing price id for plan: ${normalizedPlan}`);
    error.statusCode = 500;
    throw error;
  }

  const normalizedEmail = email.toLowerCase();
  const { customer, hasActiveSubscription } = await ensureCustomerForCheckout(normalizedEmail);

  if (hasActiveSubscription) {
    return {
      alreadyActive: true,
      message: 'Customer already exists with an active subscription.',
    };
  }

  let customerId = customer?.id;

  if (!customerId) {
    const newCustomer = await stripeClient.customers.create({
      email,
      description: `Customer for ${normalizedPlan} subscription`,
    });
    customerId = newCustomer.id;
  }

  const sessionConfig = {
    payment_method_types: ['card'],
    mode: 'subscription',
    allow_promotion_codes: true,
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
  };

  if (couponId) {
    sessionConfig.discounts = [{ coupon: couponId }];
  }

  const session = await stripeClient.checkout.sessions.create(sessionConfig);

  return {
    alreadyActive: false,
    sessionId: session.id,
  };
};

export const cancelUserSubscription = async ({ userId, tokenEmail, requestEmail }) => {
  const userQuery = await pool.query(
    'SELECT "StripeCustomerId", "Email" FROM "Users" WHERE "UserId" = $1',
    [userId]
  );

  if (userQuery.rowCount === 0) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const dbUser = userQuery.rows[0];
  let stripeCustomerId = dbUser.StripeCustomerId;
  let subscriptionsToCancel = [];

  const attachSubscriptionsForCustomer = async (customerId) => {
    try {
      return await getSubscriptionsNeedingCancellation(customerId);
    } catch (error) {
      console.warn(`Failed to list subscriptions for customer ${customerId}:`, error.message);
      return [];
    }
  };

  subscriptionsToCancel = await attachSubscriptionsForCustomer(stripeCustomerId);

  if (!stripeCustomerId || subscriptionsToCancel.length === 0) {
    const searchEmail = [dbUser.Email, requestEmail, tokenEmail].find(Boolean)?.toLowerCase();
    const fallback = await findCustomerWithActiveSubscription(searchEmail);
    if (fallback) {
      stripeCustomerId = fallback.customer.id;
      subscriptionsToCancel = fallback.subscriptions;
    }
  }

  if (!stripeCustomerId) {
    const error = new Error('No Stripe customer with an active subscription found');
    error.statusCode = 404;
    throw error;
  }

  if (subscriptionsToCancel.length === 0) {
    await markUserAsNotMemberByStripeCustomerId(stripeCustomerId, userId);
    return { message: 'Subscription cancelled' };
  }

  for (const subscription of subscriptionsToCancel) {
    await stripeClient.subscriptions.cancel(subscription.id);
  }

  await markUserAsNotMemberByStripeCustomerId(stripeCustomerId, userId);

  return {
    message: `Subscription cancelled successfully`,
    cancelledCount: subscriptionsToCancel.length,
  };
};

export { stripeClient };


