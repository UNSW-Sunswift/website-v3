import Image from "next/image"

export function HomepageAbout() {
  return (
    <section
      data-homepage-about
      className="relative bg-[#f6f5f1] text-black"
    >
      <div className="mx-auto grid max-w-[92rem] gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[1fr_1fr] lg:items-center lg:py-32">
        <div className="max-w-xl">
          <h2 className="text-4xl font-light leading-[1.05] tracking-tight sm:text-5xl">
            What is Sunswift Racing?
          </h2>
          <div className="mt-8 space-y-6 text-base leading-7 text-black/65 sm:text-lg sm:leading-8">
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
              solar vehicles, with the eighth currently in production. Over
              this time, Sunswift has seen success in numerous solar vehicle
              races and holds records with the FIA and Guinness World Records.
            </p>
          </div>
        </div>
        <div
          data-homepage-about-shared-vehicle
          className="relative aspect-[4/3] w-full overflow-hidden rounded-sm border border-black/10 bg-[#f6f5f1]"
        >
          <Image
            src="/vehicle-fleet/vehicle-sunswift-8.jpg"
            alt="Sunswift Racing solar vehicle in the lab"
            fill
            className="object-cover object-[52%_50%]"
            sizes="(min-width: 1024px) 46vw, 100vw"
          />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_48%,transparent_0%,rgba(246,245,241,0.18)_58%,rgba(246,245,241,0.84)_100%)]" />
        </div>
      </div>
    </section>
  )
}
