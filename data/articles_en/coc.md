---
id: 115
title: "COC: A new metric for measuring cancellations in SaaS business models"
slug: "coc"
url: "https://longform.asmartbear.com/coc/"
pubDate: "Tue, 06 Aug 2013 00:00:00 +0000"
summary: "Introducing COC: The true cost of cancellations in a scaling SaaS business."
---

# COC: A new metric for measuring cancellations in SaaS business models

> **Executive Summary:** Introducing COC: The true cost of cancellations in a scaling SaaS business.
> **Original URL:** [https://longform.asmartbear.com/coc/](https://longform.asmartbear.com/coc/)

![i used to have lot of issues but then i just canceled my subscription](https://public.asmartbear.com/books/anthology/chapters/coc/d5232print-simple.png)

You probably know that [high cancellations kill growth](https://longform.asmartbear.com/product-market-fit/#cancellation-stops-growth) in scaling SaaS companies. You also probably know why: Acquiring new customers scales with Marketing and Sales, which is linear, whereas cancellation rate scales *exponentially* with your size (hence phrases like "3% per month"). Cancellations win.

I have a better, clearer way to both visualize and measure this financial effect, specifically the _cost_ of cancellations in the language of _acquiring new customers_. This puts a tangible dollar figure on cancellation, and allows you to more easily compare it other costs and its impact on profitability.

## The cost to create a dollar of MRR (p)

What does it cost a SaaS company to add $1 of new monthly recurring revenue? Using the typical acronyms:

#### `CAC` (Cost to Acquire a Customer)
`CAC` is the total, all-in cost to get one full customer in the door--Sales and Marketing costs, including the fully-loaded salaries of the folks in those divisions, including commissions. The simplest way to compute it is "total Sales and Marketing spend in a month" divided by "total new customers added during that month."

#### `ARPC` (Average Revenue per Customer)
`ARPC` is the average monthly-recurring revenue you get from a customer. The simplest way to compute it in aggregate is "total recurring-revenue in a month (`MRR`)" divided by "total number of customers during that month (`N`)".

Since it costs `CAC` dollars to get one more customer who delivers `ARPC` dollars per month:

`p` = "the cost to acquire one more dollar of MRR" = `CAC / ARPC`

## Payback period (p)

The weak[^1] definition of "pay-back period" is "the number of months it takes for a customer's revenue to 'pay back' the cost to acquire that customer." So, if it costs $80 to acquire a customer (`CAC`) whose MRR is $10 (`ARPC`), then it takes 8 months (`CAC / ARPC`) before the customer turns profitable.

[^1]: The complete definition of "pay-back period" should also include gross profit margin; if you're curious, see [this section of this article about how annual plans can transform your cash-flow](https://longform.asmartbear.com/annual-prepay/#payback-period)

You'll notice this is the same formula that we just gave for "the cost to acquire one more dollar of MRR." This is why we named the variable `p`. Often it's easier to think in terms of "pay-back period," and also easier to find benchmark data for other companies in your industry, size, and age.

## COC--the Cost of Cancellations

Let's call `c` your **monthly cancellation rate**, in terms of `MRR`. So if 4% of your revenue cancels each month, `c = 0.04`.

Each month, `MRR ✕ c` dollars will never recur again. You have to replace those dollars for revenue _just to stay level_ (forget about growing!). And it costs `p` to replace each one of those dollars.

So, the cost, in dollars, cost to replace those cancelled dollars is:

"cancellation replacement cost" = `p ✕ MRR ✕ c`

We could compute the same thing as a percentage of MRR, rather than as a number of dollars. This simply means dividing by `MRR`. This yields the metric that is the subject of this article: `COC` (the Cost Of Cancellations, pronounced _see-oh-see_)--**The *percentage* of our revenue we'll have to spend this month, just to keep from shrinking**:

`COC = p ✕ c`

## The surprisingly high cost of cancellation

Some examples make the utility of this metric clear:

A healthy SaaS business serving SMBs might have a cancellation rate of 3%/mo (`c = 0.03`), and a marketing pay-back period of 7 months[^2] (`p = 7`). In this case, `COC = 0.21`, which means a whopping 21% of its revenue *every month* will be spent *just keeping revenues level.*

[^2]: For example, suppose the cost-per-click on their Google Ads is $2, with a 1% conversion to sale, on an average sale price of $30/mo.

**That's a tremendous percentage of revenue just to keep from shrinking!** That doesn't include the costs of serving those customers (Customer support, SaaS infrastructure, 3% in credit card fees), that doesn't include engineering costs, that doesn't include Sales and Marketing costs to actually *grow* revenues... that's merely to stop shrinkage.

Enterprise SaaS businesses often have a lower monthly cancellation rate but much longer pay-back periods. 1.5% monthly cancellation and 18 month pay-back period means a whopping 27% of revenue is spent replacing cancellations. Are these numbers true in the real world? Yes: Many public SaaS companies have stopped net-growth in terms of absolute number of customers, growing mostly from upgrades by existing customers, because it costs so much to replace the cancellations. ([Example: Fastly](https://www.saastr.com/5-interesting-learnings-from-fastly-at-50000000-in-arr/))

A no-touch SaaS business driven by word-of-mouth marketing might have lower pay-back periods due to efficient acquisition costs, but have higher cancellation rates due to the lack of human touch and poor quality "self-service" marketing channels. I know a prominent SaaS business with a pay-back period of 2 months but a cancellation rate of 5%--that's 10% of revenue to stay even.

That's actually pretty good, compared to the other examples! 5%/mo cancellation means half of their revenue cancels within a year--crazy high!--but the cost of acquisition is so incredibly low that the company is still spending only 10% of revenue to stay even, and of course an additional 10% of revenue spent on marketing allows them to grow at a reasonable clip.

What definitely doesn't work is, for example, a 5% cancellation rate with a 12-month payback period: You burn 60% of revenue to stay even, which means it's almost impossible to grow profitably; in fact you might be shrinking.

## Lesson #1: COC can be as big as other major expenses

The massive size of COC for most SaaS businesses should be a wake-up call. COC expense can often be as high as R&D or G&A, which means the business has an [unprofitable business model](https://longform.asmartbear.com/ssebitda/), even once it achieves scale.

A SaaS business must work constantly to reduce COC. Because the definition is so simple, it's obvious that reducing COC means decreasing cancellations and decreasing `p`, and decreasing `p` in turn means decreasing `CAC` and increasing `ARPC`.

This is a key insight to many SaaS operators, because **typical metrics literature focuses only on reducing cancellation rate, which is only a third of the story.** Furthermore, unless you haven't yet [reached product/market fit](https://longform.asmartbear.com/product-market-fit/), cancellation rate is often hard to shift compared to reducing `CAC` (smarter campaigns, optimized landing pages, self-serve sales/on-boarding) or increasing `ARPC` (using tiered features to segment customers with different budgets and requirements, *a la carte* add-ons for new products or services, price scaling with usage).

For example, my company WP Engine's cancellation rate is under 2% per month. That's low for the hosting sector. Furthermore, when we poll customers who cancel after the first 90 days, the most common reason for cancellation is "project ended." Meaning, it's not something we can affect by changing the product.

Therefore, pay-back period is a smarter place for us to focus in terms of reducing COC. In fact our CAC is also already very low, due to tremendous word-of-mouth that our lovely customers bestow upon us. (And now you see how much we appreciate that!) But maybe we should do more to increase word-of-mouth activity while we continue to optimize our paid advertising campaigns. And what about MRR? We've started selling SSL certificates to customers who want secured sites, which results in incremental revenue (and a better customer experience, because we handle that mess for the customer, including renewing and re-installing the certificates each year).

As another example, take the company above with the 5% cancellation rate that traditional metrics literature would say creates "impossible headwinds for growth," and yet they have a better COC than a typical enterprise SaaS business, demonstrating that a very good pay-back period can overwhelm a crappy cancellation rate.

## Lesson #2: Zero net churn trumps both CAC and MRR

The standard SaaS metrics literature does provide a way to combat cancellations: Up-selling existing customers. If you have 2%/mo cancellations, but if on average you *increase* MRR by 1%/mo with things like customers graduating to larger tiers, adding more "seats," buying add-ons, buying premium support, etc., then *effectively* you're only losing 1% of your MRR per month, not 2%.

Thus, `c` above is not really cancellation rate, but rather "net churn," meaning cancellation rate, plus downgrades, but minus upgrades. The strongest SaaS companies have negative net churn!

You can see the effect of approaching zero net-churn in COC: If `c` is 0, then COC is 0, which means "getting back to even" costs nothing at all. Phew!

Another fact pops out: In terms of "not shrinking," suddenly `p`--and therefore CAC and MRR--doesn't matter at all! Of course they *do* matter for cash flow and efficient growth, but at least in the "revenue headwind" sense they fall away.

This highlights the fact that **getting to zero net churn is the strongest thing you can do** in terms of COC. And since we just talked about "cancellation rate" having a floor, that means you *must* develop paths for up-sells.

## COC: A new standard SaaS metric?

Typical SaaS metrics literature characterizes it this way: "As a SaaS company scales, growth rate diminishes, but cancellation rate doesn't. That means it gets harder stay ahead of the headwinds created by cancellation. So you need to work on getting to zero net-churn and, if you don't, you cannot build a large SaaS company, and certainly not a profitable one."

That's true. Casting those words terms of COC is an easier way to measure exactly how big the "headwinds" are, and what it's directly costing you, every month. It allows you to directly measure that phenomenon, which means you can set goals and track progress. It also correctly balances the headwind of cancellation with the tailwind of low CAC, allowing you to make better decisions about where to spend your time to improve the business.
