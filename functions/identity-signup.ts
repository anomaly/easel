import stripe from './utils/stripe'
import Stripe from 'stripe';

import type {
  Handler,
  HandlerEvent,
  HandlerResponse,
} from "@netlify/functions";

/**
 * On identity signup, create a new Stripe customer
 * 
 * This uses a two way sync design, where Netlify Identity has the 
 * Stripe customer ID and Stripe has the Netlify user Id, this will
 * enable us to fetch the Netlify user when responding to webhooks
 * 
 * {
 * 	"event": "signup",
 * 	"instance_id": "924bc74c-",
 * 	"user": {
 * 		"id": "e3665c94-",
 * 		"aud": "",
 * 		"role": "",
 * 		"email": "devraj@gmail.com",
 * 		"confirmation_sent_at": "2023-06-05T02:18:44Z",
 * 		"app_metadata": {
 * 			"provider": "email"
 * 		},
 * 		"user_metadata": {
 * 			"full_name": "Dev M"
 * 		},
 * 		"created_at": "2023-06-05T02:18:44Z",
 * 		"updated_at": "2023-06-05T02:18:44Z"
 * 	}
 * }
 * 
 * @param {object} event 
 * @returns {object}
 */
const handler: Handler = async function (
  event: HandlerEvent,
) {

  const user = JSON.parse(event.body).user;

  // Parameters for creating a customer in Stripe
  // Note: that we are sending the ID from the Netlify
  // user to the Stripe customer as metadata
  //
  // When Stripe calls back, we can use the Netlify user ID
  // to load up the object and update it
  //
  // This little trick negates the need for a database
  const createCustomerParams: Stripe.CustomerCreateParams = {
    name: user.user_metadata.full_name,
    email: user.email,
    metadata: {
      netlifyUserId: user.id
    }
  };

  // If all went well then we will have a Stripe customer
  // we should hang on to the ID for later
  // 
  // This method is referred to as the two way sync where each party
  // a fact about each other
  const customer: Stripe.Customer = await stripe.customers.create(
    createCustomerParams
  );

  // Subscribe this user to the default free plan, this is read
  // from the environment variable STRIPE_DEFAULT_PRICE
  const subscriptionCreateParams: Stripe.SubscriptionCreateParams = {
    customer: customer.id,
    items: [
      {
        price: process.env.STRIPE_DEFAULT_PRICE,
      }
    ]
  };

  // Create a subscription for the customer
  const subscription: Stripe.Subscription = await stripe.subscriptions.create(
    subscriptionCreateParams
  );

  // Create an object that will be set as the app_metadata
  // amongst other things this contains the stripeId, which will
  // be required later to create the portal link
  const attributesToUpdate: Object = {
    ...user,
    app_metadata: {
      ...user.app_metadata,
      stripeId: customer.id,
      stripeSubscriptionId: subscription.id,
    },
  }

  // Construct a response that Netlify will understand
  // this should update the app_metadata
  const response: HandlerResponse = {
    statusCode: 200,
    body: JSON.stringify(attributesToUpdate),
  };

  return response;

};

export { handler };
