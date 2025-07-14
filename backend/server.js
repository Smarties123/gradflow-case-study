import dotenv from 'dotenv';
import { sendEmailsToAllUsers } from './services/emailService.js';
// import { sendApplicationStatusEmail } from './services/emailService.js';

import cron from 'node-cron';
dotenv.config(); 

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
import stripe from 'stripe';







// Schedule the task to run every wednesday at 9:00 AM 
//for more info: https://www.npmjs.com/package/node-cron
cron.schedule('0 9 * * 3', async () => {
  console.log('Sending application status emails to all users...');
  await sendEmailsToAllUsers();
  console.log('Finished sending emails.');
});

const app = express();


const STRIPE_SECRET_KEY =
  'sk_test_51R5CfJDcnB3juQw0XDcapLqGVVfw2yncjmtMlAfrmyOCsXWRFlOlkjlxNEgXy9QTa2hF4Kn86fba1UetFHtm2DAX00mx2xTCYJ';

const stripeCon = stripe(STRIPE_SECRET_KEY);
// 1) CORS — allow only your front end (override in .env per environment)
app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
}));
// 2) JSON parser — must come BEFORE any routes that read req.body
app.use(express.json());
app.use(logDeleteRoute);


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


export async function markUserAsNotMemberByStripeCustomerId(stripeCustomerId) {
  if (!stripeCustomerId) throw new Error('customerID is required');

  try {
    const result = await pool.query(
      `UPDATE "Users" 
       SET "IsMember" = $1, "StripeCustomerId" = NULL
       WHERE "StripeCustomerId" = $2
       RETURNING *`,
      [false, stripeCustomerId]
    );

    if (result.rowCount === 0) {
      console.warn('No user found with customerId:', stripeCustomerId);
      return null;
    }

    console.log(`User ${result.rows[0].Email} marked as not a member:`);
    return result.rows[0];
  } catch (err) {
    console.error(`Error updating user membership: for user ${stripeCustomerId}`, err);
    throw err;
  }
}


app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message);
    return res.sendStatus(400);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const email = session.customer_details?.email;
    const customerId = session.customer;

    try {
      await markUserAsMemberByEmail(email, customerId);
    } catch (err) {
      console.error('Error marking user as member:', err);
      return res.sendStatus(500);
    }
  }


  if (
  event.type === 'customer.subscription.deleted' ||
  event.type === 'customer.subscription.canceled' ||
  event.type === 'invoice.payment_failed'
) {
  const subscription = event.data.object;
  
  try {
    const customer = await stripeCon.customers.retrieve(subscription.customer);

    await markUserAsNotMemberByStripeCustomerId(customer.id);
  } catch (err) {
    console.error('Failed to mark user as not a member:', err);
    return res.sendStatus(500);
  }
}

  res.status(200).json({ received: true });
});


app.use(cors());
app.use(express.json());

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
  const { email, plan, success_url, cancel_url } = req.body;

  // 1. Validate plan
  const normalizedPlan = plan?.toLowerCase();
  if (!['monthly', 'yearly'].includes(normalizedPlan)) {
    return res.status(400).json({ error: 'Invalid plan. Use "monthly" or "yearly".' });
  }


  try {

    // 2. Check if customer already exists
    const { data: existingCustomers } = await stripeCon.customers.list({
      email,
      limit: 1,
    });

    console.log(existingCustomers);

    if (existingCustomers.length > 0) {
      // Stop here - email already has a Stripe customer
      console.log("you are an existing customer");
      
      return res.status(200).json({
        code: 30,
        message: 'Customer already exists with an active subscription.',
      });
    }

    // 3. Create new customer
    const customer = await stripeCon.customers.create({
      email,
      description: `Customer for ${normalizedPlan} subscription`,
    });

    // 4. Create checkout session
    const session = await stripeCon.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer: customer.id,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url,
      cancel_url,
    });

    return res.status(200).json({
      code: 200,
      sessionId: session.id,
    });

  } catch (err) {
    console.error('Stripe error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

