import BentoSection from "@/components/BentoSection";
import BookingsSection from "@/components/BookingsSection";
import CircleSection from "@/components/CircleSection";
import Footer from "@/components/Footer";
import GallerySection from "@/components/GallerySection";
import Hero from "@/components/Hero";
import MiniPlayer from "@/components/MiniPlayer";
import MusicSection from "@/components/MusicSection";
import Nav from "@/components/Nav";
import StorySection from "@/components/StorySection";
import TourSection from "@/components/TourSection";
import VisualsSection from "@/components/VisualsSection";
import { PlayerProvider } from "@/lib/player";
import { SiteContentProvider } from "@/lib/site-content";
import { getPublishedContent } from "@/lib/admin/content";

export default async function Home() {
  const content = await getPublishedContent();
  return (
    <SiteContentProvider content={content}>
      <PlayerProvider>
      <Nav />
      <main id="main">
        <Hero />
        <MusicSection />
        <VisualsSection />
        <GallerySection />
        <StorySection />
        <BentoSection />
        <TourSection />
        <CircleSection />
        <BookingsSection />
      </main>
      <Footer />
      <MiniPlayer />
      </PlayerProvider>
    </SiteContentProvider>
  );
}
