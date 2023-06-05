import Stripe from 'stripe';
import stripe from './utils/stripe'

import type {
    Handler,
    HandlerEvent,
    HandlerContext,
    HandlerResponse,
} from "@netlify/functions";

/**
 * 
 * @param _event 
 * @param context 
 * @returns 
 */
const handler: Handler = async function (
    _event: HandlerEvent,
    context: HandlerContext
) {

    const { user } = context.clientContext;

    // Parameters for creating a customer in Stripe
    // primarily needs the Stripe ID that would be stored against
    // the app_metdata of the logged in user
    //
    // In this instance we will redirect back to the root URL
    const createLinkParams: Stripe.BillingPortal.SessionCreateParams = {
        customer: user.app_metadata.stripeId,
        return_url: process.env.URL,
    };

    // Make the call to Stripe to get the URL
    // Note that this requires your Billing Portal to be active, read
    // the guide that we have included with the code.
    const billingPortalSession: Stripe.BillingPortal.Session =
        await stripe.billingPortal.sessions.create(createLinkParams);

    // TODO: error handling, Stripe won't allow us to create init is complete

    // Body that will be serialised and returned
    const responseBody = {
        url: billingPortalSession.url
    };

    // Handler response that contains the URL to redirect to
    const response: HandlerResponse = {
        statusCode: 200,
        body: JSON.stringify(responseBody),
    };

    return response;

};

export { handler };