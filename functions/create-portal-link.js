import stripe from './utils/stripe'

exports.handler = async (_event, context) => {

    const { user } = context.clientContext;

    const link = await stripe.billingPortal.sessions.create({
        customer: user.app_metadata.stripeId,
        return_url: process.env.URL,
    });

    // TODO: error handling, Stripe won't allow us to create init is complete

    const responseBody = {
        url: link.url
    };

    return {
        statusCode: 200,
        body: JSON.stringify(responseBody),
    };

};