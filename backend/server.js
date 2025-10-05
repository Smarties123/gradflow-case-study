import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { sendEmailsToAllUsers } from './services/emailService.js';
// import { sendApplicationStatusEmail } from './services/emailService.js';

import cron from 'node-cron';
// Ensure we read backend/.env regardless of CWD
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '.env') }); 

import express from 'express';
import cors from 'cors';
import pool from './config/db.js';  // Database import
import userRoutes from './routes/userRoutes.js';  
import applicationRoutes from './routes/applicationRoutes.js';
import filesRoutes from './routes/filesRoutes.js';
import statusRoutes from './routes/statusRoutes.js';
import logoDevProxy from './services/logoDevProxy.js'; 
// import sitemapRoutes from './routes/sitemapRoutes.js';  // Import the sitemap route
import logDeleteRoute from './services/logDeleteService.js';  // Import the log delete service
import {
  constructStripeEvent,
  retrieveStripeCustomer,
  markUserAsMemberByEmail,
  markUserAsNotMemberByStripeCustomerId,
  createCheckoutSessionForPlan,
  cancelUserSubscription,
  getResolvedWebhookSecret
} from './services/paymentService.js';
import { authenticateToken } from './middleware/authMiddleware.js';







// Schedule the task to run every wednesday at 9:00 AM 
//for more info: https://www.npmjs.com/package/node-cron
cron.schedule('0 9 * * 3', async () => {
  console.log('Sending application status emails to all users...');
  await sendEmailsToAllUsers();
  console.log('Finished sending emails.');
});

const app = express();



// 1) CORS — allow both www and non-www versions
app.use(cors({
  origin: [
    process.env.CLIENT_ORIGIN,
    'https://gradflow.org',
    'https://www.gradflow.org'
  ],
  credentials: true
}));

// Stripe webhook handler(s) — accept both /webhook and /api/stripe/webhook
const stripeWebhookHandler = async (req, res) => {
  const endpointSecret = getResolvedWebhookSecret();
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = constructStripeEvent(req.body, sig, endpointSecret);
    console.log(`✅ Webhook signature verified for event: ${event.type}`);
  } catch (err) {
    console.error('❌ Webhook signature verification failed.', err.message);
    return res.sendStatus(400);
  }

  console.log(`🎯 Processing webhook event: ${event.type} [${event.id}]`);

  // 1) Checkout completed → mark as member
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    let email = session.customer_details?.email || session.customer_email || null;
    const customerId = session.customer;

    console.log(`💳 Checkout completed for email: ${email}, customer: ${customerId}`);

    if (!email && customerId) {
      try {
        const customer = await retrieveStripeCustomer(customerId);
        email = customer?.email ?? null;
      } catch (e) {
        console.error('❌ Failed to retrieve customer for email fallback:', e?.message || e);
      }
    }

    if (!email) {
      console.error('❌ No email found in session or customer record');
      return res.sendStatus(400);
    }

    try {
      const result = await markUserAsMemberByEmail(String(email).toLowerCase(), customerId);
      console.log(`✅ Successfully marked user as member:`, result);
    } catch (err) {
      console.error('❌ Error marking user as member:', err);
      return res.sendStatus(500);
    }
  }

  // 2) Invoice payment succeeded → defensive mark as member
  if (event.type === 'invoice.payment_succeeded') {
    try {
      const invoice = event.data.object;
      const customerId = invoice.customer;
      if (customerId) {
        const customer = await retrieveStripeCustomer(customerId);
        if (customer?.email) {
          await markUserAsMemberByEmail(String(customer.email).toLowerCase(), customer.id);
          console.log(`✅ Marked user as member via invoice.payment_succeeded for ${customer.email}`);
        }
      }
    } catch (err) {
      console.error('❌ Error updating member on invoice.payment_succeeded:', err);
      // do not 500 the webhook for non-critical fallback
    }
  }

  // 3) Subscription lifecycle updates
  if (event.type === 'customer.subscription.created' || event.type === 'customer.subscription.updated') {
    try {
      const subscription = event.data.object;
      const status = subscription.status;
      const customerId = subscription.customer;
      const customer = customerId ? await retrieveStripeCustomer(customerId) : null;
      const email = customer?.email ? String(customer.email).toLowerCase() : null;
      const activeStatuses = new Set(['active', 'trialing']);
      if (email) {
        if (activeStatuses.has(status)) {
          await markUserAsMemberByEmail(email, customerId);
          console.log(`✅ Marked user as member via subscription ${status} for ${email}`);
        } else if (['canceled', 'unpaid', 'incomplete_expired'].includes(status)) {
          await markUserAsNotMemberByStripeCustomerId(customerId);
          console.log(`🚫 Marked user as not member via subscription ${status} for ${email}`);
        }
      }
    } catch (err) {
      console.error('❌ Error handling subscription lifecycle event:', err);
      // non-fatal
    }
  }

  // 4) Cancellation/failure
  if (
    event.type === 'customer.subscription.deleted' ||
    event.type === 'customer.subscription.canceled' ||
    event.type === 'invoice.payment_failed'
  ) {
    const obj = event.data.object;
    const customerId = obj.customer;
    console.log(`🚫 Processing cancellation/failure for customer: ${customerId}`);
    try {
      const result = await markUserAsNotMemberByStripeCustomerId(customerId);
      console.log(`✅ Successfully marked user as not a member:`, result);
    } catch (err) {
      console.error('❌ Failed to mark user as not a member:', err);
      return res.sendStatus(500);
    }
  }

  console.log(`✅ Webhook ${event.type} processed successfully`);
  return res.status(200).json({ received: true });
};

// Accept both legacy and new webhook paths (based on your logs)
app.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhookHandler);
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), stripeWebhookHandler);





// 2) JSON parser — must come BEFORE any routes that read req.body
app.use(express.json());
app.use(logDeleteRoute);
// app.use(cors());


// console.log('BUCKET_NAME:', process.env.BUCKET_NAME);
// Test email route
// TO RUN IT: 
/*
Uncomment the function below 
run node server.js 
in the terminal run 
curl http://localhost:3001/test-email/youremail@example.com

*/
// app.get('/test-email/:email', async (req, res) => {
//   const email = req.params.email;

//   try {
//     // Fetch user by email from "Users" table
//     const userResult = await pool.query('SELECT * FROM "Users" WHERE "Email" = $1', [email]);

//     if (userResult.rows.length === 0) {
//       return res.status(404).json({ error: `No user found with email ${email}` });
//     }

//     const user = userResult.rows[0];
//     const userId = user.UserId; // Adjust based on your database schema

//     // Send the application status email
//     await sendApplicationStatusEmail(email, userId);
//     res.status(200).json({ message: `Test email sent successfully to ${email}` });
//   } catch (error) {
//     console.error('Error sending test email:', error);
//     res.status(500).json({ error: 'Failed to send test email', details: error.message });
//   }
// });


app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.status(200).json({ time: result.rows[0].now });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ message: 'Database connection error', error: error.message });
  }
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});


// CORS test route
app.get('/test-cors', (req, res) => {
  res.status(200).json({ message: 'CORS is working!' });
});







// app.use('/', sitemapRoutes);


// Proxy route for logo service
app.use(logoDevProxy);

// User-related routes
app.use('/api/users', userRoutes);  // '/forgot-password' will be accessible as '/api/users/forgot-password'
app.use(applicationRoutes);
app.use('/status', statusRoutes);
app.use('/files', filesRoutes);


const port = process.env.PORT || 3001;



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});



app.post('/create-checkout-session', async (req, res) => {
  const { email, plan, success_url, cancel_url, couponId } = req.body;

  try {
    const result = await createCheckoutSessionForPlan({
      email,
      plan,
      successUrl: success_url,
      cancelUrl: cancel_url,
      couponId,
    });

    if (result.alreadyActive) {
      return res.status(200).json({
        code: 30,
        message: result.message || 'Customer already exists with an active subscription.',
      });
    }

    return res.status(200).json({
      code: 200,
      sessionId: result.sessionId,
    });
  } catch (err) {
    console.error('Stripe error:', err);
    const status = Number.isInteger(err.statusCode) ? err.statusCode : 500;
    const message = err.message || 'Internal server error';
    return res.status(status).json({ error: message });
  }
});

app.post('/cancel-subscription', authenticateToken, async (req, res) => {
  const { email } = req.body;

  if (!req.user || !req.user.email || !req.user.userId) {
    return res.status(403).json({ error: 'Invalid authentication token' });
  }

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required' });
  }

  const tokenEmail = req.user.email.toLowerCase();
  const requestEmail = email.toLowerCase();

  if (tokenEmail !== requestEmail) {
    return res.status(403).json({ error: 'You are not authorized to cancel this subscription' });
  }

  try {
    const result = await cancelUserSubscription({
      userId: req.user.userId,
      tokenEmail,
      requestEmail,
    });

    return res.status(200).json({
      message: result.message,
    });
  } catch (err) {
    const status = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    return res.status(status).json({ error: message });
  }
});












