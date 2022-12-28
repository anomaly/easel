import Stripe from 'stripe';


exports.handler = async (_event, context) => {

    const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
    const { user } = context.clientContext;

    const link = await stripe.billingPortal.sessions.create({
        customer: user.app_metadata.stripeId,
        return_url: process.env.URL,
    });

    const responseBody = { 
        url: link.url 
    };
    
    return {
        statusCode: 200,
        body: JSON.stringify(responseBody),
    };

};