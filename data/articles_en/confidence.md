---
id: 2
title: "Lost confidence"
slug: "confidence"
url: "https://longform.asmartbear.com/confidence/"
pubDate: "Sun, 21 Jun 2026 00:00:00 +0000"
summary: "RICE and other confidence-based frameworks are mostly noise. Here's how to make decisions without pretending to know the unknowable."
---

# Lost confidence

> **Executive Summary:** RICE and other confidence-based frameworks are mostly noise. Here's how to make decisions without pretending to know the unknowable.
> **Original URL:** [https://longform.asmartbear.com/confidence/](https://longform.asmartbear.com/confidence/)

![no i dont want to make wish where did you get that](https://public.asmartbear.com/books/anthology/chapters/confidence/d0704print-simple.png)

## Confidence games

Many prioritization frameworks include a measure of confidence[^1]--how sure we are that we can execute, at more or less the predicted effort, resulting in more or less the predicted impact. This sounds rational: If two projects generate equal value for equal effort, but we're confident we can execute the first and unsure about the second, we should pick the first.

[^1]: Or a measure of risk. The reader will decide whether or not $\text{risk} = 1 - \text{confidence}$.

This is not, however, how we use confidence scores. If it were, our process would look like this:

1. Score projects.
2. If there's one clear winner, do it.
3. If there's a tie, pick the one we are more confident in.

That's not a bad idea, but popular frameworks like RICE include "confidence" in step one:

$$\text{Score} = \dfrac{\text{Reach}\times\text{Impact}\times\text{Confidence}}{\text{Effort}}$$

So does RPS:

$$\text{Score} = \text{Reach}\times\text{Potential}\times\text{Solution Confidence}$$

Which means, for example, the following two scenarios are deemed equally strong:

1. A small incremental feature, that we're sure we can execute.
2. A large feature, with large impact, that carries risk.

This equality is false. Especially when you remember that these two scenarios are nearly always exactly what we're choosing from--we're typically confident in small projects and unconfident in larger projects, as well we should be.[^2] But that systematically skews the prioritization away from delivering as much value as possible, which I have often argued is the opposite of what a prioritization framework ought to do.

[^2]: If you disagree, consider that the primary motivation for the Agile movement was the insight we should *always* have low confidence that large projects will be successful, despite our best techniques of planning, analysis, and estimation. And also consider [this theory of Rocks, Pebbles, and Sand](https://longform.asmartbear.com/rocks-pebbles-sand/).

**I don't believe your confidence score anyway.** First, because it's ill-defined. What does "30%" mean? [What it _should_ mean](https://longform.asmartbear.com/probability-words/), is you track your confidence scores across all projects, and then see how those projects went, and from that data, compute how accurate your "confidence" scores were [with mathematical precision](https://longform.asmartbear.com/forecast/). But you don't do that, do you? And if you only ship a few major features per year, you don't have enough data to know, [even in hindsight](https://longform.asmartbear.com/unmeasurable-metrics/).

The second reason I don't believe you is because we all know that projects are nearly always late, and often have less impact, less quickly, than we wanted--no matter how confident we were. Indeed, we were always at least "fairly confident" or else we wouldn't have agreed to do a nine-month, six-team project. So what weight should we place on "confidence?"

> **Hofstadter's Law**  
> It always takes longer than you expect, even when you take Hofstadter's Law into account.

For more empirical evidence that "confidence" is useless, find any [experienced Product Manager](https://longform.asmartbear.com/great-product-manager/) and ask: "Can you recall a feature you were *certain* would be well-received, but wasn't?" Perhaps they had evidence from customer conversations, explicit requests, or purchase commitments--yet after building it, almost no one used it, including those who promised they would. Their eyes will roll as they share multiple stories. This doesn't make them a bad PM. Everyone has these stories. That's my point. The best PMs have techniques to mitigate this problem,[^3] but none will claim they can eliminate it entirely.

[^3]: Some techniques to improve prediction include asking customers to describe exactly how they would use a feature in their normal workflow. Often people genuinely think they would use something, but when forced to walk through it step-by-step, they realize, "Oh wait, this would require me to rewrite this code, we probably wouldn't do that." Or, "I'd need to export it into another system--actually, never mind."

Similarly, ask content creators about their most successful work. Often it's something they hastily produced--a trivial piece they almost didn't publish because it felt uninsightful or trite--yet it generated more views and engagement than anything else that year. Conversely, pieces they spent dozens of hours crafting, work they're genuinely proud of and consider their best, generate minimal interest:

![The secret to growing on Twitter for me has been to spend hours writing threads that get no traction and then to spend 10 min writing two tweets that each attract 15K+ followers.](https://public.asmartbear.com/books/anthology/chapters/confidence/twitter-growth-simple.png)

We can summarize the relationship between our confidence and actual results in a handy two-by-two table:

|  |  |  |
|:---:|:---:|:---:|
|  | **Was confident** | **Was not confident** |
| **They loved it** | Lots of examples | Lots of examples |
| **Nobody cared** | Lots of examples | Lots of examples |

So, if "confidence" is too nebulous to define, and we shouldn't trust ourselves with it anyway, what should we do?

## What to use in place of confidence and risk

The answer lies in the realm of uncertainty, rather than of probability.

Probability presumes you know the underlying distribution, enabling mathematical predictions about future events. You can predict that flipping a fair coin 100 times is highly likely to result in between 40 and 60 heads, because you know the underlying probability distribution of fair coin flips. If predicting whether a feature will create defensible differentiation were like flipping a coin 100 times, you could use probabilities.[^4]

Almost nothing in a startup is like that. Outcomes cannot be assigned meaningful probabilities because things like startup success, strategy, and features are unprecedented, or too complex to model accurately, or we have no precision on the input variables. This is the domain of uncertainty.[^5]

[^4]: If you're tempted to claim that Bayesian methods could still work, remember that you need numeric priors and conditional probabilities, both of which we established above are unknowable and ill-defined.

[^5]: Often called "Knightian Uncertainty" after economist Frank Knight in his 1921 work "Risk, Uncertainty, and Profit."

In the uncertainty domain we ask: What actions are wise regardless of the probability distribution?

I've previously written about [embracing uncertainty in overall product strategy](https://longform.asmartbear.com/predict-the-future/). Below, I'll address a more specific question: How should we *prioritize* ideas in an uncertain world?

Here are some techniques.

### True always

What is always true under any circumstance? This is Bezos's principle of focusing on long-term constants.[^6] For instance, users universally appreciate fast, responsive software. They value web apps that feel native, with background synchronization and instant interactions, that work well on all their devices. Even in the worst case, where they don't care about speed, they still wouldn't say that speed was a negative; at best (in web apps like Notion, Figma, Miro, Gmail, and Google Docs), performance becomes a key differentiator that customers explicitly value.

[^6]: Bezos frequently said of Amazon's strategy: When you have something that you know is true, even over the long term, you can afford to put a lot of energy into it. His examples include customers wanting lower prices, faster shipping, and fast, fair customer service.

Not all features enjoy universal appeal. Rather than attempting precise numerical breakdowns of potential user interest, identify the features where essentially all customers will either value them, or at least enjoy them. Sometimes this certainty exists because it is mandatory, even if mundane. Enterprise requirements like SOC 2 compliance aren't exciting, but they're undeniably valuable when selling to enterprises. This certainty compensates for the lack of differentiation.

The caveat: your most innovative, differentiated ideas rarely fall into this "absolutely certain" category. While certainties are valuable, they're unlikely to be your strategic differentiators. This tension is natural--great products require both reliable improvements and innovative leaps of faith.

![Absolutely! 100 percent! Guaranteed! Most of the time.](https://public.asmartbear.com/books/anthology/chapters/confidence/d8580print-simple.png)

### Quick discovery, quick recovery

I've been a long-time advocate of [systematically interviewing potential customers](https://longform.asmartbear.com/customer-development/) to validate ideas before you start building. Still, I have to admit that this falls into the "confidence" trap. You never really know until you build. (You can, however, *invalidate* before you build, saving you months if not years of wasted time; therefore this is still the right place to begin.)

The typical solution is to build an [SLC](https://longform.asmartbear.com/slc/) (my upgrade to the concept of the MVP)--a simple but complete product that generates genuine feedback. Experience, rather than prediction. For existing products, that means maintaining a [balanced](https://longform.asmartbear.com/conflicting-choices/) portfolio between guaranteed wins and innovative bets, applying different validation methods to each.

For example, consider implementing "dummy features"--buttons that, when clicked, reveal: "This feature isn't built yet. Tell us how you'd use it." This simple test provides real signals: a count of interested users and potential interview candidates who've demonstrated interest through action rather than words. They can provide insights before you build the feature.

This approach generates 100x better signal than surveys asking hypothetical questions. People easily say "yes" to survey questions about whether they'd use some feature, but taking an action--even clicking a button--requires genuine interest. Observed behavior beats stated intentions.

### Focus instead on customer impact

Replace confidence with impact. I define impact in two distinct ways:

#### Majority rule
When the majority of users regularly use a feature, it's undeniably important--likely a key reason people adopt and retain your software.

#### Passionate advocates
Features that create passionate advocates among a smaller subset of users--people who say they bought your product _only_ because of _this one thing_. These "magnificent delighters" won't appeal universally, but they inspire deep loyalty in specific segments. Like a piece of music that's someone's all-time favorite, even if most people merely acknowledge it's decent.

These are what determine purchase decisions. Your product rarely satisfies every need perfectly, for every customer, but when users absolutely love certain aspects, they'll tolerate shortcomings elsewhere. Or the reverse--the magic of the iPod meant we put up with iTunes--possibly the worst software to be used by at least a billion people. We see this with [beautifully designed](https://longform.asmartbear.com/design/) software--users accept missing functionality or limited platform support because the design experience itself is so compelling. There are [many other reasons](https://longform.asmartbear.com/willingness-to-pay/) for a customer to [love you despite your failings](https://longform.asmartbear.com/customer-love/).

I quantify this notion of impact with this definition: A high-impact feature is either (1) regularly used by at least 51% of customers, or (2) cited by at least 15% of customers in their top three reasons for choosing or retaining your product.

This sets a high bar, but innovative, risky features demand a high bar. If you're undertaking projects that might exceed timelines or have uncertain outcomes, the magnitude of the potential reward must justify that risk.

### Invest in leverage

There are some aspects of the business or product where small, incremental changes yield large results. It sounds too good to be true, but there are mathematical or structural areas where it is almost always true.

Here I'll promote [my new book _Hidden Multipliers_](https://hiddenmultipliers.com/), which details eleven such areas of leverage, where small changes create outsized growth with your current budget and team.

There. End of advertisement.

### Maximize optionality

If we don't know how the future will unfold, we can make choices that maximize how many options we _will_ have when we get there. More than flexibility, more than avoiding lock-in, building systems that are built to handle anything that arises.

Some examples:

* Keeping costs low enables all manner of pricing and packaging while still being profitable, allowing for testing today and resilience in the future.
* Selecting well-established, actively-developed, cross-platform libraries and frameworks for building user interfaces, so you're able to handle any evolution in platforms and devices.
* Plug-in architecture, so that both you and your community can build things that you cannot imagine today.
* API-first architecture to isolate teams, and connect your own front-end tools, back-end systems, and customer integrations.
* Wrappers around vendor services, so that you can swap out vendors if one becomes unstable, or too expensive, or lags behind others.

Future optionality requires additional work today. For example, adding vendor-wrapping APIs doesn't add any value today. Those techniques are wise for [mature companies where stability and predictability are more important](https://longform.asmartbear.com/scale/) than releasing a feature a month earlier, but might be the wrong choice for early-stage companies that must rely on their velocity to [win against incumbents](https://longform.asmartbear.com/startup-beats-incumbent/).

The way you maximize optionality for the future of the entire company, is to build a great company, by which I mean all the usual things: Healthy but sustained growth, large and expanding gross margins, customers who love you as evidenced by retention, upgrades, and online chatter; employees who love you as evidenced by longevity, career advancement, and online chatter, and so on. Because a great company has lots of options--could be acquired, and not on terrible terms, could run like this for a long time, could raise money, could never raise money, might go public if it gets big, might be passed down to employees or children if it doesn't.

### Portfolio of bets

Portfolios reduce variability at the expense of also reducing maximum upside. That is, you're unlikely to have zero wins (so your downside isn't too bad), but wins have to make up for the losses, so even the occasional massive win isn't nearly as massive as it would have been. The old joke is that the best investment portfolio would have been to buy Amazon at IPO and hold forever. Sure, but if you applied that advice to some other IPOs that year, you'd have $0. A portfolio of stocks means you'll never go to zero, but your maximum growth will be far less than the best stock in the portfolio.

#### Mathematical sidebar
Why do portfolios work regardless of the underlying probability distributions? Because of [the Central Limit Theorem](https://en.wikipedia.org/wiki/Central_limit_theorem), which works like this: Suppose you draw a random sample of N items from a population. The population has a stable _but unknown_ probability distribution. That sample will have some mean. Now draw a new random sample of N items, and compute the new sample's mean. Keep repeating that, and plot a histogram of those sample means. _That_ histogram is converges to a Gaussian--a normal distribution--with mean equal to the population's mean and variance equal to $\frac{1}{n}$ of the population's variance. So, average portfolio results are normally-distributed regardless of the underlying probability distribution.

Even further, the [The Lindeberg--Lévy Central Limit Theorem](https://en.wikipedia.org/wiki/Lindeberg%27s_condition) shows that the same is true even when each sample is drawn from a _different_ underlying probability distribution. This holds only under certain conditions (independence, finite variance, and no single variable dominates all others). Arguably these conditions fail with distributions common in startup environments, e.g. some Power Laws have infinite variance.

Portfolios work when you value getting predictable but typical outcomes. They don't work when you want outlier results, but you have to accept a the large risk that you won't get that outcome. An example of the latter is a venture or angel portfolio, where [65% of those portfolios lose money](https://www.sethlevine.com/archives/2020/10/vc-fund-returns-are-more-skewed-than-you-think.html) and [only 10%](https://www.saastr.com/why-only-12-of-vcs-can-be-considered-successful-max/) generate returns high enough to justify the risk and illiquidity. When hunting outliers, you need [all-in investments](https://longform.asmartbear.com/investment/), not portfolios.[^7]

[^7]: Mathematically, the reason for this breakage is that the underlying distribution of startup returns is a Power Law that violates the Lindeberg criteria mentioned above.

Therefore, if the goal of your prioritization exercise is to find features that will be strong differentiators in the market and strong growth drivers, a portfolio is the wrong tool. On the other hand, if you're prioritizing a bunch of smaller things, where you want incremental but reliable results, a portfolio will get you those results. No need to argue about confidence.

### Asymmetric bets

The natural counterpart to a portfolio. Portfolios work when you want reliability; asymmetric bets work when you want outliers. You're not predicting whether the bet pays off--we've established you can't--you're taking bets with limited and quantifiable downside, yet with large potential upside.

If the worst case is "we lose two months" and the best case is "we're completely differentiated," the probability barely matters. You only need the downside to be survivable, and the upside large enough that one win pays for ten losses. The exact probabilities are unknowable; the *shape* of each bet is not.

Most asymmetric bets at the strategic level arrive pre-shaped--a new market with compounding referrals, a moat that gets deeper the longer you dig. At the feature level, you usually have to *construct* the asymmetry yourself, because the default shape of a software project is a slow drift from "two weeks" to "two months" to "we've spent so long we have to finish it." The mechanism is a budget you write down before you start: two engineers, three weeks, then we stop and look. The time-box is the bounded downside.

Another thing you can do is replace "confidence" with "how asymmetric." RICE asks you to estimate a probability you've already conceded you can't know. Asymmetry asks you to estimate two things you actually can: the worst case in time and money, and the best case in customer value. Both are concrete. Both you can argue about in a meeting and converge on a number you'd defend, at least if you restrict yourself only to powers-of-ten for all numbers, [as you should anyway](https://longform.asmartbear.com/roi-rubric/).

---

Stop pretending you can quantify confidence, or even define it.

Instead, use techniques that work whenever the future is unpredictable.

Because it always is.
