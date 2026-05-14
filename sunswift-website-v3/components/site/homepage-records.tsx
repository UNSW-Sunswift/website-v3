import Image from "next/image"

type Record = {
  id: string
  metric: string
  unit: string
  title: string
  body: string
  year: string
  image: string
}

const records: Record[] = [
  {
    id: "thousand-km",
    metric: "1,000",
    unit: "km",
    title: "Furthest distance by an EV on a single charge.",
    body:
      "Sunswift 7 carried four occupants over 1,000 km on a single charge at the Australian Automotive Research Centre, certified by Guinness World Records.",
    year: "2022",
    image: "/placeholders/vehicle-sunswift-7.svg",
  },
  {
    id: "speed-record",
    metric: "107",
    unit: "km/h",
    title: "Fastest solar-powered electric vehicle.",
    body:
      "Sunswift eVe set the FIA-ratified record for the fastest electric vehicle averaging over 500 km without recharging, an industry first for solar racing.",
    year: "2014",
    image: "/placeholders/vehicle-eve.svg",
  },
  {
    id: "world-firsts",
    metric: "7",
    unit: "cars built",
    title: "Three decades of solar engineering.",
    body:
      "Seven generations of student-built solar vehicles since 1996, with the eighth in production — a continuous record of innovation out of UNSW Sydney.",
    year: "1996 — Today",
    image: "/placeholders/vehicle-violet.svg",
  },
]

export function HomepageRecords() {
  return (
    <section
      data-homepage-records
      className="relative overflow-hidden bg-[#0a0c0e] text-white"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06)_0%,transparent_55%)]" />

      <div className="relative mx-auto max-w-[92rem] px-4 pt-24 pb-12 sm:px-6 sm:pt-32 lg:pt-40">
        <h2 className="max-w-3xl text-4xl font-light leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
          Records that move
          <br className="hidden sm:inline" /> the world forward.
        </h2>
        <p className="mt-8 max-w-xl text-base leading-7 text-white/55 sm:text-lg">
          Three decades of engineering have produced FIA-ratified and world
          records in solar mobility — each one a step toward sustainable
          transport, set by students.
        </p>
      </div>

      <div className="relative mx-auto max-w-[92rem] px-4 pb-32 sm:px-6">
        <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm lg:grid-cols-3">
          {records.map((record) => (
            <article
              key={record.id}
              data-homepage-record
              className="group relative flex flex-col bg-[#0a0c0e]/95 p-8 transition-colors duration-500 hover:bg-[#101316] sm:p-10"
            >
              <div className="relative aspect-[5/3] w-full overflow-hidden rounded-lg border border-white/5 bg-[#13171b]">
                <Image
                  src={record.image}
                  alt=""
                  fill
                  className="object-cover opacity-90 transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                  sizes="(min-width: 1024px) 28vw, 100vw"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,12,14,0)_55%,rgba(10,12,14,0.65)_100%)]" />
              </div>

              <div className="mt-8 flex items-baseline gap-2">
                <span className="text-6xl font-light leading-none tracking-tight text-white sm:text-7xl">
                  {record.metric}
                </span>
                <span className="text-base font-light tracking-wide text-white/55 sm:text-lg">
                  {record.unit}
                </span>
              </div>

              <h3 className="mt-6 text-xl font-light leading-snug text-white sm:text-2xl">
                {record.title}
              </h3>

              <p className="mt-4 text-sm leading-6 text-white/55 sm:text-base sm:leading-7">
                {record.body}
              </p>

              <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5">
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.28em] text-white/40">
                  Ratified
                </span>
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.28em] text-white/70">
                  {record.year}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
