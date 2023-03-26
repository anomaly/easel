# Easel - Netlify based subscriber content
> A tiny set of scripts that allow you to make your own subscriber site with Netlify.

[![Netlify Status](https://api.netlify.com/api/v1/badges/9dc75eb5-dca6-4d0a-ba1e-90111e070764/deploy-status)](https://app.netlify.com/sites/melodious-kitsune-56de31/deploys)

> I am developing this template as I get Anomaly to publish Academy. Please fee to use it but don't consider it **STABLE** until there's an official release. If you have any questions, please start a discussion, if you have a feature request (or have found a bug) please open an issue. 🙏 

This repository provide a template that allows you to build subscriber or paid content sites with Netlify. It's aimed at people wanting to provide premium content unlocked with one of charges or subscriptions. You will need to be somewhat handson to get this to work (hopefully not too much, as I have tried to distill the information you need from the various docs).

The crux of the setup is a:
- NextJS based starter site configured to run on Netlify
- Tailwind CSS integration
- Markdoc plugin to support code sample
- Support for downloads files (Zip, PDF, etc)

Alongside we provide Netlify functions that work with Stripe to accept payments and create subscriptions.

Before you get started you will need:

- [ ] Github or Gitlab account
- [ ] [Netlify](https://netlify.com) account
- [ ] [Stripe](https://stripe.com) account

Features:
- Allow users to sign up and manage their account
- Allow users to view / manage their purchases subscriptions
- Basic structure of subscription and paid content using `_redirects`
- Only requires Netlify and Stripe

If you are interested in how the template is designed, please look at [DESIGN.md](DESIGN.md).

> To see a working version (using Stripe's test mode) head to [easel.fun](https://easel.fun), it was cheapest domain available when I was working on this template 😀

## Workflow

- Enable Netlify identity
- Get Stripe API keys and Webhook secret
- Register the webhook endpoint with Stripe
- Setup Netlify environment variables
- Setup your plans and prices
- Setup rules on your site


## How to use this template

First you need fork, clone or copy the content of this repository and preferably host it on a service.

Open `package.json` and update the `name` and `version` number attributes, appropriate to your project.




## License
Easel is distributed under the MIT license.