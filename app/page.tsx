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

export default function Home() {
  return (
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
  );
}
