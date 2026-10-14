---
id: 113
title: "Why I don't like the LTV metric (LifeTime Value)"
slug: "ltv"
url: "https://longform.asmartbear.com/ltv/"
pubDate: "Mon, 07 Oct 2013 00:00:00 +0000"
summary: "The LTV metric overcomplicates and misleads. Learn why you should use other SaaS metrics instead."
---

# Why I don't like the LTV metric (LifeTime Value)

> **Executive Summary:** The LTV metric overcomplicates and misleads. Learn why you should use other SaaS metrics instead.
> **Original URL:** [https://longform.asmartbear.com/ltv/](https://longform.asmartbear.com/ltv/)

![What's really exciting is if you extend this out five years, we own around 400% of the market!](https://public.asmartbear.com/books/anthology/chapters/ltv/d6965print-simple.png)

A metric is a single number stuffed with an enormous complexity of causes, effects, and interconnected processes. This is a two-edged sword.

This is powerful because it lets you reason about complex systems: how they look now and how they are changing. It helps you focus on what's important.

But this is dangerous because you're combining so many disparate and disjoint processes and systems that the number has little precision, and no explanatory power. And then you *think* you understand something that you don't. That's how bad decisions are made with confidence. The [rubric](https://longform.asmartbear.com/roi-rubric/) always gives you 8 decimal places of "precision," even if those digits are all [error](https://longform.asmartbear.com/p-hacking/) and [uncertainty](https://longform.asmartbear.com/predict-the-future/).

> "The greatest enemy of knowledge is not ignorance. It's the illusion of knowledge."  
> --Stephen Hawking

**For many SaaS businesses, the incorrectness of the LTV metric outweighs the value it supposedly confers.**

The definition of LTV is the "Total gross profit the customer will generate over its lifetime." "Gross profit" means "Income after deducting expenses that are required to deliver the product," including tech support and infrastructure (for SaaS products) and cost of materials (for physical products). It does not include the costs of sales and marketing, nor the costs of development, or any other costs of running the business.

The formula is:

$$\text{LTV} = \text{MRR} \times \text{GPM} \times \text{Lifetime}_{\text{Months}}$$

Or, since typically we're estimating the average lifespan of a customer from our monthly cancellation rate:

$$\text{LTV} = \frac{\text{MRR} \times \text{GPM}}{\text{Cancellation}_{\text{Monthly}}}$$

LTV is commonly used to determine how much you can spend to acquire a new customer (CAC). In particular, if it costs more than LTV, then the business is unprofitable even at scale, and over ten years. Whereas if, say, $\text{LTV} = 3 \times \text{CAC}$, then even if we're unprofitable at first (as it takes months of revenue to pay back the cost to acquire the customer), we will be profitable in the long run (as a large percentage of our customer base has already paid back CAC). (See [this article on annual pricing](https://longform.asmartbear.com/annual-prepay/) for pictures of this effect, and how different pricing can change the effect.)

Using LTV in a business decision--like how much we can spend to acquire a new customer--implies that the lifetime gross revenue from a customer is know-able today. Clearly, though, it isn't.

**Every component of LTV changes over time:**

* MRR--changes due to how systematic you are at upgrades, your ability to cross-sell, growing/shrinking within each customer, per-use charges, the percentage of the customer base belonging to different customer segments.
* GPM--efficiency of the service, which for small companies can change by 30% in a year and even large stable companies can move by 1% per year.
* Cancellation Rate--hopefully [shrinking as the company improves](https://longform.asmartbear.com/product-market-fit/) the product and service to address the causes of cancellation, but over a time-frame of years, this can change dramatically with advent of new competitors, shrinking market, different technology, or mixing different customer demographics as you grow into [adjacent markets](https://longform.asmartbear.com/adjacency/).

For example, HubSpot famously had a low LTV, but increased in 3x in 18 months.[^1] That's a big swing in a metric that purports to summarize the next ten years.

[^1]: Documented in David Skok's famous [SaaS metrics overview](https://www.forentrepreneurs.com/saas-metrics-2/).

Three variables, all changing, unpredictably, which you multiply together and.... you expect the result to *mean* something?

When you treat a number as being stable and solid, when in fact it can vary by 2x in a year through normal business activity, you make poor decisions. So for example when you read "An LTV:CAC ratio of 3:1 is healthy," if your LTV metric can't be trusted, neither can that formula. Your might believe you're being efficient in acquiring customers, only to find [your growth is capped](https://longform.asmartbear.com/max-mrr/), or that you're [not profitable even at scale](https://longform.asmartbear.com/ssebitda/).

![so you gonna rush in or what](https://public.asmartbear.com/books/anthology/chapters/ltv/d6048print-simple.png)

## What should you do instead?

Every "insight" that LTV is supposed to give you, you can get from different metrics that work better, because they don't involve long time horizons. And they point to actions you can take.

For example, take the original question: "What is a reasonable CAC?" The typical answer is "LTV/CAC should be at least 3 for healthy companies, and 5 is very good."

But you can also compute what CAC is "reasonable" by thinking in terms of pay-back period $p = \frac{\text{CAC}}{\text{MRR}}$, which is the number of months it takes before a single customer becomes profitable, because we have received (in revenue) the cost (in CAC). Or better, in my opinion, $p = \frac{\text{CAC}}{\text{MRR} \times \text{GPM}}$, so that we're accounting for the costs to serve those customers.

This payback period is also useful to see [why annual prepayments are far smarter than you might think](https://longform.asmartbear.com/annual-prepay/), and for the metric [COC (Cost Of Cancellation)](https://longform.asmartbear.com/coc/), which leads to more insights into how cancellation affects the cost of growth, and for the [Max-MRR metric](https://longform.asmartbear.com/max-mrr/), which leads to insights into how cancellation affects your maximum size. LTV doesn't lead us to any of those insights.

A good rule of thumb with pay-back period is that 6 months is fine, 3 months is fantastic, and 12+ months is poor unless (1) there's indirect strategic benefit, e.g. branding, (2) efficiency is improving so we want to stick with it, (3) it is a mature company or with larger business customers where you can justify an assumption of 5-10 years of revenue per customer.

Another use of LTV is: A measure of dollars earned by the company over the long run, and thus something that ought to be going up over time. True, but in practice I find you *always* need to know the values of the individual components to truly know whether the company is healthy.

For example, if LTV is steady, is that OK? If all the components are steady, maybe that's OK. But what if GPM is improving due to investment in cost-cutting measures while cancellations are increasing, and thus LTV is stable. Is that good? Heck no! Your customers are pissed. Or what if MRR is increasing because you're landing larger customers, but GPM is decreasing because you're very inefficient at serving them? That's both good news and bad news, and points out that you need more efficiency work right now, or you need to raise money so that you can remain devoted to growth for the next few years.

Thus, measuring MRR, cancellations, GPM, and CAC individually are always necessary. Sure you can combine them into a number, but I think that only serves to hide data, hide insights, not help "get a handle on the business."
