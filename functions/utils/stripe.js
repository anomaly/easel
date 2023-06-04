import Stripe from 'stripe';

// Single stripe instance, you only initialise the key once
// this should apply for all other subsequent calls to the API
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export default stripe;