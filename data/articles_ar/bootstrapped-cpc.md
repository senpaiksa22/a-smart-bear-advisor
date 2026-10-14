---
id: 117
title_en: "Bootstrapped CPC rule of thumb: ARPU/25"
title_ar: "Bootstrapped CPC rule of thumb: ARPU/25"
slug: "bootstrapped-cpc"
url: "https://longform.asmartbear.com/bootstrapped-cpc/"
pubDate: "Mon, 29 Apr 2013 00:00:00 +0000"
category_en: "SaaS Metrics, Unit Economics & Financial Health"
category_ar: "مقاييس شركات SaaS واقتصاديات الوحدة والصحة المالية"
summary_en: "Bootstrapped and unsure about CPC? Use the rule of ARPU/25."
summary_ar: "Bootstrapped and unsure about CPC? Use the rule of ARPU/25."
---

# Bootstrapped CPC rule of thumb: ARPU/25
### Bootstrapped CPC rule of thumb: ARPU/25

> **الملخص التنفيذي:** Bootstrapped and unsure about CPC? Use the rule of ARPU/25.
> **المحور التصنيفي:** مقاييس شركات SaaS واقتصاديات الوحدة والصحة المالية
> **الرابط الأصلي للمقال:** [https://longform.asmartbear.com/bootstrapped-cpc/](https://longform.asmartbear.com/bootstrapped-cpc/)

![I see big changes in your future. Which reminds me, my fee is going up beginning next week.](https://public.asmartbear.com/books/anthology/chapters/bootstrapped-cpc/d6108print-simple.png)

In the first year of business, you have no data for decision-making.

Even after the first hundred customers, half of those were serendipitous one-offs, not representative of repeatable, predictable customer acquisition, and the scale of the data isn't statistically significant.

One of the fundamental data-driven questions (but you don't have data) is: **What's the maximum I should bid for CPC (cost-per-click) campaigns like Google AdWords?**

The answer for a funded startup is "Bid as much as possible, to get as many customers--and data!--as you can, as quickly as you can, then rapidly iterate from there in the presence of that data."

That's a smart use of money: To "pay to find out." But what about a bootstrapped, profit-driven business? You don't have that budget, and you're keen on getting a reasonable return on investment [reasonably quickly](https://longform.asmartbear.com/annual-prepay/).

**Here's my way.**

*(Tune the exact numbers if you disagree with my assumptions!)*

---

## LTV = ARPU x 20

**ARPU** (**A**verage **R**evenue **P**er **U**ser) is the amount you charge the average customer every month, which is typically a mixture of different quantities of customers at different tiers, special add-ons, etc..

**LTV** (**L**ife-**T**ime **V**alue) is the total amount of money you expect to collect from a customer over their entire tenure. A simple version[^1] is `ARPU ✕ [expected months]` meaning the *average* number of months a customer sticks with you.

[^1]: The correct version also includes multiplying by Gross Profit Margin, i.e. the cost to serve customers, which for SaaS is tech support, server infrastructure, and payment fees. You should include this for a more accurate calculation; small bootstrapped companies often have very high GPMs, so ignoring it for this back-of-the-envelop calculation was simpler.

Some customers cancel in one month, some cancel in a year, some in five years, and some never cancel! So it can be difficult to compute LTV accurately for small companies, and impossible to know for young companies (where five years hasn't elapsed yet to see how many customer stuck it out that long). These are among the reasons that I [dislike the LTV metric](https://longform.asmartbear.com/ltv/), but it's common to use it in this context.

If you do have data, the simplistic calculation is `[expected months] = 1/c` where `c` is your monthly cancellation rate.

But since you don't, in my experience (and in a non-scientific survey of some of the 100 startups currently officed at the fabulously [Capital Factory co-working space](https://capitalfactory.com/) in Austin), a good **pre-data rule of thumb is 20 months**.

If you have an average customer lifetime smaller than 20 months (i.e. cancellation rate higher than 5%/mo), that's a [dangerously high cancellation rate](https://longform.asmartbear.com/product-market-fit/) for almost any SaaS business, and you need to focus on [addressing the business issues](https://longform.asmartbear.com/growth-asymptote/) before acquiring more unsatisfied customers. Use surveys and one-on-ones to try to understand whether it's technical failings, lack of features, missed expectations, bad service, doesn't hit pain points, or what.

A healthy SaaS company will have a higher number of expected months, but at the start you also will have lots of mis-steps with weird early-adopters and non-[ICPs](https://longform.asmartbear.com/icp-ideal-customer-persona/) where your product is at its worst--least features, least quality, etc--so it's good to assume a low LTV instead of inflating it to where it might be in future.

## CAC = LTV / 5

**CAC** (**C**ost to **A**cquire a **C**ustomer) is your *average* total cost to get a new customer, which includes direct costs (AdWords spend, affiliate payouts, the fees your affiliate system charges to process them) and indirect costs (consultants and your own time). So to compute CAC, take your total costs to acquire new customers and divide by the number of customers you acquired.

In general of course CAC needs to be less than LTV, otherwise it costs so much to get the customer that you will never make money. **A surprising number of startups have CAC > LTV.** Many justify this either by not correctly computing CAC (e.g. ignoring indirect costs) or saying they'll "fix that later" by raising prices or finding other channels of revenue. Others justify by saying they're doing a "land-grab" for customers, and just having a customer at all has intrinsic value.

Profit-seeking bootstrapped companies cannot afford those delusions. Also you need something far stronger than CAC = LTV, because you need to pay for other business expenses and still produce a profit. So how big can CAC be before it's "too big?"

Growing, funded SaaS companies who treat CAC with respect often commonly target `CAC = LTV / 3`.

Back at my second startup IT WatchDogs, my co-founder Gerry Cullen used to say "A third to built it, a third to get rid of it, and a third to keep," meaning a third of revenue goes to pay for hardware/inventory/shipping costs of the sale, a third goes to what I'm calling "CAC" here, and a third for the overhead costs, development costs, and profit.

That's a good model, and I think a bootstrapped company can copy it, but I urge profit-seekers to instead adopt an even more strict model of CAC = LTV / 5. The reason is that [at the start you should be able to find](https://longform.asmartbear.com/low-budget-marketing/) a few efficient ways of acquiring customers, even if those [get saturated over time](https://longform.asmartbear.com/exponential-growth/).

## CAC = ARPU x 4

If you combine the previous two results, you see that the cost to acquire a customer should be no more than four months of revenue.

Another good way to think about it is: "The payback-period for my cost to acquire a customer is four months." Also, ideally you're [getting the first month of revenue back immediately](https://longform.asmartbear.com/annual-prepay/), so it's really three months of cash-float.

Companies with large budgets to deploy at scale will often be happy with 12 month payback periods; some very high volume businesses like shared hosting will accept 24 or 36 months! But a bootstrapped company's cash-flow won't allow it, even if the math would work in the long run.

## Conversion Rate = 1%

**Conversion Rate** is the percentage of visitors to your website who convert to a *paying* customer.

This is another step which in practice should be completely data-driven, segmented by customer type and marketing channel, segmented by landing page, [A/B tested](https://longform.asmartbear.com/p-hacking/) and iterated, blah blah blah. But since you don't have data, and you don't have enough visitors to have real ratios, you have to take a swag at this number.

In that same [informal survey I ran](https://longform.asmartbear.com/problem/), and bolstered by other [formal surveys](https://successfulsoftware.net/2009/04/23/the-truth-about-conversion-ratios-for-software/), a huge number of bootstrapped SaaS companies report a 1% conversion rate.

Another way of saying the same thing is **"You need 100 visitors to make 1 sale."**

And since you need to incur no more than **CAC** dollars in the making of that sale, you need to incur no more than **CAC/100** dollars in the making of each of those visitors.

And if you're running a CPC campaign, that means you can pay up to CAC/100 dollars per click.

And since CAC is ARPU x 4, we can substitute and get the end result:

## CPC = ARPU / 25

So for example if your average customer generates $50/mo, you can spend $2/click.

Indeed, this is a great way to prove one of my main arguments for all bootstrapped companies, which is that **you should charge a lot more than you think**, in part because it enables you to pay quite a lot per click, which enables a wide number of marketing channels, and out-bidding parsimonious competitors whose paltry LTVs preclude them from competitive marketing spend.

## Customized

"But my numbers are different!" Of course, but now you have a formula you can plug them into, to arrive at the answer:

$$\text{CPC} = (\text{ARPU})\frac{r}{5c}$$

Where:

* $c =$ monthly cancellation rate
* $r =$ visitor → purchase conversion rate from the paid marketing source in question
