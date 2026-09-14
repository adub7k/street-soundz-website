/**
 * Homepage-only copy: the differentiators and the cross-service FAQ.
 *
 * Every "why us" point below is a commitment about HOW the shop works, not a
 * statistic about its past. The business is new; it has no install count, no
 * years-in-business and no review tally to lean on, and it won't invent them.
 * What it can promise is the standard of the work — so that's what's here.
 */

import { CITY } from "@/config/site";

export const whyUs = [
  {
    title: "Factory wiring stays factory",
    body: "Harness adapters, proper connectors, fused power runs. Nothing cut, nothing spliced with tape. If you ever sell the car, everything can come out and it's as if we were never there.",
  },
  {
    title: "Cars, homes and businesses — one standard",
    body: "Twelve-volt in a car and low-voltage in a house are the same craft: clean runs, solid terminations, nothing visible. We do both, so you make one call.",
  },
  {
    title: "We'll spec the cheaper option when it's right",
    body: "Plenty of cars don't need a new head unit, and plenty of living rooms are better with a soundbar and a sub than a full surround system. Talking you out of the expensive option is how we get the call next time.",
  },
  {
    title: "One flat number, in writing",
    body: "You get a quote before we start — not a range, and not an invoice with surprises on it. If something changes mid-job, you hear about it before we do it.",
  },
  {
    title: "Tuned and tested before you see it",
    body: "An installed system isn't a finished one. Audio is tuned in the car, lighting is aimed at night, theaters are calibrated in the room. Then we walk you through it.",
  },
  {
    title: "Designed for how you'll use it",
    body: "How loud you listen, where the car parks, which wall the screen goes on, what you want to see from the street. We ask first, then spec — not the other way round.",
  },
];

/** Cross-service FAQ. Also feeds FAQPage structured data on the homepage. */
export const homeFaqs = [
  {
    q: "What does Street Soundz actually do?",
    a: `Four things: car audio (speakers, amps, subs, head units), vehicle security (alarms, remote start, GPS tracking), lighting for homes and businesses (landscape, architectural, storefront and signage), and home theater and whole-home audio. All of it in and around ${CITY}.`,
  },
  {
    q: "Can I keep my factory radio and still get better sound?",
    a: "Almost always. We integrate behind the factory head unit, so CarPlay, cameras and steering-wheel controls stay exactly as they are and the speakers, amp and sub do the work. On most newer cars it's the right way to do it.",
  },
  {
    q: "How much does car audio cost?",
    a: "It ranges from a speaker swap to a full tuned system. Where we've set published prices they're on the car audio page; anything custom is quoted after we've seen the car. Either way, one flat number.",
  },
  {
    q: "Will remote start work with my car?",
    a: "Most vehicles, including push-button start, with the right integration module. Compatibility is model-specific, so we confirm it for your exact year and model before you book.",
  },
  {
    q: "Do you do lighting for businesses as well as homes?",
    a: "Yes. Landscape and architectural lighting for houses; storefront, signage, patio and lot lighting for businesses. Both are designed on a site walk and installed with the wiring out of sight.",
  },
  {
    q: "Projector or a big TV?",
    a: "A projector for a dark, dedicated room; a big TV for a living room with windows. We'll tell you honestly which your room is — it's the first thing we look at on a visit.",
  },
  {
    q: "Do you come to me, or do I come to you?",
    a: "Vehicle work is booked in. Lighting and home theater are designed and installed at your property — we come out for a free site walk or room visit first.",
  },
  {
    q: "How do I get a quote?",
    a: "The quote form takes about a minute: tell us the vehicle or the property and what you're after, add photos if you have them, and we come back with a flat number. Or call, if you'd rather talk to a person.",
  },
  {
    q: "Do you fix installs done somewhere else?",
    a: "Yes, and it's a fair share of what comes in. Bad grounds, untuned amps, remote starts that only work sometimes, lighting that half works. We'll tell you whether it needs a fix or a fresh start.",
  },
  {
    q: "Do you work on trucks, vans and fleets?",
    a: "Constantly. Trucks get their own subwoofer and remote-start answers, and fleet trackers and starters are quoted as one job with one login for the lot.",
  },
];

/** The homepage "how it works" list. */
export const homeProcess = [
  {
    title: "Tell us what you're after",
    body: "The vehicle or the property, and the goal. Takes about a minute, and photos help if you have them.",
  },
  {
    title: "Get a recommendation",
    body: "What we'd actually install and why — including when the cheaper option is the right one.",
  },
  {
    title: "One number, in writing",
    body: "A flat price before anything starts. Lighting and theater get a free site visit first.",
  },
  {
    title: "We install",
    body: "Clean wiring, hidden modules, panels and walls back the way we found them.",
  },
  {
    title: "Tuned, tested, walked through",
    body: "Audio tuned in the car, lighting aimed at night, theaters calibrated in the room. Then we show you how it works.",
  },
];
