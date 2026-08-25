import Image from "next/image";
import { story } from "@/content/site";
import Reveal from "./Reveal";

export default function StorySection() {
  return (
    <section
      id="story"
      className="bg-cognac p-[clamp(56px,7vw,110px)_clamp(20px,4vw,56px)] text-white"
    >
      <Reveal className="mx-auto grid max-w-[1240px] grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-center gap-[clamp(28px,4vw,64px)]">
        <div className="cut-crop max-h-[560px] overflow-hidden">
          <Image
            src="/img/couch.jpg"
            alt="Zafar Sandhu on a cognac leather couch"
            width={1240}
            height={1240}
            sizes="(max-width: 760px) 100vw, 620px"
            className="block h-full w-full object-cover object-[50%_28%]"
          />
        </div>
        <div>
          <p className="overline-label m-0 mb-2.5 text-black">
            {story.overline}
          </p>
          <p
            lang="pa"
            className="m-0 mb-1.5 font-gurmukhi text-[clamp(26px,3vw,42px)] leading-[1.2] font-bold text-white/92"
          >
            {story.gurmukhiName}
          </p>
          <h2 className="m-0 mb-6 font-display text-[clamp(34px,4.2vw,60px)] leading-[0.95] text-balance">
            {story.headline}
          </h2>
          {story.paragraphs.map((para, i) => (
            <p
              key={para}
              className={`m-0 max-w-[480px] text-base leading-[1.7] text-black text-pretty ${i === story.paragraphs.length - 1 ? "mb-[34px]" : "mb-4"}`}
            >
              {para}
            </p>
          ))}
          <a
            href={story.pressKit.href}
            className="cut-r inline-flex min-h-12 items-center bg-ink pr-[38px] pl-6 text-[13px] font-semibold tracking-[0.16em] text-white transition-[background,transform] duration-200 [--cut:14px] hover:translate-x-1 hover:bg-white hover:text-ink"
          >
            {story.pressKit.label}
          </a>
        </div>
      </Reveal>
    </section>
  );
}
