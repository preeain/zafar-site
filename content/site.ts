// Central content config. Empty URLs intentionally render as unavailable UI;
// this keeps unfinished destinations from behaving like working links.

export const site = {
  name: "ZAFAR SANDHU",
  description:
    "Official site of Punjabi artist Zafar Sandhu. Stream GAME with Pree Mayall, watch the official video, and join The Circle for new music and live updates.",
  ogTitle: "ZAFAR SANDHU — GAME OUT NOW",
  ogDescription:
    "Stream GAME by Zafar Sandhu and Pree Mayall, watch the official video, and get artist updates from The Circle.",
  url: "https://zafarsandhu.com",
};

export const links = {
  spotifyTrack: "https://open.spotify.com/track/4KcBt9xWi2VGzC5ggh0Rsu",
  spotifyArtist: "https://open.spotify.com/artist/3Q1isolUOcUmnxscdi4TUM",
  appleTrack: "https://music.apple.com/in/album/game-single/1853006532",
  appleArtist: "https://music.apple.com/us/artist/zafar-sandhu/1821668270",
  youtubeVideo: "https://www.youtube.com/watch?v=XGt6oHjTFn8",
  youtubeChannel: "https://www.youtube.com/@imzafarsandhu",
  gameArtwork: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/71/03/5b/71035b9c-c0ed-288e-987c-5bdf4d00d19a/199806445303.jpg/1200x1200bb.jpg",
  gameSocialImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/71/03/5b/71035b9c-c0ed-288e-987c-5bdf4d00d19a/199806445303.jpg/1200x630wp-60.jpg",
};

export const config = {
  /** Exactly one bento tile is red. */
  redTile: "release" as "release" | "show" | "community" | "merch",
  autoAdvance: true,
};

export const hero = {
  tagline: "GAME — OUT NOW",
  streamingLinks: [
    { label: "SPOTIFY", href: links.spotifyTrack },
    { label: "APPLE MUSIC", href: links.appleTrack },
    { label: "YOUTUBE", href: links.youtubeVideo },
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
  { title: "GAME", dur: 168, src: "", link: links.spotifyTrack },
];

export const release = {
  title: "GAME",
  date: "NOV 22, 2025",
  credits: "ZAFAR SANDHU & PREE MAYALL · ℗ 2025 MASS APPEAL",
  href: links.spotifyTrack,
  lyricsGurmukhi: [] as string[],
  lyricsTransliteration: [] as string[],
};

export const nextDrop = {
  title: "MORE MUSIC",
  date: "JOIN THE CIRCLE FOR THE NEXT DROP",
  presaveHref: "",
};

export const visuals = {
  youtubeId: "XGt6oHjTFn8",
  caption: "GAME — OFFICIAL VIDEO",
  description:
    "Watch GAME by Zafar Sandhu and Pree Mayall. Captions and full playback controls are available on YouTube.",
  youtubeHref: links.youtubeVideo,
  bts: ["STUDIO", "ON SET", "BETWEEN TAKES", "AFTER HOURS"],
};

export const story = {
  overline: "04 — THE STORY",
  gurmukhiName: "ਜ਼ਫ਼ਰ ਸੰਧੂ",
  headline: "PUNJABI ROOTS. A GLOBAL SOUND.",
  paragraphs: [
    "Zafar Sandhu writes in Punjabi first — hooks built on the music he grew up around, shaped by the records he discovered later.",
    "New music, visuals, and live announcements are on the way.",
  ],
  pressKit: { label: "PRESS KIT COMING SOON", href: "" },
};

export const bento = {
  release: { overline: "TOP SINGLE", title: "GAME", action: "STREAM ON SPOTIFY ↗", href: links.spotifyTrack },
  show: { overline: "LIVE", city: "DATES", date: "COMING SOON", action: "VIEW UPDATES →", href: "#tour" },
  community: { overline: "COMMUNITY", title: "THE CIRCLE", action: "JOIN FIRST →", href: "#community" },
  merch: { overline: "MERCH", title: "FIRST DROP", action: "COMING SOON", href: "#contact" },
};

export type Show = {
  id: string;
  date: string;
  city: string;
  venue: string;
  tickets: string;
};

export const shows: Show[] = [];

export const circle = {
  copy: "First access to unreleased music and presales. Nothing else, ever.",
  privacy: "We only email about music and shows. Unsubscribe anytime.",
  privacyPolicy: { label: "PRIVACY DETAILS", href: "/privacy" },
  whatsapp: { label: "WHATSAPP CHANNEL COMING SOON", href: "" },
};

export const bookings = {
  live: {
    copy: "Festivals, club shows and private events — worldwide. Full live set or acoustic. Rider and stage plot on request.",
    email: "",
  },
  collabs: {
    copy: "Features, writing sessions and production. Punjabi vocals, hooks and toplines — send the idea, keep it short.",
    email: "",
  },
  press: {
    quote: "Official biography, approved photography, and press materials are being prepared.",
    publication: "PRESS KIT COMING SOON",
    kitHref: "",
    email: "",
  },
};

export const footer = {
  mgmtEmail: "",
  pressEmail: "",
  socials: [
    { label: "SPOTIFY", href: links.spotifyArtist },
    { label: "APPLE MUSIC", href: links.appleArtist },
    { label: "YOUTUBE", href: links.youtubeChannel },
  ] as { label: string; href: string }[],
  year: "2026",
};

export const defaultContent = {
  site,
  config,
  hero,
  tracks,
  release,
  nextDrop,
  visuals,
  story,
  bento,
  shows,
  circle,
  bookings,
  footer,
};

export type SiteContent = typeof defaultContent;
