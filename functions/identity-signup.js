import stripe from './utils'

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

  const { user } = JSON.parse(event.body);

  // Create a new Stripe customer, with the Netlify user ID 
  // stored in the Metdata, Stripe passes this back whenever
  // It calls the webhook
  const customer = await stripe.customers.create({ 
    name: user.user_metadata.full_name,
    email: user.email,
    metadata: {
      netlifyUserId: user.id
    }
  });

  // This is the default state of the user's metadata
  // which will contain the Stripe Id and a free role
  const responseBody = {
    app_metadata: {
      roles: ['free'],
      stripeId: customer.id,
    },
  };

  // On success, return the Stripe customer ID
  // to be stored in the app_metadata
  return {
    statusCode: 200,
    body: JSON.stringify(responseBody),
  };

};
