/**
 * Per-service page content.
 *
 * Each service gets its OWN page structure — the route files compose these
 * blocks in a different order per service, because someone shopping for a
 * subwoofer and someone lighting their front yard are not the same person
 * and shouldn't be sold the same way.
 *
 * Copy rules: no brand names, no warranty claims, no certification claims,
 * no performance figures, no prices, no "years of experience". Every one of
 * those lives in site.ts → unverified until the owner confirms it. Describe
 * what the shop DOES and how it works; that's honest on day one.
 */

import { CITY } from "@/config/site";

export type GalleryTag = "audio" | "security" | "lighting" | "theater";

/** Literal route paths, so <Link to={service.route}> stays type-safe. */
export type ServiceRoute = "/car-audio" | "/vehicle-security" | "/lighting" | "/home-theater";

/** Configuration for the property (non-vehicle) quote flow. */
export type PropertyLead = {
  blurb: string;
  selectLabel: string;
  selectOptions: string[];
  goalOptions: string[];
  /** Label for the "how big" step. */
  sizeLabel: string;
  sizeHint: string;
  sizePlaceholder: string;
  /** Question about what's already there. */
  existingLabel: string;
  existingOptions: string[];
  photoHint: string;
  submitLabel: string;
};

export type ServiceContent = {
  slug: string;
  route: ServiceRoute;
  key: GalleryTag;
  /** Must match a lead-form option in ShopFlow so the CRM tags it correctly. */
  leadValue: string;
  serviceName: string;
  navLabel: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  headline: string;
  sub: string;
  /** Owner-photo slot (config/images.ts → ShopFlow → Settings → Website Photos). */
  imageSlot: "service_audio" | "service_security" | "service_lighting" | "service_theater";
  cardBlurb: string;
  cardBenefits: string[];
  problem: { title: string; body: string; costs: { label: string; body: string }[] };
  benefits: { title: string; body: string }[];
  options?: {
    title: string;
    intro: string;
    items: { name: string; tag: string; body: string; bestFor: string }[];
  };
  truths?: { does: string[]; doesNot: string[] };
  included: string[];
  process: { title: string; body: string }[];
  faqs: { q: string; a: string }[];
  quote: { heading: string; sub: string };
  /** Service-specific options for the goals step of the quote form. */
  goalOptions: string[];
  /** Hint on the photo step of the quote form. */
  photoHint: string;
  related: string[];
  /** "vehicle" runs the year/make/model flow; "property" runs the site-visit flow. */
  variant: "vehicle" | "property";
  lead?: PropertyLead;
};

export const services: ServiceContent[] = [
  /* ====================================================== CAR AUDIO ==== */
  {
    slug: "car-audio",
    route: "/car-audio",
    key: "audio",
    variant: "vehicle",
    leadValue: "Car Audio",
    serviceName: "Car Audio",
    navLabel: "Car Audio",
    metaTitle: `Car Audio Installation in ${CITY} | Speakers, Amps, Subs — Street Soundz NM`,
    metaDescription: `Car audio installed properly in ${CITY}: speaker upgrades, amplifiers, subwoofers and head units with CarPlay. Keep your factory radio. Clean wiring, tuned in the car. Free quote.`,
    eyebrow: `Car Audio · ${CITY}`,
    headline: "Sound that actually fills the car.",
    sub: "Factory systems are built to a price, not to a standard. We fix that in stages — better speakers, a real amplifier, a sub that hits without rattling the trunk — or all at once. And on most cars we do it without touching the factory radio, so CarPlay, cameras and steering-wheel controls stay exactly as they were.",
    imageSlot: "service_audio",
    cardBlurb:
      "Speakers, amplifiers, subwoofers and head units — matched to the car and to how you actually listen.",
    cardBenefits: [
      "Keep the factory radio",
      "Bass without the rattle",
      "Amps wired right",
      "CarPlay & Android Auto",
    ],
    problem: {
      title: "Why the factory system sounds thin",
      body: "It's not your ears. Most factory audio is a set of paper-cone speakers driven by a radio putting out a handful of clean watts a channel.",
      costs: [
        {
          label: "It falls apart at volume",
          body: "Turn a factory system up and the highs get harsh and the bass turns to mush. That's the built-in amplifier running out of headroom — not the speakers being 'bad'.",
        },
        {
          label: "No real low end",
          body: "Small door speakers physically can't move enough air for bass. A subwoofer isn't about being loud; it's about the bottom two octaves of your music existing at all.",
        },
        {
          label: "Rattles and buzzes",
          body: "Door panels and trunk lids that buzz on every bass note. Sound deadening fixes it, and it's usually the difference between a system that sounds expensive and one that sounds cheap.",
        },
        {
          label: "The last guy's install",
          body: "Speaker wire twisted and taped, an amp grounded to painted metal, a sub box sliding around the trunk. We see it every week, and it's often why good gear sounds bad.",
        },
      ],
    },
    benefits: [
      {
        title: "Speakers first — they matter most",
        body: "A speaker upgrade in the factory locations is the biggest single step for the money. Better cones, real tweeters, more detail, and nothing cut or drilled.",
      },
      {
        title: "An amp gives you headroom, not just volume",
        body: "Clean power means the system sounds relaxed at the levels you actually listen at, and doesn't distort when you turn it up for the right song.",
      },
      {
        title: "Bass that's tight, not boomy",
        body: "The right sub in the right enclosure, tuned to the car. Sealed for accuracy, ported for output — we'll tell you which one fits how you listen and how much trunk you want to keep.",
      },
      {
        title: "Keep the factory head unit",
        body: "Most newer cars tie the radio to climate, cameras and settings. We integrate behind it — line-level converters and a DSP — so nothing on the dash changes and everything sounds different.",
      },
      {
        title: "Or upgrade the screen",
        body: "On cars where it makes sense, a new head unit adds wireless CarPlay / Android Auto, a bigger screen and a proper preamp. We'll be straight about which cars it makes sense on.",
      },
      {
        title: "Sound deadening, where it counts",
        body: "Doors and trunk, done properly. It's the step people skip and the one that changes how the bass feels more than any other.",
      },
    ],
    options: {
      title: "How far do you want to go?",
      intro:
        "You don't have to do it all at once. Most people start with one of these and add the next when they're ready — and everything we put in is chosen so the next step slots straight in.",
      items: [
        {
          name: "Speaker upgrade",
          tag: "The starting point",
          body: "Front and rear speakers in the factory locations, wired properly, with tweeters aimed where they should be. Runs off the factory radio and immediately sounds cleaner and fuller.",
          bestFor: "Daily drivers, first upgrades, anyone who wants clarity more than volume",
        },
        {
          name: "Amp + subwoofer",
          tag: "What most people add",
          body: "A compact amplifier and a subwoofer in an enclosure built or chosen for your vehicle and your trunk space. Integrates with the factory radio. This is where music starts to feel like music.",
          bestFor: "Bass lovers, trucks and SUVs with room, anyone who's already done speakers",
        },
        {
          name: "Full system",
          tag: "Done properly, once",
          body: "Speakers, amplification, sub, DSP and sound deadening — designed as one system and tuned in the car with a measurement mic, not by ear in a parking lot.",
          bestFor: "People who listen loud and care how it sounds, long commutes, keepers",
        },
        {
          name: "Head unit / screen",
          tag: "When the radio is the problem",
          body: "A new receiver with wireless CarPlay / Android Auto, backup-camera support and real preamp outputs. Best on older vehicles or anything with a small, dated factory screen.",
          bestFor: "Older vehicles, work trucks, anyone missing CarPlay",
        },
      ],
    },
    truths: {
      does: [
        "Make music clearer and fuller at every volume",
        "Add real bass without rattling the trunk apart",
        "Keep your factory radio, steering-wheel controls and CarPlay working",
        "Go in without cutting the factory harness",
        "Grow in stages — start small, add later",
      ],
      doesNot: [
        "Fix a bad recording — a low-bitrate stream still sounds like one",
        "Make cheap speakers sound expensive by adding power",
        "Sound right without a tune — gear alone isn't the job",
        "Come with a fixed price before we've seen the car",
        "Get done in an hour if it's done properly",
      ],
    },
    included: [
      "A conversation about how you listen — genres, volume, where the car spends its time",
      "Gear matched to the car and to each other, not whatever's on the shelf",
      "Factory-style connectors and harness adapters — no cut wires",
      "Proper power, ground and fusing on every amplifier",
      "Sound deadening recommended only where it will actually help",
      "A tune in the car and a walk-through before you drive off",
    ],
    process: [
      {
        title: "Tell us the car and the goal",
        body: "Year, make, model — and whether it's bass, clarity, CarPlay or all of it.",
      },
      {
        title: "We spec a system",
        body: "Options at a couple of price points, with a plain explanation of what each one changes.",
      },
      {
        title: "Book it in",
        body: "Most speaker and amp jobs are a day. Full systems are longer — we'll say how long before we start.",
      },
      {
        title: "We install and tune",
        body: "Clean wiring, solid grounds, panels back on without a rattle. Then it gets tuned in the car.",
      },
      {
        title: "Listen before you leave",
        body: "We sit in it with you. If something isn't right, it gets fixed then, not next week.",
      },
    ],
    faqs: [
      {
        q: "Can I keep my factory radio?",
        a: "Almost always, yes. We integrate behind the factory head unit with a line-level converter or a DSP, so the screen, steering-wheel controls, backup camera and CarPlay all stay exactly as they were. On many newer cars it's the only sensible route.",
      },
      {
        q: "Do I need an amp?",
        a: "If you want the system to stay clean when it's turned up, yes. A factory radio puts out a handful of clean watts per channel. Speakers alone will sound better; speakers with an amp sound better at every volume. We'll tell you honestly if your budget is better spent on one or the other.",
      },
      {
        q: "How much does a car audio system cost?",
        a: "It ranges from a speaker swap to a full tuned system, and it depends on the car and what you want it to do. Where we've published prices they're on this page; anything custom is quoted after we've seen the car. Either way you get one flat number, not a range.",
      },
      {
        q: "Will it drain my battery?",
        a: "Not if it's done right. A properly fused, properly grounded amplifier draws nothing at rest. Very large systems can need a bigger alternator or battery, and we'll tell you before we build one, not after.",
      },
      {
        q: "Will the trunk rattle?",
        a: "Only if it's installed loosely. Sound deadening on the doors and trunk is what stops panel buzz. We recommend it where it actually helps, not as an automatic upsell.",
      },
      {
        q: "Can you fix a system someone else installed?",
        a: "Yes, and we do it a lot. Bad grounds, undersized wire and untuned amps are the usual suspects. Bring it in and we'll tell you whether it needs a fix or a fresh start.",
      },
      {
        q: "Do you do trucks and work vehicles?",
        a: "Constantly. Trucks have their own subwoofer answers — under-seat and behind-seat enclosures that don't eat cab space — and we spend a lot of time in them.",
      },
    ],
    quote: {
      heading: "Get a car audio quote",
      sub: "Tell us the car and what you want it to sound like. We'll come back with options and a flat number.",
    },
    goalOptions: [
      "More bass",
      "Clearer sound at volume",
      "Keep the factory radio, better sound",
      "CarPlay / Android Auto",
      "Full system",
      "Fix what someone else installed",
    ],
    photoHint:
      "A photo of the dash and one of the trunk help us spec the right enclosure and integration.",
    related: ["vehicle-security", "home-theater", "lighting"],
  },

  /* ================================================ VEHICLE SECURITY === */
  {
    slug: "vehicle-security",
    route: "/vehicle-security",
    key: "security",
    variant: "vehicle",
    leadValue: "Vehicle Security",
    serviceName: "Vehicle Security",
    navLabel: "Security & Remote Start",
    metaTitle: `Car Alarms, Remote Start & GPS Tracking in ${CITY} | Street Soundz NM`,
    metaDescription: `Vehicle security installed in ${CITY}: two-way alarms, remote start that works with your factory key, and GPS trackers with a phone app. Hidden modules, clean wiring. Free quote.`,
    eyebrow: `Security & Remote Start · ${CITY}`,
    headline: "Know where it is. Start it from the couch.",
    sub: "Alarms, remote start and GPS tracking — installed so they work every single time and nothing about the car looks or feels hacked. If it parks outside, this is the cheapest insurance you'll ever buy.",
    imageSlot: "service_security",
    cardBlurb:
      "Alarms, remote start and GPS tracking, installed cleanly and integrated with the factory key.",
    cardBenefits: ["Remote start", "Two-way alarms", "GPS tracking", "Works with your key"],
    problem: {
      title: "What's actually at risk in a parked car",
      body: "Break-ins are quick, opportunistic, and almost always about what's visible. The car itself is just the expensive version of the same problem.",
      costs: [
        {
          label: "Smash-and-grab",
          body: "A window and whatever's on the seat. It takes seconds, usually in a lot with plenty of people around. A visible, armed alarm moves them on to the next car.",
        },
        {
          label: "Catalytic converters and wheels",
          body: "Trucks and SUVs sitting high are the easy targets. A tilt sensor and a loud siren cut short the job the thief is trying to do underneath.",
        },
        {
          label: "The whole car",
          body: "Modern theft is often quiet — relay attacks and OBD clones, not a screwdriver in the lock. A tracker doesn't stop it, but it turns 'gone' into 'found'.",
        },
        {
          label: "Cold mornings, hot afternoons",
          body: "Not a security problem, but the same install solves it: remote start means you get into a car that's already the right temperature.",
        },
      ],
    },
    benefits: [
      {
        title: "Remote start that works with your key",
        body: "Integrated with the factory immobiliser, so the car starts from your fob or your phone and locks itself back down. No bypass hacks, no second fob on the ring.",
      },
      {
        title: "Two-way alarms",
        body: "The remote tells you when the alarm trips — so you know while it's happening, not when you get back to the car.",
      },
      {
        title: "GPS tracking with a phone app",
        body: "Live location, trip history, geofences and movement alerts. If it goes, you and the police know exactly where it went.",
      },
      {
        title: "Control from your phone",
        body: "Start, lock, locate and check status from anywhere with a signal — across town or across the country.",
      },
      {
        title: "Nothing looks aftermarket",
        body: "Modules hidden, wiring loomed, no blinking LED unless you want one. It should look like it left the factory that way.",
      },
      {
        title: "Fleet-friendly",
        body: "Work trucks and vans — trackers and remote start across a fleet, with one login for the whole lot.",
      },
    ],
    options: {
      title: "Three things, in any combination",
      intro:
        "Each of these stands alone. Together they share one install, which is why doing two at once costs less than two visits.",
      items: [
        {
          name: "Remote start",
          tag: "The most requested",
          body: "Start the car from the fob or your phone. It runs the climate for a set time, stays locked, and shuts down if anyone opens a door without the key.",
          bestFor: "Anyone who parks outside, commuters, families",
        },
        {
          name: "Alarm",
          tag: "Deterrence",
          body: "Shock and tilt sensors, a siren that gets attention, and a two-way remote that tells you it's gone off. Add glass-break or a battery backup for higher-risk parking.",
          bestFor: "Street parking, trucks, anything with a stereo worth stealing",
        },
        {
          name: "GPS tracker",
          tag: "Recovery",
          body: "A hidden tracker with its own app. Live location, history, geofence alerts, and a way to tell the police precisely where the car is.",
          bestFor: "High-theft models, teen drivers, work fleets",
        },
      ],
    },
    truths: {
      does: [
        "Deter the quick, opportunistic break-in",
        "Tell you the moment the alarm trips",
        "Warm or cool the car before you get in",
        "Show you where the car is, live, from your phone",
        "Work with the factory key — no bypass fob on the ring",
      ],
      doesNot: [
        "Make a car impossible to steal — nothing does",
        "Replace insurance",
        "Stop a determined thief with a flatbed",
        "Work without a subscription, in the case of GPS and phone control",
        "Get done well in an hour on a modern vehicle",
      ],
    },
    included: [
      "The right module for your exact year and model — checked before you book",
      "Factory-integrated immobiliser bypass, so the key stays the key",
      "Hidden module placement and loomed, factory-style wiring",
      "Sensors set up and tested with you, not left on the defaults",
      "App and remote set up before you leave",
      "A walk-through of how it behaves, including what to do if it trips",
    ],
    process: [
      {
        title: "Tell us the vehicle",
        body: "Remote start and alarm compatibility is model-specific — year, make, model, and whether it's push-button or key start.",
      },
      {
        title: "Pick the combination",
        body: "Start, alarm, tracker, or a mix. We'll say what's worth it for how and where the car is parked.",
      },
      {
        title: "Book it",
        body: "Most installs are a day. Some vehicles need a specific integration module ordered in first.",
      },
      {
        title: "Install and test",
        body: "Every function tested with you: start, arm, trip, locate.",
      },
      {
        title: "Set up your phone",
        body: "App, alerts and geofences done before you drive off.",
      },
    ],
    faqs: [
      {
        q: "Will remote start work on my push-button start car?",
        a: "Usually, yes — it depends on the exact year and model. Push-button cars need a specific integration module, and we check compatibility before you book rather than finding out on the day.",
      },
      {
        q: "Does it void my warranty?",
        a: "Properly installed aftermarket equipment doesn't void a manufacturer's warranty on its own; a dealer has to show the install caused a specific fault. Clean, factory-integrated wiring is how you make sure that never comes up.",
      },
      {
        q: "Is there a monthly fee?",
        a: "Alarms and fob-based remote start: no. GPS tracking and phone-app control use a cellular connection, so they carry a subscription — we'll tell you the cost up front, before you decide.",
      },
      {
        q: "How far away does remote start work from?",
        a: "Fob-based systems reach a few hundred feet to a couple of thousand, depending on the remote. Phone-based systems work from anywhere with a signal.",
      },
      {
        q: "Can you install a tracker without it being obvious?",
        a: "That's the point of a tracker. It's hidden, it has its own battery backup, and there's nothing visible in the car.",
      },
      {
        q: "Do you do fleets?",
        a: "Yes — trackers and remote start across work trucks and vans, with one account for the whole fleet. Tell us how many vehicles and we'll quote it as one job.",
      },
    ],
    quote: {
      heading: "Get a security quote",
      sub: "Tell us the vehicle and what you're after. We check compatibility before we quote.",
    },
    goalOptions: [
      "Remote start",
      "Alarm",
      "GPS tracker",
      "Remote start + alarm",
      "All three",
      "Fleet vehicles",
    ],
    photoHint: "Optional. A photo of the key fob helps us confirm the right integration module.",
    related: ["car-audio", "lighting", "home-theater"],
  },

  /* ======================================================= LIGHTING ==== */
  {
    slug: "lighting",
    route: "/lighting",
    key: "lighting",
    variant: "property",
    leadValue: "Lighting",
    serviceName: "Lighting",
    navLabel: "Lighting — Home & Commercial",
    metaTitle: `Landscape & Commercial Lighting Installation in ${CITY} | Street Soundz NM`,
    metaDescription: `Low-voltage LED lighting designed and installed in ${CITY}: landscape, path and architectural lighting for homes; storefront, signage and patio lighting for businesses. Free site walk.`,
    eyebrow: `Lighting · Residential & Commercial · ${CITY}`,
    headline: "Light that makes the place look finished.",
    sub: "Landscape and architectural lighting for homes. Storefront, signage and patio lighting for businesses. Low-voltage LED, designed for the space and installed so you never see a wire — only the light.",
    imageSlot: "service_lighting",
    cardBlurb:
      "Landscape, architectural and accent lighting for homes and businesses — designed, installed and hidden.",
    cardBenefits: [
      "Landscape & path",
      "Architectural accents",
      "Storefront & signage",
      "Low-voltage LED",
    ],
    problem: {
      title: "Why most exterior lighting looks wrong",
      body: "The builder left a porch light and a floodlight. Everything else is dark, or lit by whatever was on the shelf at the hardware store.",
      costs: [
        {
          label: "The house disappears at night",
          body: "All the money in the stonework, the trees, the entry — invisible after sunset. Lighting is what makes it exist for the twelve hours a day you're most likely to be home.",
        },
        {
          label: "Dark paths and steps",
          body: "Trips, guests fumbling for the door, and the security problem of a black yard. Path and step lighting is the least glamorous part of the job and the one people thank us for.",
        },
        {
          label: "Glare instead of light",
          body: "Floodlights aimed at the house light up the wall and blind everyone on the walk. Good lighting is aimed at what you want to see, not at your eyes.",
        },
        {
          label: "A business nobody can see",
          body: "A storefront that goes dark at six is invisible to evening traffic. Sign and exterior lighting is the cheapest after-hours advertising there is.",
        },
      ],
    },
    benefits: [
      {
        title: "Designed, not scattered",
        body: "We walk the property at dusk when we can. Fixtures go where the trees, walls and paths ask for them, not on a grid.",
      },
      {
        title: "LED that lasts",
        body: "Low-voltage LED fixtures draw a fraction of the power and run for years. Warm colour temperatures — this isn't a parking lot.",
      },
      {
        title: "Wires you'll never see",
        body: "Trenched, tucked and terminated properly. The install should be invisible; only the light shows.",
      },
      {
        title: "Control that fits you",
        body: "Dusk-to-dawn timers, app control, scenes for entertaining — or a plain switch if that's all you want.",
      },
      {
        title: "Commercial-grade where it's needed",
        body: "Storefronts, signage, patios, lots — fixtures and transformers rated for the duty, on a schedule that matches your hours.",
      },
      {
        title: "Retrofit or new build",
        body: "We'll work with the landscaper on a new install, or add to what's already there. Either way it's designed around what exists.",
      },
    ],
    options: {
      title: "What we light",
      intro:
        "Most projects are one or two of these. We scope it around what you want to see from the street, from the door, and from inside.",
      items: [
        {
          name: "Landscape",
          tag: "Homes",
          body: "Trees uplit, beds washed, walls grazed. The layer that makes a yard look designed rather than planted.",
          bestFor: "Front yards, entries, mature trees, feature walls",
        },
        {
          name: "Path & step",
          tag: "Safety",
          body: "Low, glare-free light on walkways, steps and driveways. Enough to see by, not enough to feel like a runway.",
          bestFor: "Any property with steps, walkways or a long drive",
        },
        {
          name: "Architectural & accent",
          tag: "The building itself",
          body: "Grazing stone and stucco, marking columns and eaves, lighting the entry. The layer that gives a house — or a storefront — presence at night.",
          bestFor: "Feature façades, stonework, columns, covered entries",
        },
        {
          name: "Commercial exterior & signage",
          tag: "Businesses",
          body: "Storefront, sign, patio and lot lighting on a schedule. Bright enough to read, warm enough to make people want to walk in.",
          bestFor: "Storefronts, restaurants, patios, offices, car lots",
        },
      ],
    },
    truths: {
      does: [
        "Make a property look finished — and safer — after dark",
        "Run for years on a fraction of the power of old halogen",
        "Stay invisible except for the light itself",
        "Work from a timer, a switch or your phone",
        "Add to an existing system or start from nothing",
      ],
      doesNot: [
        "Go in without a site visit — we have to see the space",
        "Come with a price before we've walked it",
        "Mean floodlights — we aim light at things, not at people",
        "Fix bad landscaping, though it hides a lot",
        "Get done in an afternoon if it's more than a few fixtures",
      ],
    },
    included: [
      "A site walk and a lighting plan, ideally at dusk",
      "Fixtures specified for the job — beam angle, colour temperature, rating",
      "A low-voltage transformer sized with headroom for additions later",
      "Wire trenched, buried and protected, every connection sealed",
      "Aimed and adjusted at night, not guessed at in daylight",
      "Timer or app control set up before we leave",
    ],
    process: [
      {
        title: "Tell us the property",
        body: "Home or business, what you want lit, and what's there already.",
      },
      {
        title: "Site walk",
        body: "We come and look — ideally around dusk — and sketch a plan.",
      },
      {
        title: "Written scope",
        body: "Fixture count, layout and one fixed number.",
      },
      {
        title: "Install",
        body: "Trenching, wiring, fixtures, transformer, control. The yard goes back the way we found it.",
      },
      {
        title: "Night aim",
        body: "We come back after dark, aim every fixture, and hand you the controls.",
      },
    ],
    faqs: [
      {
        q: "Do you do homes and businesses?",
        a: "Both. Landscape and architectural lighting for houses; storefront, signage, patio and lot lighting for businesses. The equipment differs, the approach doesn't.",
      },
      {
        q: "Is low-voltage lighting safe around a garden?",
        a: "Yes — that's why it's used. Low-voltage systems run off a transformer, so the wire in the ground carries a fraction of household voltage. It's the standard for landscape work.",
      },
      {
        q: "How much does landscape lighting cost?",
        a: "It scales with fixture count, run lengths and the transformer required. Where we've published a starting price it's on this page; the real number comes from the site walk, and it's fixed once it's written.",
      },
      {
        q: "Can you add to lighting I already have?",
        a: "Usually, if the existing transformer has capacity and the wiring is sound. We'll test it and tell you honestly whether to extend it or replace it.",
      },
      {
        q: "Will it run up my power bill?",
        a: "LED fixtures draw very little. A full landscape system typically uses less than a single old halogen floodlight.",
      },
      {
        q: "Can I control it from my phone?",
        a: "If you want to. Timers and photocells cover most people; app control adds scenes and schedules for those who want them.",
      },
    ],
    quote: {
      heading: "Book a lighting site walk",
      sub: "Tell us the property and what you want lit. We'll come out, sketch it, and give you a fixed number.",
    },
    goalOptions: [
      "Landscape / trees",
      "Path & step lighting",
      "House façade / architectural",
      "Storefront or signage",
      "Patio / outdoor living",
      "Not sure yet",
    ],
    photoHint: "A daytime shot of the front of the property tells us more than any description.",
    related: ["home-theater", "vehicle-security", "car-audio"],
    lead: {
      blurb: "Tell us about the property and we'll set up a free site walk.",
      selectLabel: "What are we lighting?",
      selectOptions: [
        "Home — front yard / entry",
        "Home — backyard / patio",
        "Whole property",
        "Storefront / signage",
        "Restaurant / patio",
        "Office or commercial building",
        "Other",
      ],
      goalOptions: [
        "Landscape / trees",
        "Path & step lighting",
        "House façade / architectural",
        "Storefront or signage",
        "Patio / outdoor living",
        "Not sure yet",
      ],
      sizeLabel: "Roughly how big an area?",
      sizeHint: "A rough idea is fine — we measure on site. Front yard, whole lot, one wall…",
      sizePlaceholder: "Front yard and entry, about 60 ft of frontage",
      existingLabel: "What's there now?",
      existingOptions: ["Nothing", "Some old fixtures", "A system I want to extend", "Not sure"],
      photoHint: "A daytime photo of the area from the street, and one from the door.",
      submitLabel: "Book my free site walk",
    },
  },

  /* =================================================== HOME THEATER ==== */
  {
    slug: "home-theater",
    route: "/home-theater",
    key: "theater",
    variant: "property",
    leadValue: "Home Theater",
    serviceName: "Home Theater",
    navLabel: "Home Theater & Audio",
    metaTitle: `Home Theater Installation in ${CITY} | Surround Sound, Projectors, TV Mounting — Street Soundz NM`,
    metaDescription: `Home theater and home audio installed in ${CITY}: surround sound, projectors and screens, TV mounting with hidden wires, whole-home audio. Designed for the room, one remote. Free room visit.`,
    eyebrow: `Home Theater & Audio · ${CITY}`,
    headline: "A room you'd rather be in than the cinema.",
    sub: "Projectors, big screens, surround sound and whole-home audio — designed for the room, wired out of sight, and set up so one remote runs the lot.",
    imageSlot: "service_theater",
    cardBlurb:
      "Projector and TV rooms, surround sound and multi-room audio — designed for the room and wired out of sight.",
    cardBenefits: [
      "Surround sound",
      "Projector & screen",
      "TV mounting, hidden wires",
      "Whole-home audio",
    ],
    problem: {
      title: "Why the big TV still feels underwhelming",
      body: "A big screen on a wall with the built-in speakers is most of the way to a home theater — and the missing part is the part that makes the difference.",
      costs: [
        {
          label: "TV speakers",
          body: "Built-in speakers fire downward out of a slab an inch thick. Dialogue gets lost, and you're turning it up and down all night.",
        },
        {
          label: "Wires everywhere",
          body: "Cables down the wall, a power strip on the floor, an HDMI that only works from one input. It looks unfinished because it is.",
        },
        {
          label: "The wrong layout",
          body: "Speakers where they fit instead of where they should be, a screen too high, a projector fighting daylight. All fixable — ideally before it's bought.",
        },
        {
          label: "Four remotes",
          body: "TV, receiver, streaming box, soundbar. If the family can't turn it on, it doesn't get used.",
        },
      ],
    },
    benefits: [
      {
        title: "Sound in the right places",
        body: "Speakers positioned and angled for the seating, sub placed where it actually loads the room. That's the whole difference between surround sound and 'speakers'.",
      },
      {
        title: "Projector or TV — an honest answer",
        body: "A projector for a dark, dedicated room; a big TV for a bright living room. We'll tell you which fits the space rather than sell the bigger ticket.",
      },
      {
        title: "Nothing visible but the screen",
        body: "In-wall speakers, in-ceiling for height channels, cables inside the wall, equipment in a closet or cabinet.",
      },
      {
        title: "One remote",
        body: "A single control that turns everything on, picks the input and sets the volume. If a guest can run it, it's done.",
      },
      {
        title: "Music through the house",
        body: "Multi-room audio — ceiling speakers in the kitchen, patio speakers outside, all from your phone.",
      },
      {
        title: "Built around what you already own",
        body: "Keep the TV, keep the streaming box. We add what's missing and wire it right.",
      },
    ],
    options: {
      title: "What kind of room?",
      intro: "Three common shapes. Most homes are one of them; some end up as two.",
      items: [
        {
          name: "Living room upgrade",
          tag: "Most common",
          body: "A properly mounted TV, a surround or soundbar-plus-sub system, cables in the wall, one remote. Looks clean, sounds like a different television.",
          bestFor: "Family rooms, open-plan spaces, renters with landlord permission",
        },
        {
          name: "Dedicated theater",
          tag: "The real thing",
          body: "A projector and screen or a very large TV, full surround with height channels, seating laid out for it, controlled lighting.",
          bestFor: "Spare rooms, basements, bonus rooms, movie people",
        },
        {
          name: "Whole-home audio",
          tag: "Music everywhere",
          body: "Ceiling and outdoor speakers by zone, streamed from your phone, with volume by room. Adds on to either of the above.",
          bestFor: "Kitchens, patios, pools, anyone who cooks with music on",
        },
      ],
    },
    truths: {
      does: [
        "Make dialogue clear and movies feel big",
        "Hide every cable and most of the equipment",
        "Run from one remote or one app",
        "Work with the TV and streaming gear you already own",
        "Grow — start with the living room, add zones later",
      ],
      doesNot: [
        "Turn a bright room into a projector room — physics wins",
        "Sound right if speakers go where they fit instead of where they should",
        "Get done well without a look at the room first",
        "Come with a price before we've seen the space",
        "Need the most expensive gear to sound excellent",
      ],
    },
    included: [
      "A room visit — seating, windows, walls, where the gear can live",
      "A design with equipment at a couple of price points",
      "In-wall and in-ceiling wiring, fished and finished, patched and paintable",
      "TV or screen mounted level, at the right height, on the right anchors",
      "System calibrated in the room — levels, distances, EQ",
      "One-remote or app setup, and a walk-through with the family",
    ],
    process: [
      {
        title: "Tell us the room",
        body: "Rough size, seating, TV or projector, and what you already own.",
      },
      {
        title: "We visit and design",
        body: "Speaker layout, gear options, where the wires go. You get a written scope with one number.",
      },
      {
        title: "Pre-wire if needed",
        body: "Walls open? We rough in now and finish later.",
      },
      {
        title: "Install and calibrate",
        body: "Mount, wire, connect, calibrate in the room.",
      },
      {
        title: "Show you how it works",
        body: "One remote. Everyone in the house can run it.",
      },
    ],
    faqs: [
      {
        q: "Projector or big TV?",
        a: "A projector wins in a dark, dedicated room with controlled light. In a living room with windows, a large TV wins every time. We'll tell you honestly which one your room is.",
      },
      {
        q: "Can you hide the wires in a finished house?",
        a: "In most cases, yes. We fish cable through existing walls and ceilings and patch where we have to. Slab floors and some exterior walls complicate things — we'll say so on the visit.",
      },
      {
        q: "Will it work with my existing TV and streaming box?",
        a: "Almost always. We build around what you own and add what's missing.",
      },
      {
        q: "Is a soundbar enough?",
        a: "For a lot of living rooms, a good soundbar with a separate sub is a huge step up and the honest recommendation. For a dedicated room, or if you want real surround, it isn't.",
      },
      {
        q: "How much does a home theater cost?",
        a: "It depends on the room and the equipment tier. Where we've published starting prices they're on this page; everything else is quoted from the room visit as one fixed number.",
      },
      {
        q: "Do you do outdoor and multi-room audio?",
        a: "Yes. Patio speakers, kitchen ceiling speakers, pool zones — streamed from your phone and controlled by room.",
      },
    ],
    quote: {
      heading: "Book a room visit",
      sub: "Tell us the room and what you're hoping for. We'll come look and put a fixed number in writing.",
    },
    goalOptions: [
      "Living room TV + sound",
      "Dedicated theater room",
      "Whole-home / outdoor audio",
      "TV mounting + hidden wires",
      "Projector setup",
      "Not sure yet",
    ],
    photoHint:
      "A photo of the room from the seating position, and one of the wall the screen will go on.",
    related: ["lighting", "car-audio", "vehicle-security"],
    lead: {
      blurb: "Tell us about the room and we'll set up a free visit.",
      selectLabel: "What's the project?",
      selectOptions: [
        "Living / family room",
        "Dedicated theater room",
        "Whole-home audio",
        "Outdoor / patio audio",
        "Office or business space",
        "New build / pre-wire",
        "Other",
      ],
      goalOptions: [
        "Living room TV + sound",
        "Dedicated theater room",
        "Whole-home / outdoor audio",
        "TV mounting + hidden wires",
        "Projector setup",
        "Not sure yet",
      ],
      sizeLabel: "Roughly how big is the room?",
      sizeHint: "A guess is fine. Seating for how many, and is there a lot of daylight?",
      sizePlaceholder: "About 15 × 20 ft, seats five, two big windows",
      existingLabel: "What do you already have?",
      existingOptions: ["Just a TV", "TV + soundbar", "An older system", "Nothing yet"],
      photoHint: "A photo from where you sit, and one of the wall the screen goes on.",
      submitLabel: "Book my free room visit",
    },
  },
];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);

/** The two vehicle services and the two property services, in sale order. */
export const vehicleServices = services.filter((s) => s.variant === "vehicle");
export const propertyServices = services.filter((s) => s.variant === "property");
