---
id: 188
title_en: "Easy statistics for A/B testing and hamsters"
title_ar: "Easy statistics for A/B testing and hamsters"
slug: "ab-testing-statistics"
url: "https://longform.asmartbear.com/ab-testing-statistics/"
pubDate: "Mon, 06 Apr 2009 08:00:00 +0000"
category_en: "Pricing Strategy & Monetization"
category_ar: "استراتيجيات التسعير ونماذج تحقيق الدخل"
summary_en: "A/B testing tools often lie about whether something is \"statistically significant.\" Here's an extremely simple, mathematically sound formula to compute it for yourself."
summary_ar: "A/B testing tools often lie about whether something is \"statistically significant.\" Here's an extremely simple, mathematically sound formula to compute it for yourself."
---

# Easy statistics for A/B testing and hamsters
### Easy statistics for A/B testing and hamsters

> **الملخص التنفيذي:** A/B testing tools often lie about whether something is "statistically significant." Here's an extremely simple, mathematically sound formula to compute it for yourself.
> **المحور التصنيفي:** استراتيجيات التسعير ونماذج تحقيق الدخل
> **الرابط الأصلي للمقال:** [https://longform.asmartbear.com/ab-testing-statistics/](https://longform.asmartbear.com/ab-testing-statistics/)

{{<youtube id="FaUO2-AQmr0">}}

_This video explains the concept, as well as the statistical principle that explains the mental fallacy that tricks us when we reason about rare events._

---

So you've got your AdWords test all set up: Will people go for the headline "Code Review Tools" or "Tools for Code Review?"

Gee they're both so exciting! Who could choose! I know, I know, settle down. Welcome to A/B testing.

Anyway, the next day you have this result:

|             | Variant A  <br/>  "Code Review Tools" | Variant B  <br/>  "Tools for Code Review" |
|------------:|:--------------------------------:|:------------------------------------:|
| **Clicks:** | 31                               | 19                                   |

**Is this conclusive?** Has A won? Or should you let the test run longer? Or should you try completely different text?

**The answer matters.** If you wait too long between tests, you're wasting time. If you don't wait long enough for *statistically conclusive* results, you might *think* a variant is better and use that false assumption to create a new variant, and so forth, all on a wild goose chase! That's not just a waste of time, it also prevents you from doing the *correct* thing, which is to come up with a *completely new test*.

**Normally a formal statistical treatment would be too difficult, but I'm here to rescue you** with a statistically sound yet incredibly simple formula that determines whether your A/B test results really are significant.

I'll get to it in a minute, but I can't help but include a more entertaining example than AdWords. Meet Hammy the Hamster, the probably-biased-but-incredibly-lovable tester of organic produce:

{{<youtube id="8z8CWdRaQpw" title="Hammy the Hamster Goes Organic">}}

In the movie, Hammy chooses the organic produce **8 times** and the conventional **4 times**. This is an A/B test, just like with AdWords... but healthier.

If you're like me, you probably think "organic" is the clear-cut winner--after all Hammy chose it *twice as often* as conventional veggies. But, as so often happens with probability and statistics, **you'd be wrong**.

That's because human beings are notoriously bad at guessing these things from gut feel. Most people are more afraid of dying in a plane crash than a car crash, even though the latter is [1000x more likely](https://injuryfacts.nsc.org/all-injuries/preventable-death-overview/odds-of-dying/). On the other hand, we're amazed when CNN "calls the election" for a governor with a mere 1% of the state ballots reporting in.  We also [can't distinguish between patterns and noise](https://longform.asmartbear.com/pattern-seeking-fallacy/).

Okay okay, we suck at math. So what's the answer? Here's the bit you've been waiting for[^1]:

[^1]:  For the mathematical derivation, see the end of the article.

## Determining whether an A/B test is statistically significant 
1. Define {{<katex>}}N{{</katex>}} as "the number of trials."  <br/>  For Hammy, {{<katex>}}N = 8+4 = \mathbf{12}{{</katex>}}  <br/>  For AdWords, {{<katex>}}N = 31+19 = \mathbf{50}{{</katex>}}  <br/><br/>
 2. Define {{<katex>}}D{{</katex>}} as "half the difference between the 'winner' and the 'loser.'"  <br/>  For Hammy, {{<katex>}}D = \dfrac{8-4}{2} = \mathbf{2}{{</katex>}}  <br/>  <br/>  For AdWords, {{<katex>}}D = \dfrac{31-19}{2} = \mathbf{6}{{</katex>}}   <br/><br/>
 3. The test result is statistically significant only if {{<katex>}}D^2 > N{{</katex>}}.  <br/>  For Hammy, {{<katex>}}D^2 = 4{{</katex>}}, which is *not* bigger than {{<katex>}}12{{</katex>}}, so it is *not significant*.  <br/>  For AdWords, {{<katex>}}D^2 = 36{{</katex>}}, which is *not* bigger than {{<katex>}}50{{</katex>}}, so it is *not significant*.

---

So your AdWords test isn't statistically significant yet. But you let the test continue to run. The next day you find 31 more clicks for variant A, and 19 more clicks for B.  Rerunning the test, the measured difference is now significant:

|              | Variant  <br/>  A | Variant  <br/>  B | {{<katex>}}N{{</katex>}} | {{<katex>}}D{{</katex>}} | {{<katex>}}D^2{{</katex>}} | Stat  <br/>  Sig? |
|-------------:|:------------:|:------------:|-----------|-----------|-------------|--------------|
| **Day one:** | 31           | 19           | 50        | 6         | 36          | No           |
| **Day two:** | 62           | 38           | 100       | 12        | 144         | Yes          |

A lot of times, though, you keep running the test and it's still not significant. That's when you realize you're not learning anything new; the variants you picked are not meaningfully different for your readers. That means it's time to come up with something new.
![Cartoon 3f0b51c8](https://longform.asmartbear.com/ab-testing-statistics/3793ebdc.png)

When you start applying the formula to real-world examples, you'll notice that **when N is small, it is difficult--or even impossible--to be statistically significant**. For example, say you've got one ad with 6 clicks and the other with 1. That's {{<katex>}}N = 7; D = 2.5; D^2 = 6.25{{</katex>}}. So the test is still inconclusive, even though A is beating B six-to-one. Trust the math here--with only a few data points, you really don't know anything yet.

The smaller the {{<katex>}}N{{</katex>}}, the bigger the difference needs to be, to be detectable.  Specifically, results are significant only if the ratio between `A` and `B` is larger than {{<katex>}}\frac{\sqrt{N}+2}{\sqrt{N}-2}{{</katex>}}. So for example, if {{<katex>}}N = 50{{</katex>}}, as it was in our "day one A/B test" example, the winning variant needs to be almost double the number of clicks as the losing variant in order to have a detectable difference, e.g. a conversion rate of 10% versus 5%.  This is a huge difference; it's great if you find something so dramatically better, but this is rare, and therefore you can almost never find a significant A/B test given only 50 clicks to analyze.

When {{<katex>}}N = 100{{</katex>}}, the winner needs to be at least 50% higher than the loser (which it was by the second day in our example). It takes {{<katex>}}N = 1800{{</katex>}} to detect the case where the winner is only 10% larger than the loser.

And this is bad news for A/B tests, because often one variant isn't better than the other by more than 10%, e.g. a "2.4% conversion rate" versus a "2.2% conversion rate."  What does this mean, especially if you don't have large N?  It means **you need to be seeking big differences**, not subtle ones.  Test wildly different designs, rather than tweaks.  Tweaks can only be tested when {{<katex>}}N{{</katex>}} is enormous.

I hope this formula will help you make the right choices when running A/B tests. It's simple enough that you have no excuse not to apply it! Human intuition sucks when it comes to these things, and A/B testing tools often use misleading or incorrect math, so let this formula help you draw the right conclusions. 

## Appendix for the mathematically inclined: The derivation 
The [null-hypothesis](http://en.wikipedia.org/wiki/Null_hypothesis) is that the results of the A/B test are due to chance alone. The statistical test we need is [Pearson's chi-squared](https://en.wikipedia.org/wiki/Pearson%27s_chi-squared_test)[^2].

[^2]:  Not the Student t-test as is commonly claimed by people online who have only a passing familiarity with statistics; the t-test is appropriate with continuous, normally-distributed random variables, whereas {{<katex>}}\chi^2{{</katex>}} is appropriate for categorical random variables from independent trials and arbitrary probability distributions, which is what an A/B test is.

The definition of the {{<katex>}}\chi^2{{</katex>}}  statistic follows, where:

{{<raw-html>}}<span class="indent-2">{{</raw-html>}}{{<katex>}}m{{</katex>}} = number of possible outcomes;  <br/>  {{<katex>}}O_k{{</katex>}} = observed quantity of results in category {{<katex>}}k{{</katex>}};  <br/>  {{<katex>}}E_k{{</katex>}} = expected quantity of results in category {{<katex>}}k{{</katex>}}: {{<raw-html>}}</span>{{</raw-html>}}

{{<katex display>}}\chi^2 = \sum_{k=1}^{m} \frac{(O_k - E_k)^2}{E_k}{{</katex>}}

In the simple case of a two-variant A/B test, `$m = 2$`.  {{<katex>}}O_1{{</katex>}} and {{<katex>}}O_2{{</katex>}} are the observed results, and definitionally {{<katex>}}N = O_1 + O_2{{</katex>}}.  The expected result under the null-hypothesis is that the quantities fall equally into each category, therefore {{<katex>}}E_1 = E_2 = N/2{{</katex>}}. 

Plugging this into the definition:

{{<katex display>}}\chi^2 = \frac{(O_1 - \frac{N}{2})^2}{\frac{N}{2}} + \frac{(O_2 - \frac{N}{2})^2}{\frac{N}{2}}{{</katex>}}

The first numerator can be rewritten in terms of {{<katex>}}O_1{{</katex>}} and {{<katex>}}O_2{{</katex>}} by substituting  {{<katex>}}N = O_1 + O_2{{</katex>}}, and this results in our variable {{<katex>}}D^2{{</katex>}} as defined in the main text:

{{<katex display>}}\begin{aligned}
\left(O_1 - \frac{N}{2} \right)^2 &= \left(O_1 - \frac{O_1 + O_2}{2} \right)^2 \\
	&= \left(\frac{2O_1 - O_1 - O_2}{2} \right)^2 \\
	&= \left(\frac{O_1 - O_2}{2} \right)^2 \\
	&= D^2
\end{aligned}{{</katex>}}

We can repeat with the second numerator, and so the expression simplifies:

{{<katex display>}}\begin{aligned}
\chi^2 &= \frac{(O_1 - \frac{N}{2})^2}{\frac{N}{2}} + \frac{(O_2 - \frac{N}{2})^2}{\frac{N}{2}} \\
	&= \frac{D^2}{\frac{N}{2}} + \frac{D^2}{\frac{N}{2}} \\
	&= \frac{2}{N}(2D^2) \\
	&= \frac{4D^2}{N}
\end{aligned}{{</katex>}}

Now that we have a simple formula for the chi-squared statistic, we refer to the chi-squared distribution to determine statistical significance. Specifically: What is the probability this result would have happened by chance alone?

Looking at [the distribution](http://www.itl.nist.gov/div898/handbook/eda/section3/eda3674.htm) at 1 degree of freedom, we must exceed 3.8 for 95% confidence and 6.6 for 99% confidence. For this simplified rule-of-thumb formula, I selected 4 as the critical threshold. Solving for {{<katex>}}D^2{{</katex>}} completes the derivation:

{{<katex display>}}\begin{aligned}
\chi^2 &> 4 \\
\frac{4D^2}{N} &> 4 \\
D^2 &> N
\end{aligned}{{</katex>}}

(Further, if {{<katex>}}D^2{{</katex>}} is more than double {{<katex>}}N{{</katex>}}, you're well past the 99% confidence level.)

Deriving the other statement in the article--that the ratio between the two variants needs to exceed a certain threshold to be significant--start with the boundary condition of being significant, and derive the values of {{<katex>}}A{{</katex>}} and {{<katex>}}B{{</katex>}} in that case:

{{<katex display>}}\begin{aligned}
D^2 &= N \\
D &= \sqrt{N} \\
A-\frac{N}{2} &= \sqrt{N} \\
A &= \frac{N}{2} + \sqrt{N}
\end{aligned}{{</katex>}}

Similarly, given that {{<katex>}}B = N - A{{</katex>}}:

{{<katex display>}}B = \frac{N}{2} - \sqrt{N}{{</katex>}}
 
And so:

{{<katex display>}}\begin{aligned}
\frac{A}{B} &= \frac{\frac{N}{2} + \sqrt{N}}{\frac{N}{2} - \sqrt{N}} \\
	&= \frac{N + 2\sqrt{N}}{N - 2\sqrt{N}} \\
	&= \frac{\sqrt{N} + 2}{\sqrt{N} - 2} \\
\end{aligned}{{</katex>}}
