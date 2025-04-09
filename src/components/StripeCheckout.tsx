import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51R5CfJDcnB3juQw0LrWR9sOPzMLLSVHFt6h3gWJb6V8JqO9xxT8Zb4jtCtnQVbpWJyATkjwCnX5jQ6AXPyt4xW1Z00zj19uhQm'); // Replace with your public key

interface StripeCheckoutProps { }

const StripeCheckout: React.FC<StripeCheckoutProps> = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [params] = useSearchParams();
    const email = params.get('email');
    const plan = params.get('plan');
    const navigate = useNavigate();

    useEffect(() => {
        const initiateCheckout = async () => {
            try {
                const stripe = await stripePromise;
                if (!stripe) throw new Error('Stripe failed to load');

                const response = await fetch(`${process.env.REACT_APP_API_URL}/create-checkout-session`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email,
                        plan,
                        success_url: `${window.location.origin}/main`,
                        cancel_url: `${window.location.origin}`
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to create checkout session');
                }

                const { sessionId } = await response.json();

                const { error: stripeError } = await stripe.redirectToCheckout({ sessionId });
                if (stripeError) throw new Error(stripeError.message);
            } catch (err: any) {
                console.error('Checkout error:', err);
                setError(err.message || 'Checkout failed');
                setLoading(false);
            }
        };

        initiateCheckout();
    }, [email, plan]);

    return (
        <div style={{ padding: 20 }}>
            {loading && <p>Redirecting to payment...</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        </div>
    );
};

export default StripeCheckout;
