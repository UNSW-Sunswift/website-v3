import Image from "next/image"

import { resolveSiteImage, type SiteImageMap } from "@/lib/cms/site-images"

export function HomepageAbout({ imageOverrides }: { imageOverrides?: SiteImageMap }) {
  return (
    <section data-homepage-about className="relative bg-[#f6f5f1] text-black">
      <div className="mx-auto grid max-w-[92rem] gap-10 px-4 py-24 sm:px-6 lg:grid-cols-[0.86fr_1.14fr] lg:items-center lg:py-32">
        <div className="max-w-xl">
          <p className="font-mono text-[0.68rem] tracking-[0.26em] text-black/42 uppercase">
            Who we are
          </p>
          <h2 className="mt-4 text-5xl leading-[0.96] font-thin tracking-normal text-black sm:text-6xl lg:text-7xl">
            What is Sunswift Racing?
          </h2>
          <div className="mt-8 space-y-6 border-l border-black/12 pl-5 text-base leading-7 text-black/64 sm:text-lg sm:leading-8">
            <p>
              Sunswift Racing is a team of innovators working to redefine the
              future of sustainable transport through the research and
              development of world class prototype electric cars. Whilst
              Sunswift is best known for its success in the World Solar
              Challenge, we also focus on progressing technology through
              partnerships and collaborations with industry leaders.
            </p>
            <p>
              Based in Sydney, Australia since 1996, Sunswift has built seven
              solar vehicles, with the eighth currently in production. Over this
              time, Sunswift has seen success in numerous solar vehicle races
              and holds records with the FIA and Guinness World Records.
            </p>
          </div>
          <dl className="mt-10 grid grid-cols-3 border-y border-black/10 py-5">
            <div>
              <dt className="font-mono text-[0.58rem] tracking-[0.2em] text-black/40 uppercase">
                Since
              </dt>
              <dd className="mt-2 text-3xl font-thin tabular-nums">1996</dd>
            </div>
            <div className="border-l border-black/10 pl-4">
              <dt className="font-mono text-[0.58rem] tracking-[0.2em] text-black/40 uppercase">
                Cars
              </dt>
              <dd className="mt-2 text-3xl font-thin tabular-nums">8</dd>
            </div>
            <div className="border-l border-black/10 pl-4">
              <dt className="font-mono text-[0.58rem] tracking-[0.2em] text-black/40 uppercase">
                Home
              </dt>
              <dd className="mt-2 text-3xl font-thin">UNSW</dd>
            </div>
          </dl>
        </div>
        <div
          data-homepage-about-shared-vehicle
          className="relative aspect-[16/10] w-full overflow-hidden border border-black/10 bg-[#eceae4] shadow-[0_28px_86px_rgba(0,0,0,0.1)]"
        >
          <Image
            src={resolveSiteImage("/media/sr8-hero-3.png", imageOverrides)}
            alt="Sunswift Racing solar vehicle in the lab"
            fill
            className="object-cover object-[50%_50%]"
            sizes="(min-width: 1024px) 46vw, 100vw"
          />
        </div>
      </div>
    </section>
  )
}
