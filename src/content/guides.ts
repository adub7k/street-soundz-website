/**
 * The /guides SEO hub.
 *
 * Plain data, server-rendered — no CMS. To publish: add an entry (newest
 * first), push. Every guide must earn its place by answering the search
 * honestly and then linking to the service page that solves the problem.
 *
 * Copy rules are the same as everywhere else: no prices, no brand names, no
 * warranty claims, no invented statistics, no "we've done hundreds". Where a
 * number would help, describe what drives it instead of inventing one.
 */

export type Block =
  | { t: "p"; x: string }
  | { t: "h2"; x: string }
  | { t: "h3"; x: string }
  | { t: "ul"; items: string[] }
  | { t: "ol"; items: string[] }
  | { t: "note"; x: string }
  /** Inline link out to a service page — this is the conversion path. */
  | { t: "cta"; x: string; to: string; label: string };

export type GuideCategory = "Car Audio" | "Vehicle Security" | "Lighting" | "Home Theater";

export type Guide = {
  slug: string;
  title: string;
  /** Shorter label for nav and footer lists. */
  navTitle: string;
  description: string;
  /** ISO date; drives sort order and Article schema. */
  date: string;
  minutes: number;
  category: GuideCategory;
  /** Service page this guide should feed. */
  service: string;
  body: Block[];
};

export const GUIDE_CATEGORIES: GuideCategory[] = [
  "Car Audio",
  "Vehicle Security",
  "Lighting",
  "Home Theater",
];

export const guides: Guide[] = [
  /* ------------------------------------------------------- car audio -- */
  {
    slug: "why-factory-car-audio-sounds-flat",
    title: "Why your factory car stereo sounds flat — and what actually fixes it",
    navTitle: "Why factory audio sounds flat",
    description:
      "It isn't your ears and it isn't the streaming service. Here's what a factory system is really made of, why it gives up when you turn it up, and the order to fix it in.",
    date: "2026-09-14",
    minutes: 6,
    category: "Car Audio",
    service: "car-audio",
    body: [
      {
        t: "p",
        x: "Almost everyone who calls about car audio says a version of the same thing: the stereo is fine at low volume, and then it isn't. The highs get sharp, the bass turns to mud, and the song that sounded huge on headphones sounds like it's coming out of a shoebox. That's not a taste problem. It's a hardware problem with a predictable cause.",
      },
      { t: "h2", x: "What a factory system is actually made of" },
      {
        t: "p",
        x: "Car makers build audio to a budget, and the budget is small. A typical factory setup is a head unit with a built-in amplifier producing a handful of clean watts per channel, driving speakers with paper cones and small magnets. Even the branded 'premium' packages are mostly the same parts with better marketing and a little extra processing.",
      },
      {
        t: "p",
        x: "That combination works at conversation volume. Above it, the built-in amp runs out of headroom and starts clipping — flattening the peaks of the signal — and clipping is what you hear as harshness. The speakers, meanwhile, physically can't move enough air to reproduce the bottom of the music at all.",
      },
      { t: "h2", x: "The three things that are wrong, in order" },
      {
        t: "ol",
        items: [
          "The speakers can't reproduce detail or low end. This is the biggest problem and the cheapest to fix.",
          "The amplifier can't deliver clean power. This is why it gets harsh when it's loud.",
          "There's no subwoofer. Door speakers were never going to give you the bottom two octaves — nothing that size can.",
        ],
      },
      {
        t: "note",
        x: "Notice that the head unit isn't on the list. On most modern cars the factory radio is fine as a source. The problems are downstream of it, and they can be fixed without touching the screen you use for CarPlay.",
      },
      { t: "h2", x: "Fix it in the same order" },
      {
        t: "p",
        x: "A speaker upgrade in the factory locations is the single biggest improvement for the money. Better cones, real tweeters, more detail — and it runs off the factory radio, so the install is clean and reversible. If you only do one thing, do this.",
      },
      {
        t: "p",
        x: "An amplifier is the second step. It doesn't just make things louder; it gives the system headroom, so it stays relaxed at the volume you actually listen at. A compact amp can integrate behind a factory radio and stay invisible.",
      },
      {
        t: "p",
        x: "A subwoofer is the third. This is where music starts to feel like music, because the low end finally exists. It doesn't have to be a big box — trucks and small cars have under-seat and compact enclosure options — and it doesn't have to be loud. It has to be tight.",
      },
      { t: "h2", x: "The part people skip" },
      {
        t: "p",
        x: "Sound deadening on the doors and trunk. It stops the panel buzz that makes even good bass sound cheap, and it lets the door speakers work against a solid surface instead of a tin can. It's the least glamorous item on the list and the one that changes how the bass feels more than anything else.",
      },
      {
        t: "cta",
        x: "If your system falls apart when you turn it up, that's the order we'd fix it in — and we'd tell you where to stop.",
        to: "/car-audio",
        label: "See car audio",
      },
    ],
  },
  {
    slug: "upgrade-car-audio-keep-factory-radio",
    title: "How to upgrade your car audio without replacing the factory radio",
    navTitle: "Keep the factory radio",
    description:
      "On most newer cars the screen runs the climate, the cameras and CarPlay, and nobody wants to lose that. Here's how a real system integrates behind it.",
    date: "2026-09-13",
    minutes: 5,
    category: "Car Audio",
    service: "car-audio",
    body: [
      {
        t: "p",
        x: "Ten years ago, upgrading a car stereo meant pulling the radio out and putting a new one in. On a lot of cars, that's no longer possible — and on most of the rest, it's no longer a good idea. The factory screen runs climate control, backup cameras, vehicle settings and phone integration, and losing any of that is a bad trade for better speakers.",
      },
      { t: "h2", x: "Integration, not replacement" },
      {
        t: "p",
        x: "The modern approach leaves the factory head unit exactly where it is and taps the signal coming out of it. A line-level converter takes the speaker-level output from the radio and turns it into a clean signal an amplifier can use. A digital signal processor — a DSP — does the same job and adds the ability to correct the factory equalisation, set crossovers, time-align the speakers and tune the whole thing to the car.",
      },
      {
        t: "p",
        x: "From the driver's seat, nothing changes. Same screen, same steering-wheel buttons, same CarPlay. From the listener's seat, everything does.",
      },
      { t: "h2", x: "What a DSP fixes that a converter can't" },
      {
        t: "p",
        x: "Factory systems bake in equalisation to make cheap speakers sound acceptable — boosting the bass at low volume, rolling it off as you turn up, cutting frequencies the stock speakers can't handle. Put good speakers on that signal and you inherit all of it. A DSP measures the factory curve and flattens it, so the new gear gets a clean signal to work with.",
      },
      {
        t: "ul",
        items: [
          "Flattens the factory EQ curve so upgrades sound like upgrades",
          "Sets proper crossovers so tweeters and subs each get only what they should",
          "Time-aligns the speakers so the sound arrives together at the driver's seat",
          "Lets the whole system be tuned with a measurement mic, not by guesswork",
        ],
      },
      { t: "h2", x: "When a new head unit still makes sense" },
      {
        t: "p",
        x: "Older vehicles with a simple single- or double-DIN radio and no screen-dependent functions. Work trucks. Anything where the owner wants wireless CarPlay or Android Auto and the factory unit can't do it. In those cases a new receiver adds a modern screen and proper preamp outputs, and it's the right call. We'll tell you which category your car is in before you spend anything.",
      },
      {
        t: "note",
        x: "A good rule: if your radio does anything other than play audio — climate, cameras, settings — keep it and integrate behind it. If it's just a radio, replacing it is on the table.",
      },
      {
        t: "cta",
        x: "Every quote we do starts with which of those two your car is.",
        to: "/car-audio",
        label: "Get a car audio quote",
      },
    ],
  },
  {
    slug: "do-i-need-an-amplifier",
    title: "Do you actually need an amplifier? A straight answer",
    navTitle: "Do I need an amp?",
    description:
      "Power isn't the point — headroom is. When an amp is the best money you can spend, when it isn't, and what 'watts' really means on a spec sheet.",
    date: "2026-09-12",
    minutes: 5,
    category: "Car Audio",
    service: "car-audio",
    body: [
      {
        t: "p",
        x: "People ask this expecting a sales pitch. Here's the honest version: if you only ever listen at conversation volume, new speakers alone will make you happy and an amp is money you don't need to spend yet. If you ever turn it up — on the highway, for the right song, with the windows down — an amp is the difference between a system that stays clean and one that falls apart.",
      },
      { t: "h2", x: "Headroom, not loudness" },
      {
        t: "p",
        x: "An amplifier's job isn't to make the system louder, although it can. Its job is to reproduce the peaks in the music without clipping. Music isn't a steady tone; it's constant spikes — a snare hit, a bass note, a vocal — and each one needs several times the average power for a few milliseconds. A factory radio with a few clean watts per channel hits its ceiling on those peaks, flattens them, and that flattening is what you hear as harsh, fatiguing sound.",
      },
      {
        t: "p",
        x: "An amp with real headroom passes those peaks through intact. The system sounds relaxed at the same volume, and it has somewhere to go when you want more.",
      },
      { t: "h2", x: "What the watts on the box mean" },
      {
        t: "p",
        x: "Very little, unless you read the fine print. 'Peak' or 'max' power is a marketing number. The figure that matters is continuous RMS power at a stated impedance and distortion level. Two amplifiers with the same peak rating can differ by a factor of three in what they'll actually deliver. This is one of the places a shop earns its keep: matching real amplifier output to what the speakers can use, not to the biggest number on the shelf.",
      },
      { t: "h2", x: "The order that makes sense" },
      {
        t: "ol",
        items: [
          "Speakers first. They're the biggest improvement for the money and they'll work with a future amp.",
          "Amp second, or at the same time if you already know you listen loud.",
          "Sub last — or with the amp, since most people run both off one multi-channel unit.",
        ],
      },
      {
        t: "note",
        x: "A compact four- or five-channel amp can run the door speakers and a sub from one unit, tucked under a seat. The days of a trunk full of hardware are optional, not required.",
      },
      { t: "h2", x: "When the amp isn't the answer" },
      {
        t: "p",
        x: "If the speakers are still stock, more power mostly reveals how limited they are. If the install has a bad ground or undersized wiring, an amp will hum, cut out or underperform no matter how good it is. And if the problem is a factory EQ curve, the fix is a DSP, not more watts. A good quote tells you which of these you're dealing with.",
      },
      {
        t: "cta",
        x: "Tell us how you listen and we'll tell you whether an amp is the next step or a step you can skip for now.",
        to: "/car-audio",
        label: "See car audio options",
      },
    ],
  },

  /* ------------------------------------------------ vehicle security -- */
  {
    slug: "remote-start-what-to-know-before-you-buy",
    title: "Remote start: what it actually does and what to check before you buy",
    navTitle: "Remote start explained",
    description:
      "How remote start works with a modern key, what push-button cars need, phone versus fob range, and the questions to ask before anyone touches the wiring.",
    date: "2026-09-11",
    minutes: 5,
    category: "Vehicle Security",
    service: "vehicle-security",
    body: [
      {
        t: "p",
        x: "Remote start is the most-requested thing we install, and also the one with the most bad installs floating around. The idea is simple — start the car from a distance so it's warm or cool when you get in — but the way a modern vehicle guards its ignition makes the execution anything but.",
      },
      { t: "h2", x: "How it works with a modern key" },
      {
        t: "p",
        x: "Every car built in the last two decades has an immobiliser: the engine won't run unless it sees a chip in the key. Remote start has to satisfy that without a key present. The right way is an integration module built for your exact make and model that talks to the car's own network and authorises the start legitimately. The wrong way — and you'll still see it — is hiding a spare key inside the dash, which means anyone who gets into the car can drive it away.",
      },
      {
        t: "note",
        x: "If a quote for remote start is dramatically cheaper than the others, ask how they're handling the immobiliser. 'We tuck a key in' should end the conversation.",
      },
      { t: "h2", x: "Push-button start" },
      {
        t: "p",
        x: "Push-button cars are fully supported, but they need a model-specific module and, on some vehicles, a particular firmware. This is why a serious shop asks for the year, make, model and start type before quoting: the answer decides which hardware is required and whether it needs ordering in.",
      },
      { t: "h2", x: "Fob versus phone" },
      {
        t: "ul",
        items: [
          "A fob-based system has no monthly cost and reaches a few hundred feet to a couple of thousand, depending on the remote.",
          "A phone-based system uses a cellular connection, works from anywhere with signal, and carries a subscription. It also adds lock, unlock, locate and status.",
          "Many people run both: the fob for the driveway, the app for everything else.",
        ],
      },
      { t: "h2", x: "What a good install includes" },
      {
        t: "p",
        x: "The correct module for the vehicle, checked before booking. Hidden placement and factory-style wiring. A safety shutdown if a door opens without the key. A run-timer set to what you want. Every function tested with you in the car, and the app set up before you leave. It should look and behave like a factory option, because on a lot of cars that's exactly what it's emulating.",
      },
      {
        t: "cta",
        x: "Tell us your year, make, model and start type and we'll confirm compatibility before we quote a number.",
        to: "/vehicle-security",
        label: "See remote start & security",
      },
    ],
  },
  {
    slug: "car-alarm-vs-gps-tracker",
    title: "Car alarm or GPS tracker: which one actually protects you?",
    navTitle: "Alarm vs GPS tracker",
    description:
      "They solve different problems. One stops the quick break-in; the other gets the car back. Here's how to decide, and why a lot of people end up with both.",
    date: "2026-09-10",
    minutes: 5,
    category: "Vehicle Security",
    service: "vehicle-security",
    body: [
      {
        t: "p",
        x: "People tend to ask for 'an alarm' when what they're worried about is losing the car, and 'a tracker' when what they're worried about is a smashed window. It's worth being precise, because the two products do different jobs and the right answer depends on which loss you're actually trying to prevent.",
      },
      { t: "h2", x: "What an alarm does" },
      {
        t: "p",
        x: "An alarm deters. Its whole value is in the first ten seconds: a shock or tilt sensor trips, the siren goes, and a thief who wanted a quick window-and-bag job moves on to a quieter car. A two-way alarm adds the part most people don't realise they want — the remote tells you it's tripped, so you know while it's happening rather than when you come back to broken glass.",
      },
      {
        t: "p",
        x: "What an alarm won't do is stop a determined thief with a flatbed or a relay device, and it won't help once the car has left the parking lot.",
      },
      { t: "h2", x: "What a tracker does" },
      {
        t: "p",
        x: "A tracker recovers. It's hidden, it has its own battery backup, and it reports the car's location to an app. Geofence alerts tell you the moment the car moves when it shouldn't. If the car goes, you can tell the police exactly where it is — which turns 'stolen' into 'recovered' more often than any other single measure.",
      },
      {
        t: "p",
        x: "What a tracker won't do is stop the break-in in the first place. It's silent by design.",
      },
      { t: "h2", x: "So which one?" },
      {
        t: "ul",
        items: [
          "Street parking, a stereo worth stealing, a truck with an exposed catalytic converter: alarm first.",
          "A high-theft model, a teen driver, a work vehicle you can't afford to lose: tracker first.",
          "Both of the above: both. They share the install, so doing them together costs less than two visits.",
        ],
      },
      {
        t: "note",
        x: "Trackers and phone-app control need a cellular connection, so they carry a subscription. Alarms and fob-based remote start don't. Ask for the running cost before you decide, not after.",
      },
      {
        t: "cta",
        x: "Tell us where the car lives and what's in it, and we'll say which one — or both — is worth your money.",
        to: "/vehicle-security",
        label: "See alarms & trackers",
      },
    ],
  },

  /* --------------------------------------------------------- lighting -- */
  {
    slug: "what-professional-landscape-lighting-includes",
    title: "What a professional landscape lighting install actually includes",
    navTitle: "What pro landscape lighting includes",
    description:
      "The difference between a lit yard and a designed one is in the parts you never see. Fixtures, transformer, wire, aiming — and why it's done at night.",
    date: "2026-09-09",
    minutes: 6,
    category: "Lighting",
    service: "lighting",
    body: [
      {
        t: "p",
        x: "You can buy a box of solar path lights and have them in the ground in an afternoon. You'll also be replacing them in a year, and the yard will look like a runway. Professional low-voltage lighting is a different product built to a different standard, and most of that standard is invisible once it's done.",
      },
      { t: "h2", x: "It starts with a plan, not a fixture count" },
      {
        t: "p",
        x: "A good install begins with a walk around the property — ideally at dusk — to decide what should be seen: the tree that anchors the yard, the stone on the entry, the path from the drive to the door. Lighting is then designed in layers: uplights on the things with height, grazing light on textured walls, low path lights where people walk. Fixtures go where the property asks for them, not on a grid.",
      },
      { t: "h2", x: "The parts that separate it from a kit" },
      {
        t: "ul",
        items: [
          "Fixtures specified by beam angle and colour temperature, in materials that survive sprinklers and sun.",
          "A transformer sized with headroom, so you can add fixtures later without replacing it.",
          "Direct-burial wire trenched to depth, with sealed, waterproof connections — the number one failure point in cheap installs.",
          "Runs balanced so the last fixture on the line is as bright as the first.",
          "Control: a photocell, a timer, or an app with scenes — whichever you'll actually use.",
        ],
      },
      { t: "h2", x: "Why it's aimed at night" },
      {
        t: "p",
        x: "You can't aim a light in daylight. The final step of a proper install is coming back after dark, walking the property, and adjusting every fixture — tightening a beam on a tree, softening a wall wash, moving a path light that's hitting someone's eyes from the sidewalk. This is the part that makes the result look designed rather than installed, and the part a kit can never give you.",
      },
      {
        t: "note",
        x: "Warm colour temperature matters more than brightness. A yard lit at the cool white of a parking lot looks harsh no matter how well it's aimed.",
      },
      { t: "h2", x: "Homes and businesses" },
      {
        t: "p",
        x: "The same discipline applies to a storefront, a restaurant patio or a sign — with commercial-grade fixtures, a schedule matched to trading hours, and light that's bright enough to read by but warm enough to make people want to walk in. A business that's dark at six is invisible to evening traffic.",
      },
      {
        t: "cta",
        x: "The site walk is free, and it's where the plan comes from.",
        to: "/lighting",
        label: "Book a lighting site walk",
      },
    ],
  },

  /* ----------------------------------------------------- home theater -- */
  {
    slug: "soundbar-vs-surround-sound",
    title: "Soundbar or real surround sound: when is a full system worth it?",
    navTitle: "Soundbar vs surround",
    description:
      "For a lot of living rooms a good soundbar and a sub is the honest answer. For others it's a compromise you'll regret. Here's how to tell which room you have.",
    date: "2026-09-08",
    minutes: 5,
    category: "Home Theater",
    service: "home-theater",
    body: [
      {
        t: "p",
        x: "This is the question we're asked most about home audio, and the answer is genuinely 'it depends' — but it depends on things you can check yourself before calling anyone.",
      },
      { t: "h2", x: "What a soundbar does well" },
      {
        t: "p",
        x: "A good soundbar with a separate subwoofer is a huge step up from TV speakers. Dialogue gets clear, movies get a bottom end, and there's one box under the TV and one in the corner. In an open-plan living room where speakers can't go where they'd need to anyway, it's often the right call and the one we'll recommend.",
      },
      { t: "h2", x: "Where it runs out" },
      {
        t: "p",
        x: "A soundbar fakes surround by bouncing sound off walls. In a room with a wall on each side at a sensible distance, that works surprisingly well. In an open room, or one with a big window on one side, it doesn't — the effect collapses and you're left with a wide stereo pair. And no soundbar puts a sound genuinely behind you.",
      },
      { t: "h2", x: "When a real system earns its keep" },
      {
        t: "ul",
        items: [
          "A dedicated room, or a living room with walls where the surround speakers can go.",
          "You watch a lot of films, or you care about music as much as movies.",
          "You want height channels — the overhead layer that modern soundtracks are mixed for.",
          "You're already opening walls for a renovation, so in-wall and in-ceiling speakers are nearly free to run.",
        ],
      },
      {
        t: "note",
        x: "Speaker placement matters more than speaker price. A mid-range surround system positioned and calibrated correctly beats an expensive one with the rears wherever they happened to fit.",
      },
      { t: "h2", x: "The honest middle" },
      {
        t: "p",
        x: "Plenty of rooms end up with a receiver, a front pair and a sub — a proper stereo with real dynamics — with surrounds added later when the room allows. Starting there is cheaper than a full system and better than any soundbar, and it grows.",
      },
      {
        t: "cta",
        x: "Send us a photo from where you sit and we'll tell you which one your room is.",
        to: "/home-theater",
        label: "Book a room visit",
      },
    ],
  },
  {
    slug: "hiding-tv-and-speaker-wires",
    title: "Hiding the wires: how a clean TV and speaker install is actually done",
    navTitle: "Hiding TV & speaker wires",
    description:
      "Cables down the wall are the difference between 'we bought a TV' and 'we have a theater'. What in-wall wiring involves, what it costs in disruption, and when it isn't possible.",
    date: "2026-09-07",
    minutes: 4,
    category: "Home Theater",
    service: "home-theater",
    body: [
      {
        t: "p",
        x: "A wall-mounted TV with a bundle of cables hanging under it and a power strip on the floor looks unfinished because it is. Getting the wiring inside the wall is the single change that makes a living room look designed, and it's usually less disruptive than people expect.",
      },
      { t: "h2", x: "What goes in the wall" },
      {
        t: "ul",
        items: [
          "A power outlet behind the TV, installed to code, so there's no extension lead in the wall — that's a fire hazard and an inspection failure.",
          "HDMI and network cable to wherever the equipment lives: a cabinet, a closet, a rack.",
          "Speaker wire to each speaker position, including ceiling positions for height channels.",
          "A brush plate or recessed box at each end so the wall looks finished, not drilled.",
        ],
      },
      { t: "h2", x: "How it's done in a finished house" },
      {
        t: "p",
        x: "Cable is fished through the wall cavity between the studs, up into the attic or down into a crawlspace, and along to where it needs to go. Where there's a fire block or an obstacle, a small opening is cut, the cable passed, and the drywall patched — paintable, invisible once it's finished. Most living-room jobs involve two or three such openings at most.",
      },
      { t: "h2", x: "When it's harder" },
      {
        t: "p",
        x: "Slab floors with no crawlspace, exterior walls full of insulation, and brick or concrete block all complicate things. It's rarely impossible, but it can mean a surface raceway painted to match on a short run, or a different route. This is exactly what the room visit is for: we look before we quote, and if a wall isn't workable we say so.",
      },
      {
        t: "note",
        x: "If you're renovating, pre-wire. Running cable while walls are open costs a fraction of doing it after, even if the equipment comes years later.",
      },
      {
        t: "cta",
        x: "Show us the wall and we'll tell you what's involved.",
        to: "/home-theater",
        label: "See home theater",
      },
    ],
  },
];

export const guideBySlug = (slug: string) => guides.find((g) => g.slug === slug);

export const guidesForService = (serviceSlug: string) =>
  guides.filter((g) => g.service === serviceSlug).slice(0, 3);
