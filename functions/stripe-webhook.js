import stripe from './utils'

const getNetlifyUser = async (netlifyId) => {
}

exports.handler = async ({ body, headers }, context) => {

  try {

    // Stripe requires you to do this to ensure that the
    // webhook is from Stripe, if it's not this will fail
    // and raise the exception
    const stripeEvent = stripe.webhooks.constructEvent(
      body,
      headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET,
    );
    
    switch (stripeEvent.type) {
      case 'customer.subscription.updated':
        const paymentIntent = stripeEvent.data.object;
        break;
      default:
        return;
    }

    // Send the yay ok to Stripe which will mark it
    // processed on their part and will never fire again
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        processed: true 
      }),
    };

  }
  catch (err) {
    // This will make Stripe retry at a later time.
    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`,
    };
  }

};