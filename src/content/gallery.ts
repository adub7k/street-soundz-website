/**
 * Portfolio configuration.
 *
 * Every photo on this site comes from ShopFlow (Settings → Work Gallery), so
 * the owner can add work without a deploy. The shop is new, so the gallery
 * starts empty and every "our work" section hides itself until the first
 * photo lands. There is no stock photography here and none should be added.
 *
 * A caption typed into ShopFlow files the photo under a service using the
 * keyword map below; anything unmatched shows under "All work".
 */

import type { GalleryTag } from "./services";

export const galleryFilters: { key: GalleryTag | "all"; label: string }[] = [
  { key: "all", label: "All work" },
  { key: "audio", label: "Car Audio" },
  { key: "security", label: "Security" },
  { key: "lighting", label: "Lighting" },
  { key: "theater", label: "Home Theater" },
];

/** Keyword → tag, so a caption typed in ShopFlow files a photo correctly. */
const CAPTION_TAGS: [RegExp, GalleryTag][] = [
  [/alarm|remote start|tracker|gps|security|immobil/i, "security"],
  [
    /theater|theatre|projector|surround|tv mount|soundbar|home audio|in-ceiling|multi-?room/i,
    "theater",
  ],
  [
    /landscape|path|step light|lighting|uplight|façade|facade|storefront|signage|sign light|led strip/i,
    "lighting",
  ],
  [/audio|speaker|amp|sub|woofer|head unit|stereo|carplay|deadening|tune/i, "audio"],
];

export function tagFromCaption(caption: string): GalleryTag | null {
  for (const [re, tag] of CAPTION_TAGS) if (re.test(caption)) return tag;
  return null;
}
