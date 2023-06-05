import stripe from './utils/stripe'
import Stripe from 'stripe';

import type {
  Handler,
  HandlerEvent,
  HandlerContext,
  HandlerResponse,
} from "@netlify/functions";

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
    name: user.metadata.full_name,
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

  const attributesToUpdate: Object = {
    ...user,
    app_metadata: {
      ...user.app_metadata,
      roles: ['free'],
      stripeId: customer.id,
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

export default { handler };
