// Central content config. Everything in [BRACKETS] is a placeholder awaiting
// real facts — keep the bracket convention until final content lands.

export const site = {
  name: "ZAFAR SANDHU",
  description:
    "ZAFAR SANDHU — Punjabi singer. [DEBUT SINGLE] out now. Music, videos, tour dates, and The Circle — first access to unreleased music and presales.",
  ogTitle: "ZAFAR SANDHU — [DEBUT SINGLE] OUT NOW",
  ogDescription: "Punjabi singer. Music, videos, tour dates, and The Circle.",
  url: "https://zafarsandhu.com",
};

export const config = {
  /** Exactly one bento tile is red. */
  redTile: "show" as "release" | "show" | "community" | "merch",
  autoAdvance: true,
};

export const hero = {
  tagline: "[DEBUT SINGLE] — OUT NOW",
  streamingLinks: [
    { label: "SPOTIFY ↗", href: "#" },
    { label: "APPLE MUSIC ↗", href: "#" },
    { label: "YOUTUBE MUSIC ↗", href: "#" },
  ],
};

export type Track = {
  title: string;
  /** placeholder duration in seconds, used for display until masters arrive */
  dur: number;
  src: string;
  link: string;
};

export const tracks: Track[] = [
  { title: "[DEBUT SINGLE]", dur: 204, src: "/audio/track-1.mp3", link: "#" },
  { title: "[TRACK TWO]", dur: 178, src: "/audio/track-2.mp3", link: "#" },
  { title: "[TRACK THREE]", dur: 221, src: "/audio/track-3.mp3", link: "#" },
];

export const release = {
  title: "[DEBUT SINGLE]",
  date: "[RELEASE DATE]",
  credits: "PROD. [PRODUCER] · MIX [ENGINEER] · WRITTEN BY ZAFAR SANDHU",
  lyricsGurmukhi: ["[ਇੱਥੇ ਪੰਜਾਬੀ ਬੋਲ ਪਾਓ]", "[ਦੂਜੀ ਲਾਈਨ]", "[ਤੀਜੀ ਲਾਈਨ]"],
  lyricsTransliteration: ["[PASTE TRANSLITERATED LYRICS]", "[LINE TWO]", "[LINE THREE]"],
};

export const nextDrop = {
  title: "[NEXT SINGLE]",
  date: "[EXPECTED DATE]",
  presaveHref: "#",
};

export const visuals = {
  youtubeId: "XGt6oHjTFn8",
  caption: "[DEBUT SINGLE] — OFFICIAL VIDEO",
  bts: ["BTS — [CLIP 01]", "BTS — [CLIP 02]", "BTS — [CLIP 03]", "BTS — [CLIP 04]"],
};

export const story = {
  overline: "04 — THE STORY",
  gurmukhiName: "ਜ਼ਫ਼ਰ ਸੰਧੂ",
  headline: "FROM [HOMETOWN] TO THE BOOTH",
  paragraphs: [
    "Zafar Sandhu writes in Punjabi first — hooks built on the music he grew up around, cut with the records he found later. [TWO SENTENCES OF REAL BIO: WHERE HE'S FROM, WHAT SHAPED THE SOUND.]",
    "[ONE SENTENCE ON THE DEBUT SINGLE AND WHAT'S NEXT.]",
  ],
  pressKit: { label: "[PRESS KIT] ↓", href: "#" },
};

export const bento = {
  release: { overline: "LATEST RELEASE", title: "[DEBUT SINGLE]", action: "STREAMING EVERYWHERE →", href: "#music" },
  show: { overline: "NEXT SHOW", city: "[CITY]", date: "[DATE]", action: "GET PRESALE →", href: "#tour" },
  community: { overline: "COMMUNITY", title: "THE CIRCLE", action: "JOIN FIRST →", href: "#community" },
  merch: { overline: "MERCH", title: "[DROP 01]", action: "COMING SOON", href: "#contact" },
};

export const shows = [
  { date: "[DATE]", city: "[CITY]", venue: "[VENUE]", tickets: "#" },
  { date: "[DATE]", city: "[CITY]", venue: "[VENUE]", tickets: "#" },
  { date: "[DATE]", city: "[CITY]", venue: "[VENUE]", tickets: "#" },
];

export const circle = {
  copy: "First access to unreleased music and presales. Nothing else, ever.",
  privacy: "We only email about music and shows. Unsubscribe anytime.",
  privacyPolicy: { label: "[PRIVACY POLICY]", href: "#" },
  whatsapp: { label: "OR JOIN THE WHATSAPP CHANNEL ↗", href: "#" },
};

export const bookings = {
  live: {
    copy: "Festivals, club shows and private events — worldwide. Full live set or acoustic. Rider and stage plot on request.",
    email: "[BOOKINGS@EMAIL]",
  },
  collabs: {
    copy: "Features, writing sessions and production. Punjabi vocals, hooks and toplines — send the idea, keep it short.",
    email: "[COLLABS@EMAIL]",
  },
  press: {
    quote: "“[SHORT PRESS QUOTE]”",
    publication: "— [PUBLICATION]",
    kitHref: "#",
    email: "[PRESS@EMAIL]",
  },
};

export const footer = {
  mgmtEmail: "[MGMT@EMAIL]",
  pressEmail: "[PRESS@EMAIL]",
  socials: [
    { label: "INSTAGRAM", href: "#" },
    { label: "YOUTUBE", href: "#" },
    { label: "SPOTIFY", href: "#" },
  ],
  year: "[YEAR]",
};
