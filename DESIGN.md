# Design
> For those curious how this works under the hood

This stack assumes that we will be deploying the site on [Netlify](https://netlify.com). Easel assumes that you will be using [Netlify Identity](https://docs.netlify.com/visitor-access/identity/) to manage user accounts and [Netlify Functions](https://docs.netlify.com/functions/overview/) to handle the Stripe API calls.

Feature of this template:
- NextJS and Markdoc based site which you can build upon
- Tailwind CSS for styling and consistency
- User accounts using Netify Identity
- Ability for users to be able to manage their subscription tiers
- Public and protected content (both browseable and downloadable)

## Motivation

Over the pandemic my team lost it's way and thus the edge of our software engineering habits. Portion of this was communication and documentation of the knowledge that the team was gathering, while working remotely. This was largely due to the lack of long form writing and building a collective knowledge base.

During 2022, I started a project at Anomaly called [Labs](https://github.com/anomlay/labs), which essentially set out to establish the ground truth of each technology component from infrastructure, front end and backend. This lead to me establishing [Academy](https://anomaly.academy) which is a course, designed to train Anomaly staff and anyone else out there.

I wanted this to be a living, breathing set of documents (not just a pay per download) which will keep evolving overtime.

To support this work, I decided to make portions of it as paid content. To help with this I wanted to use my knowledge of Stripe and as much managed infrastructure as possible. This lead to the creation of this template.

In spirit of sharing as much knowledge as we possibly can, the template is free to use, modify and share for commercial and non-commercial purposes.


## Deploy the site to Netlify

You can simply drop the contents of this repository into a new Netlify site, however we encourage a `git` based workflow.

`netlify init`

## User Accounts

First enable Netlify identity, head to the site on Netlify:
- Site Settings
- Identity
- Click the "Enable Identity" button

We use the [Netlify Identity Widget](https://github.com/netlify/netlify-identity-widget) to present the authentication lifecycle. There's a fantastic article that describes this feature, [Integrating Netlify Identity into your Next.js apps](https://www.netlify.com/blog/2020/07/15/integrating-netlify-identity-into-your-next.js-apps/) by [Cassidy Williams](https://twitter.com/cassidoo), however we will go through the particulars of our setup.

Start by adding the package:
```sh
yarn add netlify-identity-widget
```
> If you are using this template you won't have to do this as it's already included

If you look over at `netlifyAuth.js` you will find a code extract from Cassidy's article. It literally provides a wrapper to call functions from the widget library and provide some contextual information like the user itself.

> The original example does make a reference to `netlifyAuth.closeModal()` which I think might be in error

Once configured it's a matter of calling the `initialize` on page load, and then `authenticate` and `signout` where appropriate. An example of a `login` event handler would look like:

```js
let login = () => {
    netlifyAuth.authenticate((user) => {
        setLoggedIn(!!user);
        setUser(user);
        console.log(user);
    })
}
```
### Provisioning the Customer on Stripe

The trick here is to provision a user in Stripe when someone signs up and be able to reference their account on subsequent events. The examples you will find around the web use databases like Fauna to keep a map between the Netlify user and Stripe user. I [found that Netlify Identity](https://github.com/netlify/identity-update-user-data) has two metadata fields:

- `user_metadata`, which is insecure and can be updated on the client side, which is appropriate for say the user's full name
- `app_metadata`, which is secure and can only be updated on the server side, which is appropriate for say the user's Stripe customer ID or Roles.

Stripe also has the idea of storing `metadata` against almost everything that you create. When designing apps I have always use this to our advantage. For example, when creating a customer in Stripe, I will store the Netlify user ID in the `metadata` field. This allows me to easily find the Stripe customer when I need to update their subscription.

Netlify will fire the `identity-signup` event when the user sign's up, so in there we, create a Stripe Customer and hand it the Netlify ID

```js
const customer = await stripe.customers.create({ 
    name: user.user_metadata.full_name,
    email: user.email,
    metadata: {
        userId: user.id
    }
});
```

and upon Stripe responding to us, we return a response body from the function with the updated `app_metadata` field:

```js
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
```

The Netlify interface will not show the additional fields (it does show the `role` field), but you can see them in the API calls as they proceed.

> Note that the `identity-signup` does not fire for Social logins, so we will address this at a later stage.

## Billing Portal

Head to https://dashboard.stripe.com/test/settings/billing/portal

## Webhooks

`/.netlify/functions/stripe-webhook`


## Netlify Lambda Functions

- `identity-signup.js`, this is a special function that executes when a user signs up. It will create a customer in Stripe and store the customer ID in the user's metadata.
- `stripe-webhook.js`
- `create-portal-link.js`

### Stripe CLI

[Stripe CLI](https://stripe.com/docs/stripe-cli) amongst other things allows your proxy webhook requests during development, saving you a heap of pain in setting this up via third party services.

Once you've installed the CLI, you need to authenticate yourself against the appropriate Stripe account. You can do this by running:

```sh
stripe login
```

once you have authenticated, the CLI will output the webhook secret you are going to use during development.



## Limitations

Stripe allows you to pick the products and plans that are shown in the hosted Billing Portal. If you are sharing the Stripe account across projects then you will be restricted to using the Billing Portal for this purpose only.

Opening a new Stripe account is not difficult and Stripe may allow multiple hosted portals into the future.

## Resources

The design is heavily influenced by a [blog post](https://www.netlify.com/blog/2020/07/13/manage-subscriptions-and-protect-content-with-stripe/#display-content-based-on-user-roles) and a live stream video that [Jason Lengstorf](https://www.learnwithjason.dev/) and [Thor](https://thorweb.dev) put together, to deploy a similar solution on Netlify. You can find their code on this [Github repository](https://github.com/stripe-samples/netlify-stripe-subscriptions). A review of this was referenced in Issue #1.

