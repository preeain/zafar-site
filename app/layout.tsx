import type { Metadata, Viewport } from "next";
import { Archivo, Archivo_Black, Noto_Sans_Gurmukhi } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { links, site } from "@/content/site";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-archivo",
  display: "swap",
});

const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-archivo-black",
  display: "swap",
});

const notoGurmukhi = Noto_Sans_Gurmukhi({
  subsets: ["gurmukhi"],
  weight: ["600", "700"],
  variable: "--font-noto-gurmukhi",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.ogTitle,
  description: site.description,
  alternates: { canonical: "/" },
  applicationName: "Zafar Sandhu",
  category: "music",
  keywords: ["Zafar Sandhu", "GAME", "Pree Mayall", "Punjabi music", "Punjabi artist"],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: site.ogTitle,
    description: site.ogDescription,
    type: "website",
    url: "/",
    siteName: "Zafar Sandhu",
    locale: "en_US",
    images: [{ url: links.gameSocialImage, width: 1200, height: 630, alt: "GAME by Zafar Sandhu and Pree Mayall" }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.ogTitle,
    description: site.ogDescription,
    images: [links.gameSocialImage],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MusicGroup",
      "@id": `${site.url}/#artist`,
      name: "Zafar Sandhu",
      genre: ["Punjabi", "Pop"],
      url: site.url,
      image: `${site.url}/img/hero-studio.jpg`,
      logo: `${site.url}/img/logo-black.png`,
      sameAs: [links.spotifyArtist, links.appleArtist, links.youtubeChannel],
    },
    {
      "@type": "MusicRecording",
      "@id": `${site.url}/#game`,
      name: "GAME",
      duration: "PT2M48S",
      datePublished: "2025-11-22",
      url: links.spotifyTrack,
      image: links.gameArtwork,
      byArtist: [
        { "@id": `${site.url}/#artist` },
        { "@type": "Person", name: "Pree Mayall" },
      ],
      inAlbum: {
        "@type": "MusicAlbum",
        name: "GAME - Single",
        albumReleaseType: "SingleRelease",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${archivoBlack.variable} ${notoGurmukhi.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
