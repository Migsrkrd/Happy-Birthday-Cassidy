/**
 * May birth-month symbols for Cassidy (May 16).
 * Card art lives in `src/assets/may-symbols/`.
 */

import maySymEmerald from "./assets/may-symbols/may-symbol-emerald.png";
import maySymLilyOfTheValley from "./assets/may-symbols/may-symbol-lily-of-the-valley.png";
import maySymHawthorn from "./assets/may-symbols/may-symbol-hawthorn.png";
import maySymTaurus from "./assets/may-symbols/may-symbol-taurus.png";
import maySymEarth from "./assets/may-symbols/may-symbol-earth.png";
import maySymVenus from "./assets/may-symbols/may-symbol-venus.png";
import maySymGreens from "./assets/may-symbols/may-symbol-greens.png";
import maySymEvenings from "./assets/may-symbols/may-symbol-evenings.png";
import maySymMay from "./assets/may-symbols/may-symbol-may.png";

/** Resolved image URL per card `id` (Vite). */
export const MAY_SYMBOL_IMAGE_BY_ID = Object.freeze({
  emerald: maySymEmerald,
  "lily-of-the-valley": maySymLilyOfTheValley,
  hawthorn: maySymHawthorn,
  taurus: maySymTaurus,
  earth: maySymEarth,
  venus: maySymVenus,
  greens: maySymGreens,
  evenings: maySymEvenings,
  may: maySymMay,
});

export const MAY_BIRTH_SYMBOLS_INTRO = Object.freeze({
  eyebrow: "May & you",
  title: "What May lays at your feet",
  lead: "Birthstone, flowers, and a few things people quietly associate with this time of year. All yours, nothing to unlock.",
});

/** @type {readonly { id: string; kind: string; title: string; text: string }[]} */
export const MAY_BIRTH_SYMBOLS = Object.freeze([
  {
    id: "emerald",
    kind: "Birthstone",
    title: "Emerald",
    text: "May’s stone is deep green emerald: the color of shade under leaves, old gardens, and staying vivid year after year.",
  },
  {
    id: "lily-of-the-valley",
    kind: "Birth flower",
    title: "Lily of the valley",
    text: "Tiny white bells on one arching stem, shy-looking, stubbornly sweet, and the unofficial scent of “spring finally decided to show up.”",
  },
  {
    id: "hawthorn",
    kind: "Birth flower",
    title: "Hawthorn",
    text: "May hedgerows in bloom: soft petals, tougher branches underneath. A flower that knows how to be gentle and still hold its ground.",
  },
  {
    id: "taurus",
    kind: "Zodiac",
    title: "Sun in Taurus",
    text: "A May 16 birthday sits in Taurus season: steady warmth, loyalty that doesn’t need a speech, and a serious respect for comfort done right.",
  },
  {
    id: "earth",
    kind: "Element",
    title: "Earth",
    text: "Taurus is an earth sign: plans that feel solid, rooms that feel lived-in, and the kind of calm that comes from knowing what matters to you.",
  },
  {
    id: "venus",
    kind: "Ruling planet",
    title: "Venus",
    text: "Taurus answers to Venus: eye for beauty, ear for music, and full permission to care a lot about how a day should feel, not just how it looks on paper.",
  },
  {
    id: "greens",
    kind: "Color",
    title: "Greens of every shade",
    text: "Emerald’s family runs from moss to sea-glass. May’s whole palette is the world remembering how to be green again.",
  },
  {
    id: "evenings",
    kind: "Moon & evenings",
    title: "Longer nights, softer light",
    text: "By mid-May the evenings stretch: porch weather, car windows down, and small routines that belong only to this part of the year.",
  },
  {
    id: "may",
    kind: "The month",
    title: "May itself",
    text: "Birdsong turned up, jackets left in the car, and the sense that the year has finally tipped toward summer. Your birthday sits right in that hinge.",
  },
]);
