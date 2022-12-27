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

## User Accounts



# Resources

The design is heavily influenced by a [blog post](https://www.netlify.com/blog/2020/07/13/manage-subscriptions-and-protect-content-with-stripe/#display-content-based-on-user-roles) and a live stream video that [Jason Lengstorf](https://www.learnwithjason.dev/) and [Thor](https://thorweb.dev) put together, to deploy a similar solution on Netlify. You can find their code on this [Github repository](https://github.com/stripe-samples/netlify-stripe-subscriptions). A review of this was referencd in Issue #1.