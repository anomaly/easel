import Stripe from 'stripe';

/**
 * On identity signup, create a new Stripe customer
 * 
 * This uses a two way sync design, where Netlify Identity has the 
 * Stripe customer ID and Stripe has the Netlify user Id, this will
 * enable us to fetch the Netlify user when responding to webhooks
 * 
 * @param {object} event 
 * @returns {object}
 */
exports.handler = async (event) => {

  // Initialise the Stripe client, this would generally be done
  // TODO: attempt to convert this into a singleton
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

  const { user } = JSON.parse(event.body);

  // Create a new Stripe customer, with the Netlify user ID 
  // stored in the Metdata, Stripe passes this back whenever
  // It calls the webhook
  const customer = await stripe.customers.create({ 
    email: user.email,
    metadata: {
      userId: user.id
    }
  });

  // On success, return the Stripe customer ID
  // to be stored in the app_metadata
  return {
    statusCode: 200,
    body: JSON.stringify({
      app_metadata: {
        roles: [],
        stripeId: customer.id,
      },
    }),
  };

};
