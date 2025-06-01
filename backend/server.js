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
// Schedule the task to run every wednesday at 9:00 AM 
//for more info: https://www.npmjs.com/package/node-cron
cron.schedule('0 9 * * 3', async () => {
  console.log('Sending application status emails to all users...');
  await sendEmailsToAllUsers();
  console.log('Finished sending emails.');
});

import stripe from 'stripe';

const app = express();

// console.log('BUCKET_NAME:', process.env.BUCKET_NAME);
// // Test email route
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


app.use(cors());
app.use(express.json());

// app.use('/', sitemapRoutes);


// Proxy route for logo service
app.use(logoDevProxy);

// User-related routes
app.use('/api/users', userRoutes);  // '/forgot-password' will be accessible as '/api/users/forgot-password'
app.use(applicationRoutes);
app.use(statusRoutes);
app.use('/files', filesRoutes);


const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


const STRIPE_SECRET_KEY =
  'sk_test_51R5CfJDcnB3juQw0XDcapLqGVVfw2yncjmtMlAfrmyOCsXWRFlOlkjlxNEgXy9QTa2hF4Kn86fba1UetFHtm2DAX00mx2xTCYJ';

const stripeCon = stripe(STRIPE_SECRET_KEY);

// app.post('/create-payment-intent', async (req, res) => {
//   try {
//     const paymentIntent = await stripeCon.paymentIntents.create({
//       amount: 200,
//       currency: 'gbp',
//       automatic_payment_methods: {
//         enabled: true,
//       },
//     });

//     res.json({ clientSecret: paymentIntent.client_secret });
//   } catch (error) {
//     console.error('Error creating payment intent:', error);
//     res.status(500).json({ error: error.message });
//   }
// });

app.post('/create-checkout-session', async (req, res) => {
  const { email, plan, success_url, cancel_url } = req.body;
  
    var priceId = 0;

    // Validate plan
    if (!['monthly', 'yearly'].includes(plan.toLowerCase())) {
        return res.status(400).json({ error: 'Invalid plan. Must be "monthly" or "yearly".' });
    }
  
    if (plan === "monthly") {
      priceId = process.env.STRIPE_MONTHLY_PRICE_ID;
    } else if (plan === "yearly") {
      priceId = process.env.STRIPE_YEARLY_PRICE_ID;
    }

    try {
        // Step 1: Create or retrieve a Stripe Customer
        let customer;
        const existingCustomers = await stripeCon.customers.list({ email, limit: 1 });
        if (existingCustomers.data.length > 0) {
            customer = existingCustomers.data[0];
        } else {
            customer = await stripeCon.customers.create({
                email,
                description: `Customer for ${plan} subscription`,
            });
        }

        // Step 2: Create the Checkout Session for a subscription
         const session = await stripeCon.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            customer: customer.id,
            mode: 'subscription',
            success_url,
            cancel_url,
        });

        res.json({ sessionId: session.id });

        
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});


app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message);
    return res.sendStatus(400);
  }

  // Handle checkout session completion
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Example: mark user as paid, create subscription record, etc.
    console.log(' Payment succeeded for:', session.customer_email);
  }

  res.status(200).json({ received: true });
});
