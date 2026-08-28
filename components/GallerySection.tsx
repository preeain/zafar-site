import Image from "next/image";
import Reveal from "./Reveal";

const photos = [
  {
    id: "g1",
    sizes: "(max-width: 760px) 100vw, 520px",
    src: "/img/hero-studio.jpg",
    alt: "Studio session, white backdrop",
    caption: "STUDIO SESSION",
    grid: "col-start-1 col-span-5 row-start-1 row-span-8",
    position: "object-[50%_18%]",
    cut: false,
  },
  {
    id: "g2",
    sizes: "(max-width: 760px) 100vw, 420px",
    src: "/img/couch.jpg",
    alt: "On the cognac leather couch",
    caption: "THE COGNAC ROOM",
    grid: "col-start-6 col-span-4 row-start-1 row-span-5",
    position: "object-[50%_30%]",
    cut: true,
  },
  {
    id: "g3",
    sizes: "(max-width: 760px) 100vw, 310px",
    src: "/img/film-red.jpg",
    alt: "35mm film scan, red plaid",
    caption: "35MM — PLAID, SCANNED",
    grid: "col-start-10 col-span-3 row-start-1 row-span-4",
    position: "object-center",
    cut: false,
  },
  {
    id: "g4",
    sizes: "(max-width: 760px) 100vw, 730px",
    src: "/img/denim.jpg",
    alt: "Amber studio, denim jacket",
    caption: "AMBER LIGHT",
    grid: "col-start-6 col-span-7 row-start-5 row-span-4",
    position: "object-[50%_24%]",
    cut: false,
  },
];

export default function GallerySection() {
  return (
    <section
      id="gallery"
      className="bg-white p-[clamp(56px,7vw,110px)_clamp(20px,4vw,56px)]"
    >
      <div className="mx-auto max-w-[1240px]">
        <Reveal>
          <p className="overline-label m-0 mb-2.5 text-ink/60">03 — GALLERY</p>
          <h2 className="section-h2">IN FRAME</h2>
        </Reveal>
        <Reveal className="grid grid-cols-12 auto-rows-[76px] gap-3.5 max-[760px]:auto-rows-auto">
          {photos.map((ph) => (
            <figure
              key={ph.id}
              className={`group relative m-0 overflow-hidden ${ph.grid} ${ph.cut ? "cut-crop" : ""} max-[760px]:col-span-full! max-[760px]:col-start-auto! max-[760px]:row-auto! max-[760px]:min-h-[320px]`}
            >
              <Image
                src={ph.src}
                alt={ph.alt}
                fill
                sizes={ph.sizes}
                className={`gallery-photo object-cover ${ph.position} grayscale transition-[filter,transform] duration-[450ms,800ms] [transition-timing-function:ease,var(--ease-zaf)] group-hover:scale-[1.02] group-hover:grayscale-0`}
              />
              <figcaption className="absolute bottom-3 left-3.5 text-[11px] font-semibold tracking-[0.18em] text-white mix-blend-difference">
                {ph.caption}
              </figcaption>
            </figure>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
