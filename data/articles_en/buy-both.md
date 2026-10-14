---
id: 11
title: "When customers buy your competitor's product… and then buy yours"
slug: "buy-both"
url: "https://longform.asmartbear.com/buy-both/"
pubDate: "Sun, 18 May 2025 00:00:00 +0000"
summary: "Little, unknown companies with silly names can sell to enterprises who have already spent millions."
---

# When customers buy your competitor's product… and then buy yours

> **Executive Summary:** Little, unknown companies with silly names can sell to enterprises who have already spent millions.
> **Original URL:** [https://longform.asmartbear.com/buy-both/](https://longform.asmartbear.com/buy-both/)

![Buy. Sell. Sell. Buy. Bark. Woof. Sorry. Buy.](https://public.asmartbear.com/books/anthology/chapters/buy-both/d7939print-simple.png)

Why would someone pay millions of dollars for software, and then also pay a bootstrapped company $700 for software that does the same thing?

How can you win those deals too?

---

"It's not a matter of life or death," most software developers say to excuse their bugs. But we were in a hospital. A modern hospital where everything is digitized, where it is not an exaggeration to say that if the systems failed, patients could die.

When Gerry and I walked into the hospital's network operations center, our faces lit up with an appropriate level of awe. On sales calls, the customer's jokes are always funny, and the customer's workspace fills you with awe.

Compared to all the other activity at the hospital, our product might appear insignificant. At ITWatchDogs our web-enabled hardware[^1] measured indoor weather--the environment of server rooms, factory floors, or hospital rooms--things like temperature, humidity, whether the door was open, whether power was flowing, whether there was a problem with the air conditioning. If it gets too hot in a server room, components literally melt, causing downtime and significant replacement expense and the discovery that "backup" doesn't always include "restore". We were selling physical devices that monitored those factors and alerted when an air conditioner needs to be serviced ahead of an actual failure, or respond to a failure in minutes rather than hours.

[^1]: This was in the early 2000s, when "web-enabled hardware" was rare and interesting.

The NOC (Network Operations Center) looks like NASA Mission Control--monitors everywhere, with numbers and graphs and kaleidoscopic colors that only long-tenured employees could pattern-match between "normal" and "concerning". Relatively few people monitor thousands of devices in the data center and strewn about the hospital--terminals and pagers and medical devices and patient records and the front desk and back-end systems, and who knows what else.

A hospital is the classic domain of the "Enterprise Software Buyer," and indeed they had "Enterprise Software" doing the monitoring. In particular they used HP OpenView--a multi-million dollar software extravaganza from Hewlett-Packard, in case you thought all that company knows how to do is charge too much for printer ink. Well, it turns out they charge too much for printer ink *and* they charge too much to monitor hospital IT systems. This is a company that can [focus](https://longform.asmartbear.com/focus/) on more than one thing at a time! We were hoping they would buy our weather gear, link it via HP OpenView to the Shuttle-Launch monitors, and save lives, or at least, not lose them due to IT failures.

But we noticed something else that surprised us. Something that turned into an instructive observation for anyone building a start-up and [competing against incumbents](https://longform.asmartbear.com/startup-beats-incumbent/) including Big Enterprise Brands.

They were also using **What's Up Gold**.

![You've never seen a more hideous logo.](https://public.asmartbear.com/books/anthology/chapters/buy-both/image-simple.png)

Your first question should be: How could a hospital--that buys enterprise software--use a product with such a silly name? It wasn't because of the logo--that was even more embarrassing. Modern designers are sitting here, mouth agape, stunned. Why is it a ransom note? Why did the ransomer not have access to an apostrophe for "What's"? [Does design not matter at all?](https://longform.asmartbear.com/design/) This is an existential crisis; let's give the designers space to begin breathing normally again.

Your second question should be: What does that product do? And the answer is at once surprising and not surprising. It's not surprising because it monitors IT devices; hence "What's Up?" And when you bought the more expensive version, you got "What's Up?"... Gold.[^2] It was a simpler time.

[^2]: And you thought product names matter when selling to the enterprise? Maybe you also forgot our company was called ITWatchDogs and our product was the "Weather Goose." And a few years later I founded Smart Bear and [sold almost exclusively to the enterprise](https://longform.asmartbear.com/bad-advice/) with more animalia. Do what you know!

![Can you believe this was the website for a product that costs $700? These were the days when website design truly didn't matter.](https://public.asmartbear.com/books/anthology/chapters/buy-both/image-2-simple.png)

It was surprising because they had bought and were also using HP OpenView. So why also buy What's Up Gold? What's Up Gold was a small bootstrapped company with shrink-wrapped software. How did they successfully sell a product when HP OpenView is sitting right there, at a cost of a million dollars?

![It's easy to forget how ugly the internet used to be. HP was worth billions of dollars yet decided on this design.](https://public.asmartbear.com/books/anthology/chapters/buy-both/image-4-simple.png)

So we asked them. This is already a lesson. You've got to [proactively seek out potential customers](https://longform.asmartbear.com/find-customers-to-interview/) and then [talk to them](https://longform.asmartbear.com/customer-development/), to find out what's up. Whenever you see something surprising, that's a signal that there's something to learn. Dig in and learn it.

"Well," the guy said:

> "What's Up Gold has a couple of features we like. There's this thing we do many times per day, and it's really quick with What's Up Gold. And it's only like five hundred dollars or something. We can just run that on our credit card without asking permission. So we just bought it."

There's a couple of things to notice.

First, they bought two products to solve the same problem. We'll unpack that next.

Second, the pricing comment--it wasn't just that the pricing was *inexpensive*, it was that the pricing was *something that they could procure with neither effort nor consequence*. You probably think about pricing in terms of the psychology of the buyer ("Does $49.99 feel much cheaper than $50?"). But when you're selling to businesses--especially mid-sized to large businesses--it's less about the psychology of the buyer but rather how much of a pain in the ass it is for the buyer. When you understand [pain-in-the-ass procurement](https://longform.asmartbear.com/startups-emotionally-draining/), you gain a new understanding of pricing. And you understand that $500 is not the same as $499.99; it's the same as $0.

It's like voting theory. Suppose there are four members of a board, with voting shares of 7%, 16%, 17%, and 60%. How much voting power does everyone have? The answer is: 0%, 0%, 0%, and 100%, because the last person always wins; the other percentages are irrelevant. Same with this customer: $500 is the same as $0, but $1,000 might be the same as $60,000.

And now you can see why they would buy a product to solve a problem that was (theoretically) already solved. Because from their perspective, What's Up Gold is free, so if it adds even a little incremental value, they'll buy it.[^3]

[^3]: This is sadly not always the case; [here's an in-depth discussion](https://longform.asmartbear.com/purgatory/), including the alternate cases.

Now consider this from What's Up Gold's perspective. Do they sell to the enterprise? Yes, in the sense that this customer is "an Enterprise". But they're not "selling to the Enterprise" in the sense that they were competing directly with HP OpenView. Other products competed directly with HP OpenView (e.g IBM's Tivoli, CA's Unicenter, BMC's Patrol--see, [you are required to use acronyms](https://longform.asmartbear.com/bad-advice/) and a "serious" product name to sell to The Enterprise!). What's Up Gold would never win against that line-up. But it doesn't matter--they sold their product to the same customer anyway. And now imagine that they could do that to every hospital--indeed every data center--in the world.

---

What's Up Gold thrived with:

1. A product with a few [unique](https://longform.asmartbear.com/leverage/) and [delightful](https://longform.asmartbear.com/willingness-to-pay/) features.
2. A price that solved for procurement. (Notably _not_ "price to value" nor perception tricks.)
3. A [target market](https://longform.asmartbear.com/target-market/) defined by the needs of an individual IT person, not "SMB" vs "Enterprise."
4. A way to [get the attention](https://longform.asmartbear.com/first-marketing-channel/) of the right person (i.e. "distribution").

On that last point: We were curious how What's Up Gold managed to get in front of this IT person, especially since they'd already bought a solution. So we asked about that too.[^4] "Oh," the guy said, gesturing towards a table smothered in manuals, assorted wires, mangled Ethernet jacks, and loose CD-ROMs, "I might have seen it in one of those magazines, I don't know. I probably saw an ad in the back of one of the ones in the bathroom."

[^4]: Sub-lesson: [Always ask](https://longform.asmartbear.com/customer-development/) about adjacent products and behaviors. Wherever they found What's Up Gold, maybe they could have found us too.

![IT bear](https://public.asmartbear.com/books/anthology/chapters/buy-both/bear-it-admin-simple.png)

So while you're worried about SEO optimization and AdWords positioning, it's easy to overlook the magazine you take into the stall for 20 minutes of solace.

And yes, we later went to the bathroom to see which magazines were there. And then we advertised in them. And it worked. The things we do for [success](https://longform.asmartbear.com/success-guaranteed/).

Oddly, we learned a lot about the customer even though it wasn't questions about our product. We learned things when we asked about other products, as long as we were learning about the **life of the customer**. Maybe the customer was more honest than usual, exactly because it wasn't about us. We learned about a magazine we needed to advertise in. We learned customers would buy two pieces of software to solve the same problem.

And we learned about the credit card limit. So we changed the sales pitch on the fly. We came in expecting to pitch a $10,000 package. Instead, we said: "You could just buy $500 worth of stuff from us today. See whether you like it." Would they give it a try [if it were free](https://longform.asmartbear.com/purgatory/)? Yes they would.

Each month they bought a little more. They were hooked--the product was good!--so they bought in a manner that was convenient for them.

It turned out that hospital was part of a larger hospital group. Eventually, we got orders for tens of thousands of dollars from their global IT center, because after it worked well in that one location, word spread inside the company, and then they really did go through procurement and make a big order. That's how Enterprise sales often works. It's not always a large top-down deal; it can start small, start accessible, start simple, start affordable, and then expand outward once you're a proven quantity. "Land and expand," goes the insipid but accurate saying.

That was 20 years ago, and SaaS software is different, and markets are different, and customer expectations are different, and budgets are different, and [AI is different](https://longform.asmartbear.com/ai-startups/), but what remains the same are the fundamental lessons of learning from your customers, and making things they want to buy.

Twice.
