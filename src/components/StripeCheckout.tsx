import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';

const publishableKey =
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY ||
  process.env.STRIPE_PUBLISHABLE_KEY;

const stripePromise = loadStripe(publishableKey);

const StripeCheckout: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [params] = useSearchParams();
    const email = params.get('email');
    const plan = params.get('plan');
    const coupon = params.get('coupon');

    const navigate = useNavigate();

    useEffect(() => {
        // Bail early if required params are missing
        if (!email || !plan) {
            setError('Missing email or plan');
            setLoading(false);
            return;
        }

        const checkout = async () => {
            try {
                const stripe = await stripePromise;
                if (!stripe) throw new Error('Stripe failed to load');

                const response = await fetch(
                    `${process.env.REACT_APP_API_URL}/create-checkout-session`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email,
                            plan,
                            couponId: coupon,
                            success_url: `${window.location.origin}/main`,
                            cancel_url: `${window.location.origin}`,
                        }),
                    }
                );

                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Server error');

                // ─── Handle the custom codes from backend ──────────────────────────
                if (data.code === 30) {
                    // Customer already subscribed → send them where you want
                    navigate('/main?existing=true');
                    return;
                }

                if (data.code === 200 && data.sessionId) {
                    const { error: stripeError } = await stripe.redirectToCheckout({
                        sessionId: data.sessionId,
                    });
                    if (stripeError) throw new Error(stripeError.message);
                    return; // Normal flow continues in Stripe-hosted page
                }

                // Unknown response shape
                throw new Error('Unexpected server response');
            } catch (err: any) {
                console.error('Checkout error:', err);
                setError(err.message || 'Checkout failed');
            } finally {
                setLoading(false);
            }
        };

        checkout();
    }, [email, plan, coupon, navigate]);

    return (
        <div style={{ padding: 20 }}>
            {loading && <p>Redirecting to payment...</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        </div>
    );
};

export default StripeCheckout;
