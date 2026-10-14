---
id: 8
title: "Max MRR: Your growth ceiling"
title_ar: "الحد الأقصى للإيراد الشهري المتكرر: سقف نمو شركتك"
slug: "max-mrr"
url: "https://longform.asmartbear.com/max-mrr/"
pubDate: "Sun, 27 Jul 2025 00:00:00 +0000"
category: "استراتيجية الأعمال والنمو"
summary: "بناءً على معادلات اقتصاديات الوحدة ونسب التسرب والتحويل، لكل شركة سقف رياضي للإيرادات لا يمكن اختراقه إلا بتغيير النموذج أو رفع الأسعار أو إطلاق منتجات مجاورة."
---

# Max MRR: Your growth ceiling
### الحد الأقصى للإيراد الشهري المتكرر: سقف نمو شركتك

> **الملخص التنفيذي:** بناءً على معادلات اقتصاديات الوحدة ونسب التسرب والتحويل، لكل شركة سقف رياضي للإيرادات لا يمكن اختراقه إلا بتغيير النموذج أو رفع الأسعار أو إطلاق منتجات مجاورة.
> **المحور الأساسي:** استراتيجية الأعمال والنمو
> **رابط المقال الأصلي:** [https://longform.asmartbear.com/max-mrr/](https://longform.asmartbear.com/max-mrr/)

![If by profits you mean an excess of revenues over outlays and expenses in a business enterprise over a given period of time, then yes, it doesn't look good.](https://public.asmartbear.com/books/anthology/chapters/max-mrr/d7790print-simple.png)

For years I've battled the same, tired misconceptions:

* "7% cancellation is fine, especially for consumer businesses."
* "As long as I keep adding $300/mo of new MRR every month, I'll build a real business."
* "I'll keep scaling past a few million in ARR by [doing what I've always done](https://longform.asmartbear.com/explore-execute/)."

I've [given real-world data](https://longform.asmartbear.com/product-market-fit/) to disprove these notions, but it's still hard to internalize and to apply it to your own companies.

Rather than try to convince you again, I'm going to do something far more constructive: Give you a metric called **Max MRR**, that not only dispels false-justifications for high cancellations but is also **predictive** and **updates monthly**, which means it's the [kind of metric](https://longform.asmartbear.com/product-metrics/) you can target, track, and iterate on. Because it's a visceral, tangible number--not some abstract financial ratio--it cuts through the veil of willful ignorance.

Here's how it works, along with a real-world example.

## Buffer

[Buffer](https://buffer.com/) is a [widely beloved](https://buffer.com/resources/buffer-values/) values-first bootstrapped company with one of the most popular tools for scheduling social media posts. Because [their financial data is public](https://buffer.com/metrics) (in another example of their special, enviable culture), and because they've gone through several strikingly different phases of growth, they are a perfect case-study for SaaS metrics. As we'll see, our subject metric of "Max MRR" accurately characterizes their business better than other commonly-used metrics.

Buffer started growing modestly, and then quickly, as [most successful companies do](https://longform.asmartbear.com/product-market-fit/). After seven years of healthy growth, revenue topped out (before COVID) and then shrunk (during COVID), reaching a new, lower plateau by 2023. Then, after rebooting product, pricing, and their target market during 2023, revenue started going up again:

![Buffer's MRR over time, exhibiting the Elephant Curve until a strategic shift in 2023 reignited growth.](https://public.asmartbear.com/books/anthology/chapters/max-mrr/image-simple.png)

What was happening during those years when growth stopped? Was the customer base static? Not at all (Figure 2). During Buffer's period of stagnation and shrinkage, it was experiencing more new customers and upgrades than ever before... but also even more cancellations and downgrades than ever before. Extremely dynamic, yet nevertheless flat overall.

![Buffer's period of stagnation and shrinkage contained "more of everything" -- new, cancels, upgrades, and downgrades.](https://public.asmartbear.com/books/anthology/chapters/max-mrr/buffercomponents2025-simple.png)

The "Max MRR" metric is able to predict this capricious variation in revenue, months ahead of time. We'll first construct a toy example to see how it works, and then apply it to Buffer.

## The Max MRR Metric

Let's explore a simple, hypothetical SaaS company, with stable growth metrics, as follows:

* Starting at $0 MRR
* +$1,000 new MRR each month from marketing and sales
* 5% cancellation each month from existing customers

Tracking MRR over time, it starts out growing nicely, reaching $10k MRR in 15 months, but then growth levels out, and it never reaches $20k MRR, even after 60 months:

![Hypothetical SaaS company levels out at $20k MRR](https://public.asmartbear.com/books/anthology/chapters/max-mrr/mrr-flat-marketing-flat-cancellation-rate-simple.png)

The reason this happens is that new MRR is chugging along at a constant pace (+$1000/mo), whereas cancellation is non-linear; it is proportional to how large the company is. The larger the company, the more *absolute dollars* of churn there is, even though the _rate_ of churn is steady at 5%. As churn dollars grow, growth slows.

Eventually cancellation-dollars are just as large as new-dollars, and the company stops growing, reaching a [steady-state](https://longform.asmartbear.com/ssebitda/).

What is this maximum size? Mathematically it's trivial to compute; we just convert the previous sentence into numbers, where $c$ is the monthly cancellation rate:

$$\begin{aligned}
\text{MRR}_\text{max} \times c &= \text{MRR}_\text{new} \\
\text{MRR}_\text{max} &= \dfrac{\text{MRR}_\text{new}}{c}
\end{aligned}$$

In our toy example, $\text{MRR}_\text{new} = \$1000$ and $c = 0.05$, so the maximum total revenue is $\frac{\$1000}{0.05} = \$20{,}000$, which is exactly what the revenue is approaching in our chart:

![Hypothetical SaaS company levels out at $20k MRR](https://public.asmartbear.com/books/anthology/chapters/max-mrr/mrr-flat-marketing-flat-cancellation-rate-1-2-simple.png)

This model also explains the common phenomenon seen in new startups: Fast initial growth that tapers off sooner than the founders expected, given that the target market is still many orders of magnitude larger than the company.

The chart shows why. When "current MRR" is far away from "Max MRR," MRR will grow quickly; without many existing customers, there's not much churn. As customers accumulate, churn grows, and then it's the _churn_ that's slowing growth, not the _market_. As MRR approaches Max MRR, churn becomes the dominant effect on growth.

Thus the Max MRR metric indicates not only the maximum size of the company, but the size at which growth will start slowing. Obviously we want this metric to increase over time, as we increase new revenue or decrease cancellations. How can we know where we should invest our time?

### Max MRR as cancellation rate improves

In real companies, neither new MRR nor cancellation rate is constant, so Max MRR changes over time. How does that look?

Varying cancellation even by small amount yields a large difference, because cancellation is a nonlinear--exponential in fact--so small changes are magnified.

Let's take the same company, still with a fixed $1000/mo in New MRR, starting with 7%/mo cancellation for the first 20 months, then improving to 4% over the next 10 months, then holding at 4%:

![Hypothetical SaaS company with improving cancellation rate](https://public.asmartbear.com/books/anthology/chapters/max-mrr/mrr-flat-marketing-improving-cancellation-3-simple.png)

Notice that although cancellation changed relatively quickly, revenue doesn't react quickly, looking mostly linear but "wavy." It is therefore difficult to tell, looking at revenue, that we've made a massive improvement to the business model. In contrast, let's also plot the "Max MRR" metric:

![Hypothetical SaaS company with improving cancellation rate and max-growth level](https://public.asmartbear.com/books/anthology/chapters/max-mrr/improve-simple.png)

Notice how the "Max MRR" line shoots up as soon as cancellation rate starts improving, while MRR lags behind. When MRR gets near that ceiling, the cancellation rate dominates the (slowing) growth; when we lift the ceiling, "New MRR" becomes the dominant factor again.

"Max MRR" is therefore a *leading* indicator of long-term growth, because it shoots up quickly when conditions change, whereas "Current MRR" is a _lagging_ indicator.

### Max MRR as new MRR accelerates

Now let's swap which variable is improving; we'll fix cancellation rate back at 5%, and allow "New MRR" to increase.

We already know that if we have a steady input from marketing, growth levels out quickly. What if marketing improves?

Suppose in the first month we add $100 in MRR, in the second month we add $200, and so on, adding $100 more each month than the month before. This is _accelerating_ revenue--growing faster and faster. And we'll let it accelerate for 60 straight months:

![Hypothetical SaaS company with accelerating revenue](https://public.asmartbear.com/books/anthology/chapters/max-mrr/accel-marketing-simple.png)

The first thing we notice is that growth doesn't stop. "Max MRR" also grows alongside actual MRR.

But before we celebrate too much, realize that MRR is _not accelerating_. MRR is growing at more or less a constant pace--it looks like a line for most of this time frame. Yet this is a company that is _accelerating_ their marketing output!

So this is disappointing. *New MRR* is accelerating, yet *MRR* is growing only linearly. This is once again because cancellations are exponential, which means cancellations are accelerating too. The acceleration from cancellation cancels out the acceleration from New MRR. Thus, even companies with accelerating new growth still typically grow revenue linearly, as [analyzed here with many real-world examples](https://longform.asmartbear.com/exponential-growth/).

Furthermore, this scenario is still too optimistic; you cannot grow a marketing channel forever. In fact, channels not only top out, but tend to decline once mature (for reasons [again detailed here](https://longform.asmartbear.com/exponential-growth/)). In a more typical situation, the company unlocks a marketing channel but then reaches the channel's capacity for delivering additional sales every month. This results in initially-accelerating growth, followed by the ceiling that we've now come to expect. Once again the Max MRR curve presages all this, and therefore is a useful leading indicator:

![marketing growth followed by stable marketing](https://public.asmartbear.com/books/anthology/chapters/max-mrr/marketing-to-cap-simple.png)

We also see the emergence of the classic "S-curve" revenue line. Growth accelerates during the combination of "not many customers yet who could cancel" and "new marketing channel is still growing." When marketing effectiveness levels off, the curve switches into deceleration. This has been observed thousands of times across companies in all industries and decades.

The Max MRR curve predicts this, months or even years before it happens. This is its utility.

Now that you have a good sense of how everything works with toy models, let's apply this in the real world.

## Max MRR at Buffer

Figure 9 shows their MRR alongside Max MRR. Notice how the Max MRR line reacts immediately and ahead of revenue, anticipating both the good news and bad news.

![Buffer MRR and Max MRR](https://public.asmartbear.com/books/anthology/chapters/max-mrr/buffermaxmrr2025-simple.png)

Buffer went through a few phases:

| Time­frame | New MRR[^1] & <br/> Cancels[^2] | Dis­cussion |
|:----|:----|:----|
| 2012- <br/> 2014 | <u>MRR</u> <br/> $3k → $40k <br/>  <br/> <u>Cancel</u> <br/> 8% → 6% | As they found Product/<wbr/>Market Fit, they got cancellations under control and accelerated new MRR, resulting in Max MRR increasing and revenue starting to accelerate. |
| 2014- <br/> 2020 | <u>MRR</u> <br/> $40k → $140k <br/>  <br/> <u>Cancel</u> <br/> 6% | Although cancellations never improved, they accelerated new MRR significantly, with a few clear "found a new channel... channel became saturated" events visible where Max MRR briefly plateaued. This maintained linear growth, but never accelerated growth, because cancellations were still high. |
| 2020- <br/> 2024 | <u>MRR</u> <br/> $140k → $90k <br/>  <br/> <u>Cancel</u> <br/> 7% | Revenue sharply declines and struggles for years; cancellation pops up another percentage, causing the dip. New MRR is still large, but because cancellation is also large, Max MRR dips below revenue, so revenue falls. |
| 2024- | <u>MRR</u> <br/> $100k → $150k <br/>  <br/> <u>Cancel</u> <br/> 6% | New MRR substantially increased, with cancellation slightly improving, so Max MRR shoots up and growth reignites. Imagine what would happen with cancellation of 4%! |

[^1]: Includes new customer MRR, upgrade MRR, and reactivating previously-cancelled customers.

[^2]: Includes customer cancellations and downgrades.

Notice how the Max MRR line reacts much quicker, and with much larger magnitude, than any other metric. Anticipating both the good news and bad news.

Looking at the components of Max MRR, the most impactful culprit is the high cancellation rate. 6% is precarious, requiring forever-accelerating new MRR, and quickly tanking revenue as soon as new MRR didn't keep up, which of course it inevitably cannot.

What if Buffer had focused on customer retention, shifting the cancellation rate over five years from 8% in 2014 to 3% by 2019? Then revenue would have doubled:

![Buffer MRR at 3% cancellation](https://public.asmartbear.com/books/anthology/chapters/max-mrr/buffer3p2025-simple.png)

Of course this is easy to predict knowing how Max MRR works. If you halve the cancellation rate, you double Max MRR. In 2023, Buffer founder and CEO [Joel Gascoigne](https://x.com/joelgascoigne?lang=en) [wrote a strategy letter](https://buffer.com/shareholders/2023) saying the same thing. He shifted the corporate strategy back to their [ideal customer](https://longform.asmartbear.com/icp-ideal-customer-persona/) inside their best [target market](https://longform.asmartbear.com/target-market/) (entrepreneurs and small businesses), back to a pricing model that worked better for them ([freemium](https://longform.asmartbear.com/freemium/)), who therefore retain at higher rates. And it worked--we can see cancellation diminish, MRR increase, and Max MRR increase ahead of MRR.

## Max MRR vs NRR

`NRR` is Net Revenue Retention, which answers the question: If no new customers were added, how would revenue change over the course of a year, as a percentage of the ARR from the start of that year? Specifically, and converting from MRR to ARR:

$$\text{NRR} = \dfrac{\text{Upgrade} - \text{Downgrade} - \text{Cancel}}{\text{MRR}} \times 12$$

When upgrades exceed cancellations and downgrades, revenue grows every month, even when you're not adding new customers. At what point would revenue top out in that scenario?

If the market were infinite, you would never stop growing! Therefore "Max MRR" ceases to have meaning.

Of course, markets are not infinite, just as marketing channels are not infinite, so you will top out anyway, but not because of the factors that go into Max MRR. Rather, it will be because you'll have reached saturation in your target market.

This demonstrates a simple point: After high retention, the most powerful growth lever is to have NRR ≥ 100%. Indeed, almost all public SaaS companies have NRR ≥ 100%, exactly because if they didn't, their Max NRR ceiling would be too low for their lofty revenue goals:

![Average NRR at IPO for SaaS companies is 119%; all were above 100%. Average ARR at IPO is $255M. (Year 2022)](https://public.asmartbear.com/books/anthology/chapters/max-mrr/nrr-simple.png)

This rule isn't important only for heavily-funded VC-backed companies gunning for hundreds of millions of ARR. It's just as valid for the solopreneur, because NRR creates growth even with a limited budget for marketing. It also means your customers are growing with you, becoming more successful, receiving more value, and [happy to share some of that with you](https://longform.asmartbear.com/willingness-to-pay/) in the form of price. This is a wonderful signal and a wonderful business model regardless of your long-term financial goals.

## Max MRR vs Quick Ratio

The SaaS Quick Ratio[^3] is sometimes used in a similar way to Max MRR, measuring how much cancellations and downgrades are dragging down growth from new customers and upgrades:

[^3]: Easily confused with the [financial Quick Ratio](https://en.wikipedia.org/wiki/Quick_ratio), which is the ratio of ready-assets to liabilities, used to measure how easily a company will be able to cover its financial obligations.

$$\text{Quick Ratio} = \dfrac{\text{New} + \text{Upgrade}}{\text{Cancel} + \text{Downgrade}}$$

A high-growth, early-scale company should have a Quick Ratio of 3-4; a company at scale with healthy growth should be 1.5-2. Once it reaches 1, the company isn't growing, and below 1, it is contracting. This is similar to Max MRR.

However, useful as it is, it does not forecast revenue growth at all, as is evident from Buffer's Quick Ratio:

![Buffer quick ratio](https://public.asmartbear.com/books/anthology/chapters/max-mrr/bufferquick2025-simple.png)

Buffer's Quick Ratio drops precipitously during Buffer's multi-year period of healthy growth. It continues its downward trajectory even when growth stalls and reverses. It starts recovering before the company actually made positive changes in 2023, and still doesn't seem very strong in 2025 when clearly growth has dramatically changed (and Max MRR does dramatically increase).

This doesn't invalidate Quick Ratio as a useful metric, it just isn't a predictor of revenue growth. Max MRR is.

Also, Max MRR is easier to understand and get excited about. It feels tangible to have a "revenue ceiling" that you are trying to increase. It's harder to get excited about a goal like: "Let's get our Quick Ratio from 1.4 to 1.6."

---

No metric tells the entire story on its own; Max MRR is no exception.

But, it's a fun, simple, explanatory, predictive, and concrete number that is applicable for companies of all stages and sizes.

Now go get your cancellation rate under control, and then switch your focus to NRR.
