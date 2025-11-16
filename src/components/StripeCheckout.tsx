import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';

const publishableKey =
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY ||
  process.env.STRIPE_PUBLISHABLE_KEY;

const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

const StripeCheckout: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [params] = useSearchParams();
    const email = params.get('email');
    const plan = params.get('plan');
    const coupon = params.get('coupon');

    const navigate = useNavigate();

    useEffect(() => {
        // In demo mode, just redirect to main
        setLoading(false);
        navigate('/main?demo=true');
    }, [email, plan, coupon, navigate]);

    return (
        <div style={{ padding: 20 }}>
            {loading && <p>Redirecting to payment...</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        </div>
    );
};

export default StripeCheckout;
