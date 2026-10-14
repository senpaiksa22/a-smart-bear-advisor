---
id: 13
title_en: "SSEBITDA⁠--A steady-state profit metric for SaaS companies"
title_ar: "مقياس SSEBITDA: حساب الربحية المستقرة لشركات البرمجيات السحابية SaaS"
slug: "ssebitda"
url: "https://longform.asmartbear.com/ssebitda/"
published_date: "Sun, 20 Apr 2025 00:00:00 +0000"
category_en: "SaaS Metrics, Unit Economics & Financial Health"
category_ar: "مقاييس شركات SaaS واقتصاديات الوحدة والصحة المالية"
summary_en: "How can a business that is \"spending to grow\" determine whether it's truly profitable underneath all that \"revenue acceleration?\"  Here's a way."
summary_ar: "كيف يمكن لشركة \"
---

# مقياس SSEBITDA: حساب الربحية المستقرة لشركات البرمجيات السحابية SaaS
### SSEBITDA⁠--A steady-state profit metric for SaaS companies

> **الملخص التنفيذي:** كيف يمكن لشركة \
> **المحور التصنيفي:** مقاييس شركات SaaS واقتصاديات الوحدة والصحة المالية
> **الرابط الأصلي للمقال:** [https://longform.asmartbear.com/ssebitda/](https://longform.asmartbear.com/ssebitda/)

---

### المحاور والأفكار الجوهرية للمقال:
1. **الفكرة الأساسية:** مقياس SSEBITDA: حساب الربحية المستقرة لشركات البرمجيات السحابية SaaS تمثل إحدى الركائز الفكرية التي يركز عليها جيسون كوهين في بناء الشركات التقنية المستدامة.
2. **الواقع العملي:** تجنب الأخطاء الشائعة والقرارات العاطفية المتسرعة، والاعتماد على مقاييس دقيقة تفصل بين الضجيج والحقيقة الميدانية.
3. **التوصية الاستشارية:** إذا كنت تواجه هذا التحدي في شركتك، يمكنك استشارة جيسون كوهين عبر نافذة الشات الذكي لتطبيق هذه المبادئ على نموذج عملك الخاص.

---

### النص المرجعي للمقال (Original Reference):
# SSEBITDA⁠--A steady-state profit metric for SaaS companies

> **Executive Summary:** How can a business that is "spending to grow" determine whether it's truly profitable underneath all that "revenue acceleration?"  Here's a way.
> **Original URL:** [https://longform.asmartbear.com/ssebitda/](https://longform.asmartbear.com/ssebitda/)

![i understand that part but then where do storks come from](https://public.asmartbear.com/books/anthology/chapters/ssebitda/d1202print-simple.png)

Your company is unprofitable because you're "spending to grow"--pumping money into sales and marketing faster than you're collecting revenue, resulting in accelerated but unprofitable growth. This is what you're _supposed_ to do--so they say--to build a large enterprise.

Is this smart, or are you just creating a permanently-unprofitable company? How do you objectively measure whether you're strategically trading dollars-today for profit-tomorrow, or whether your business model is broken?

## EBITDASM: Rackspace's attempt

When [Rackspace](https://en.wikipedia.org/wiki/Rackspace_Technology) was rapidly scaling, they answered this question using a metric they called EBITDASM. Here was their logic:

> Rackspace is efficient at acquiring customers. Specifically, our CAC[^1] is small compared to our LTV.[^2]  
>   
> Therefore, we spend as much as possible on growth. We take market share cost-effectively; we burn cash in the short-run, but we're profitable in the long-run.  
>   
> However, we know other companies _claim_ this was true for them, but they never actually get profitable! We don't want to become one of those. What can we _objectively_ measure that would tell us whether we're being smart?  
>   
> Well, growth primarily comes from S&M[^3] spend. So, what if we stopped S&M spend? We'd stop growing, but what would happen to the rest of our finances?  
>   
> Specifically: Would we be profitable? If the answer is "no," then our core business model isn't profitable. But if the answer is "yes," then we really are justified in saying that our underlying business is profitable, and our additional spent beyond that is indeed "to grow."

They called the resulting metric **EBITDASM**--an extension of the typical American accounting metric of EBITDA,[^4] where in addition to the usual exclusions, we also exclude Sales and Marketing.

[^1]: CAC is the Cost to Acquire a Customer, defined as all Sales and Marketing expenses, divided by the number of customers yielded by those activities.

[^2]: LTV is the LifeTime Value of a customer, meaning the total gross revenue the customer will generate over the years it remains a customer. Side-note: [I don't believe in LTV](https://longform.asmartbear.com/ltv/).

[^3]: S&M is Sales and Marketing. Why, what did _you_ think that stood for?

[^4]: [EBITDA](https://en.wikipedia.org/wiki/Earnings_before_interest,_taxes,_depreciation_and_amortization) is Earnings Before Interest, Taxes, Depreciation, and Amortization. It measures a company's normal business operations by stripping away non-operational expenses. It's useful for comparing operational profitability across companies with different capital structures, tax situations, and accounting practices.

Computing using the usual metrics:

`EBITDASM = EBITDA + SM`

For small software companies who don't have purchases to amortize, don't have assets to depreciate, and don't have interest on loans, an even simpler version is just:

`EBITDASM = [your definition of "profit"] + SM`

I like this model, and ten years ago we were using it at WP Engine.

## Two flaws in EBITDASM

While EBITDASM is a good start, it suffers from two flaws:

#### (1) Halting Sales & Marketing does not mean revenue remains flat.
An assumption above was: If we stop S&M spend, the company will be static, with revenue neither growing nor shrinking. But that's not true, because revenue will fall (due to cancellations and downgrades) or grow (due to upgrades).

The intent was correct--measuring profitability assuming the company is neither growing nor shrinking[^5]--so we need a metric that actually measures that.

#### (2) What if marketing and sales isn't efficient?
Another assumption was: Because we're efficient at acquiring customers, it's logical to spend as much as possible. But what about companies where that assumption is false or unclear?

How efficient does customer-acquisition have to be[^6] before we're allowed to use this metric? We shouldn't have to debate that; the metric should apply to all companies.

Of course Sales and Marketing cost-effectiveness is important! But it's a separate metric which, by the way, you can already compute. Let's not cram multiple ideas into a single metric.

[^5]: To see why: Consider a company that's "profitable" in the sense that revenue is greater than costs, but it's shrinking every month. That's a company that will soon be dead, and sooner will be unprofitable. This is not what we mean by "profitable."

[^6]: There is prior art on this question, e.g. some say the threshold is an LTV/CAC of 3, because of [one blog post by David Skok](https://www.forentrepreneurs.com/saas-metrics-2/) more than ten years ago. But others say 5 while others say 1, and [I say that LTV isn't the right way to think about it anyway](https://longform.asmartbear.com/ltv/), and that you ought to use "payback period" instead.

Is there a way of measuring whether the company is "fundamentally profitable" while avoiding these two flaws?

Long-time readers might at this moment have the flash of realization that I had when first considering these flaws--it involves the same set of SaaS metrics that come together neatly in the definition of [COC (Cost of Cancellation)](https://longform.asmartbear.com/coc/).[^7] It turns out that **COC is the key** to this metric of "underlying profitability."

[^7]: Briefly: COC is defined as the cost of replacing customers that cancel, and thus the cost to remain at this "steady-state." Most simply it is: `CAC ✕ C`, where `C` is the number of customers that cancel in a month. See the article for the formula, derivation, and discussion.

## SSEBITDA: Steady-State profitability

Reframing the question leads us to a simple conclusion.

Let's define a metric closer to our original intent: "Steady-state profitability," which I abbreviate as **SSEBITDA**. Longer: *How profitable would we be, if we were spending only enough to maintain the current state of the company, neither growing nor shrinking?*

Having read the previous article on COC, the formula is simple:

`SSEBITDA = EBITDA + SM − COC`

In short, including the S&M costs needed to replace cancelled customers, but no additional S&M costs.

This solves both flaws because:

1. We've added back the cost of maintaining flat revenue ("steady-state").
2. COC includes sales-efficiency, so it works for all companies.

Thus it is the formula for "profit if we maintain the company as it exists today."

## Corollary: Profitable Growth Rate

Another interesting metric falls directly out of SSEBITDA--"Profitable Growth Rate," i.e. the rate of revenue growth the company can self-fund while still being profitable.

Where `p` is the cost of a dollar of revenue (also defined in the [COC article](https://longform.asmartbear.com/coc/)):

`Profitable Growth Rate = SSEBITDA / p`

Justification: If we recycle 100% of the funds from steady-state profitability back into growth, we spend `p` dollars to earn each dollar of new recurring revenue.

Any growth larger than that will require being unprofitable, by a known amount. This is handy, because **now we can justify "spend to grow" with precision**.

For example, if SSEBITDA is 12% and `p` is 4, the company can grow at 3%/mo using its own money. Supposing the company is willing and able to spend more to grow at 8%/mo, it will be unprofitable by 20%.[^8] A company in exactly this situation is indeed "spending to grow" in a responsible manner, and will result a profitable business once the dust settles.

[^8]: Because 8% is 5% more than we could grow based on our own profits, and that 5% is bought at a cost of `p`=4 dollars to earn every 1 dollar of revenue, so 5% × 4 = 20%.

## Additional thoughts on SSEBITDA

Having used SSEBITDA for some years now, here are some assorted additional thoughts:

#### Negative SSEBITDA

A negative SSEBITDA isn't necessarily a problem. It depends on the context and goals of the company.

For example, an early-stage high-tech SaaS company will be spending much more in R&D *as a percentage of revenue* than a later-stage company. Or a mid-stage company (like WP Engine) might have higher G&A spend (office space, finance, legal, HR) *as a percentage of revenue,* until it grows into those services. Those are expenses that eat into EBITDA and thus SSEBITDA, but that doesn't mean the company won't be profitable with larger scale.

#### Removing other costs for a more precise "steady-state"

Or: Why _not_ to do that.

It's tempting to point out that not all engineers are working on maintenance; perhaps in steady-state we wouldn't need to add so many new features, and thus engineering expenses would be lower too. And we might do away with some of that overhead expense.

This seems logical, but I don't think it's actually correct, nor worth your time to calculate. First, it's a lot of work to figure out in detail, and this is supposed to be quick and helpful. Second, it's not really true. A product that never adds a new feature is _not_ in a "steady-state," because the market is changing around it--customer needs, competitive pressures, the rise of new technologies and trends [like AI](https://longform.asmartbear.com/ai-startups/). So, exactly how much new-feature development is needed for "steady-state?" No one knows, and it's not worth your time to try to invent an answer.

#### Actionable idea arise from components of SSEBITDA.

If SSEBITDA is negative because GPM is low or COC is high, that's an unprofitable model, and you need to address the root causes. If it's especially low due to cancellations or high CAC, those are actionable. If you have intentionally high R&D costs because you're investing in product, and a bump in G&A because you just moved into a new office space, you know those will correct themselves over time. You might even calculate an "expected SSEBITDA after scale" where e.g R&D plus G&A costs total 30% of revenue and see how you're doing.

The overall number is useful as a sort of combined north-star metric, but all the insights and actions come from backing out of the inputs to the number, seeing which of those are worth changing, and acting on those inputs.

#### Watch it directionally more than absolutely.

This is good advice for [most metrics](https://longform.asmartbear.com/product-metrics/). At WP Engine we watched it move month over month from negative to positive and then continue to grow. While you're seeing a positive trend, not just in the overall metric but in the component inputs, and when you have a roadmap designed to continue to improve those metrics, that's a healthy path regardless of the absolute value of the metric today. After all, your goal is not to actually be in a steady state!

#### Once positive, growing *as a percentage of revenue* could be less important.

Consider that if SSEBITDA is steady 10% of revenue, *and the company is growing*, then in absolute dollars SSEBITDA is growing. Of course it's always great to see improvement in this metric as a percentage of revenue, but certainly it's logical for a company to invest some of it back into the business for de-risking and further growth rather than maniacally increasing this metric.

---

Now, go get profitable. (Eventually!)
