import { publicAssetPath } from "@/lib/cms/assets"
import type {
  MediaAsset,
  Partner,
  RecruitmentRole,
  TeamMember,
  TimelineVideoSetting,
  Vehicle,
} from "@/lib/cms/types"

export type Achievement = {
  year: string
  title: string
  vehicle: string
  description: string
  /** Still image, or poster when `videoMp4` is set. */
  image: string
  kind: "race" | "record" | "showcase" | "archive"
  /**
   * Optional background video for `/achievements` (local path under `/public`,
   * e.g. `/placeholders/milestone.mp4`, or later a full CDN URL — `<video>`
   * accepts both.)
   */
  videoMp4?: string
}

export function achievementVideoSlug(achievement: Pick<Achievement, "year" | "title">) {
  return `${achievement.year}-${achievement.title}`
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function applyTimelineVideoSettings(
  sourceAchievements: Achievement[],
  settings: TimelineVideoSetting[]
) {
  const settingsBySlug = new Map(settings.map((setting) => [setting.slug, setting]))

  return sourceAchievements.map((achievement) => {
    const slug = achievementVideoSlug(achievement)
    const setting = settingsBySlug.get(slug)

    if (!setting) {
      return achievement
    }

    const videoUrl = setting.videoUrl.trim()
    const videoMp4 = setting.videoEnabled && videoUrl ? videoUrl : undefined

    return {
      ...achievement,
      videoMp4,
    }
  })
}

export const fallbackTeamMembers: TeamMember[] = [
  {
    slug: "alex-rivera",
    name: "Alex Rivera",
    role: "Mechanical Lead",
    department: "Systems Engineering",
    hierarchyLevel: "SLT",
    imageKey: "",
    sortOrder: 10,
    status: "published",
  },
  {
    slug: "maya-chen",
    name: "Maya Chen",
    role: "Race Operations",
    department: "Technical Support Systems",
    hierarchyLevel: "Team",
    imageKey: "",
    sortOrder: 20,
    status: "published",
  },
  {
    slug: "sam-taylor",
    name: "Sam Taylor",
    role: "Media Coordinator",
    department: "Media",
    hierarchyLevel: "Team",
    imageKey: "",
    sortOrder: 30,
    status: "published",
  },
]

export const fallbackRecruitmentRoles: RecruitmentRole[] = [
  {
    slug: "vehicle-dynamics-engineer",
    title: "Vehicle Dynamics Engineer",
    team: "Engineering",
    description:
      "Help model, validate and refine the systems that keep Sunswift cars efficient, stable and race-ready.",
    active: true,
    discipline: "Mechanical",
    school: "Engineering",
    responsibilitiesHtml:
      "<p>Collaborate across vehicle dynamics, simulation and test days to quantify performance trades.</p><ul><li>Build and correlate vehicle models</li><li>Instrument test sessions and summarise results</li><li>Pilot iterative setup changes safely on track</li></ul>",
    requirementsHtml:
      "<p>You are curious about data, pragmatic about timelines, and energised by student-led prototyping.</p>",
    sortOrder: 10,
    status: "published",
  },
  {
    slug: "embedded-systems-engineer",
    title: "Embedded Systems Engineer",
    team: "Engineering",
    description:
      "Build and maintain the embedded systems that connect telemetry, controls and race operations.",
    active: true,
    discipline: "Electrical",
    school: "Engineering",
    responsibilitiesHtml:
      "<p>Own firmware bring-up across sensors, telemetry links and cockpit controls.</p>",
    requirementsHtml: "<p>Comfortable reading schematics plus writing defensive, testable C/C++.</p>",
    sortOrder: 20,
    status: "published",
  },
  {
    slug: "partnerships-associate",
    title: "Partnerships Associate",
    team: "Business",
    description:
      "Support partner relationships, sponsorship proposals and the storytelling that powers student-led engineering.",
    active: true,
    discipline: "Business",
    school: "Business",
    responsibilitiesHtml:
      "<p>Craft succinct partner updates and co-own pipeline hygiene with student leads.</p>",
    requirementsHtml: "<p>Clear writing, diplomacy and reliable follow-through week to week.</p>",
    sortOrder: 30,
    status: "published",
  },
  {
    slug: "brand-storyteller",
    title: "Brand Storyteller",
    team: "Media",
    description:
      "Shape visual narratives across campaigns, shoots and launches so Sunswift stories feel cohesive and unmistakable.",
    active: true,
    discipline: "Media",
    school: "Design & Media",
    responsibilitiesHtml:
      "<p>Own story arcs for launches, partner milestones and campus recruitment touchpoints.</p><ul><li>Coordinate shoots with drivers, workshop and paddock timelines</li><li>Edit selects for hero films, thumbnails and reels</li><li>Maintain a lightweight shared asset library</li></ul>",
    requirementsHtml:
      "<p>Show a portfolio spanning photo and motion; collaborate clearly with voluntary student schedules.</p>",
    sortOrder: 40,
    status: "published",
  },
]

export const fallbackPartners: Partner[] = [
  { slug: "3m-australia", name: "3M", website: "https://www.3m.com.au", sortOrder: 10, status: "published" },
  { slug: "altium", name: "Altium", website: "https://www.altium.com/", sortOrder: 20, status: "published" },
  { slug: "ampcontrol", name: "Ampcontrol", website: "https://ampcontrolgroup.com/", sortOrder: 30, status: "published" },
  { slug: "audi", name: "Audi", website: "https://www.audi.com.au/en/", sortOrder: 40, status: "published" },
  { slug: "australian-made", name: "Australian Made", website: "https://australianmade.com.au/", sortOrder: 50, status: "published" },
  { slug: "auto-ux", name: "Auto-UX", website: "https://www.auto-ux.io/", sortOrder: 60, status: "published" },
  { slug: "aws", name: "AWS", website: "https://aws.amazon.com/", sortOrder: 70, status: "published" },
  { slug: "bac-systems", name: "BAC Systems", website: "https://www.bacsystems.com.au/", sortOrder: 80, status: "published" },
  { slug: "bilstein", name: "Bilstein", website: "https://bilstein.com/en/", sortOrder: 90, status: "published" },
  { slug: "bridgestone", name: "Bridgestone", website: "https://www.bridgestone.com/", sortOrder: 100, status: "published" },
  { slug: "calm-aluminium", name: "Calm Aluminium", website: "http://www.calm-aluminium.com.au/", sortOrder: 110, status: "published" },
  { slug: "competition-friction", name: "Competition Friction", website: "#", sortOrder: 120, status: "published" },
  { slug: "cupra", name: "CUPRA", website: "https://www.cupraofficial.com.au/", sortOrder: 130, status: "published" },
  { slug: "d2n", name: "D2N", website: "https://d2n.com.au/", sortOrder: 140, status: "published" },
  { slug: "dassault-systemes", name: "Dassault Systemes", website: "https://www.3ds.com/", sortOrder: 150, status: "published" },
  { slug: "eplan", name: "EPLAN", website: "https://www.eplan-software.com/", sortOrder: 160, status: "published" },
  { slug: "ericsson", name: "Ericsson", website: "https://www.ericsson.com/en", sortOrder: 170, status: "published" },
  { slug: "espresso-displays", name: "Espresso Displays", website: "https://au.espres.so/", sortOrder: 180, status: "published" },
  { slug: "finsbury-green", name: "Finsbury Green", website: "https://finsbury.com.au/", sortOrder: 190, status: "published" },
  { slug: "jaycar", name: "Jaycar", website: "https://www.jaycar.com.au/", sortOrder: 200, status: "published" },
  { slug: "leap-australia", name: "LEAP Australia", website: "https://www.leapaust.com.au/", sortOrder: 210, status: "published" },
  { slug: "master-instruments", name: "Master Instruments", website: "https://www.master-instruments.com.au/", sortOrder: 220, status: "published" },
  { slug: "mcconaghy", name: "McConaghy", website: "http://www.mcconaghyboats.com/", sortOrder: 230, status: "published" },
  { slug: "optus", name: "Optus", website: "https://www.optus.com.au/", sortOrder: 240, status: "published" },
  { slug: "p-one-technology", name: "P-ONE Technology", website: "https://www.p-onetechnology.com/", sortOrder: 250, status: "published" },
  { slug: "scott-bader", name: "Scott Bader", website: "https://www.scottbader.com/", sortOrder: 260, status: "published" },
  { slug: "siltrax", name: "Siltrax", website: "https://www.siltrax.net/", sortOrder: 270, status: "published" },
  { slug: "sorensen-engineering", name: "Sorensen Engineering", website: "https://www.sorensenengineering.com.au/", sortOrder: 280, status: "published" },
  { slug: "sundrive", name: "SunDrive", website: "https://www.sundrivesolar.com/", sortOrder: 290, status: "published" },
  { slug: "sxsw-sydney", name: "SXSW Sydney", website: "https://www.sxswsydney.com/", sortOrder: 300, status: "published" },
  { slug: "sydney-motorsport-park", name: "Sydney Motorsport Park", website: "https://www.sydneymotorsportpark.com.au/", sortOrder: 310, status: "published" },
  { slug: "total-tools", name: "Total Tools", website: "https://www.totaltools.com.au/", sortOrder: 320, status: "published" },
  { slug: "trace", name: "TRaCE", website: "https://trace.org.au/", sortOrder: 330, status: "published" },
  { slug: "unsw", name: "UNSW", website: "https://www.unsw.edu.au/", sortOrder: 340, status: "published" },
  { slug: "wrapstyle-sydney", name: "WrapStyle Sydney", website: "https://wrapstylesydney.com.au/", sortOrder: 350, status: "published" },
]

export const fallbackMediaAssets: MediaAsset[] = [
  {
    key: "public-media/placeholders/sr7-world-record.mp4",
    bucket: "website-v3-public-assets",
    contentType: "video/mp4",
    size: 75641586,
    scope: "public-media",
    status: "published",
    source: "/placeholders/sr7-world-record.mp4",
  },
  {
    key: "public-media/placeholders/bwsc-23-vid.mp4",
    bucket: "website-v3-public-assets",
    contentType: "video/mp4",
    size: 66585122,
    scope: "public-media",
    status: "published",
    source: "/placeholders/bwsc-23-vid.mp4",
  },
  {
    key: "public-media/vehicle-fleet/vehicle-ivy.jpg",
    bucket: "website-v3-public-assets",
    contentType: "image/jpeg",
    size: 10759552,
    scope: "public-media",
    status: "published",
    source: "/vehicle-fleet/vehicle-ivy.jpg",
  },
]

export const achievementsOverview =
  "Since 1996, Sunswift Racing has pushed the boundaries of what student-led innovation can achieve in sustainable transport. From breaking world records to placing on the global stage, each milestone reflects our passion for engineering, endurance, and impact."

// Descriptions below are ported verbatim from https://sunswift.webflow.io/about-us/achievements.
// Preserve the original wording, capitalisation, punctuation, and unit annotations.
export const achievements: Achievement[] = [
  {
    year: "2023",
    title: "Bridgestone World Solar Challenge '23",
    vehicle: "SR-7",
    description: "Sunswift 7 placed first overall in the cruiser class.",
    image: "/achievements/bwsc-23-win.avif",
    videoMp4: publicAssetPath("/placeholders/bwsc-23-vid.mp4"),
    kind: "race",
  },
  {
    year: "2022",
    title: "Optus Remote Driving Initiative",
    vehicle: "SR-7",
    description:
      "Sunswift partnered with Optus to showcase the capabilities of the Optus 5G network, with Audi driver Chaz Mostert driving Sunswift 7 remotely around the Adelaide Parklands circuit.",
    image: "/achievements/sr7-optus.avif",
    videoMp4: publicAssetPath("/placeholders/sr7-optus.mp4"),
    kind: "showcase",
  },
  {
    year: "2022",
    title: "Guinness World Record '22",
    vehicle: "SR-7",
    description:
      "Sunswift 7 achieved the fastest 1000 km achieved by an electric car on a single charge.",
    image: "/achievements/sr7-world-record.avif",
    videoMp4: publicAssetPath("/placeholders/sr7-world-record.mp4"),
    kind: "record",
  },
  {
    year: "2019",
    title: "Bridgestone World Solar Challenge '19",
    vehicle: "VIolet",
    description:
      "Sunswift placed 2nd overall in the Cruiser class, and finished first across the line in Adelaide.",
    image: "/achievements/bwsc-19.avif",
    kind: "race",
    videoMp4: "/placeholders/violet-bwsc-19.mp4",
  },
  {
    year: "2018",
    title: "Guinness World Record '18",
    vehicle: "VIolet",
    description:
      "Lowest Energy Consumption Driving Trans-Australia (Perth to Sydney) - Electric Car.",
    image: "/achievements/world-record-violet.avif",
    kind: "record",
  },
  {
    year: "2017",
    title: "Bridgestone World Solar Challenge '17",
    vehicle: "VIolet",
    description: "3rd in Practicality Judging of Cruiser Class in World Solar Challenge.",
    image: "/achievements/bwsc-17.avif",
    kind: "race",
  },
  {
    year: "2015",
    title: "Bridgestone World Solar Challenge '15",
    vehicle: "eVe",
    description: "Sunswift eVe finished 3rd across the line and 4th overall.",
    image: "/achievements/bwsc-15.avif",
    kind: "race",
  },
  {
    year: "2014",
    title: "FIA Land Speed Record",
    vehicle: "eVe",
    description:
      "Sunswift eVe breaks the record for the fastest electric car over 500 kilometres (310mi), with an average speed of 107 kilometres per hour (66mph). The previous record of 73 kilometres per hour (45mph) was set in 1988.",
    image: "/achievements/fia-land-record.avif",
    kind: "record",
  },
  {
    year: "2013",
    title: "Bridgestone World Solar Challenge '13",
    vehicle: "eVe",
    description:
      "Sunswift eVe Line Honours and 3rd overall in Cruiser Class, including a top speed of 128 kilometres per hour (80mph).",
    image: "/achievements/bwsc-13.avif",
    kind: "race",
  },
  {
    year: "2011",
    title: "World Solar Challenge '11",
    vehicle: "IVy",
    description: "Sunswift IVy finished 1st in the Production Challenge Class and 6th overall.",
    image: "/achievements/wsc-11.avif",
    kind: "race",
  },
  {
    year: "2011",
    title: "Guinness World Record '11",
    vehicle: "IVy",
    description: "Fastest Solar Powered Vehicle: 88.8 kilometres per hour (55.2mph).",
    image: "/achievements/ivy-world-record.avif",
    kind: "record",
  },
  {
    year: "2009",
    title: "World Solar Challenge '09",
    vehicle: "IVy",
    description:
      "Sunswift IV finished 1st in the Silicon Challenge Class and 4th overall at 3:08pm on 29 October.",
    image: "/achievements/wsc-09.avif",
    kind: "race",
  },
  {
    year: "2007",
    title: "Engineers Australia",
    vehicle: "SR-III",
    description:
      "Jaycar Sunswift III broke the world record for a solar car journey from Perth to Sydney. The team finished the journey in 5.5 days, breaking the previous record by 3 days.",
    image: "/achievements/engineers-australia.avif",
    kind: "record",
  },
  {
    year: "2007",
    title: "World Solar Challenge '07",
    vehicle: "SR-III",
    description:
      "Placed 4th in the Adventure Challenge. Placed 9th overall in the World Solar Challenge. Prestigious Freescale Technical Innovation Award (Most efficient).",
    image: "/achievements/wsc-07.avif",
    kind: "race",
  },
  {
    year: "2005",
    title: "World Solar Challenge '05",
    vehicle: "SR-III",
    description:
      "UNSW Sunswift III was the 9th car (and the first with silicon solar cells) to cross the line, arriving in 5 days.",
    image: "/achievements/wsc-05.avif",
    kind: "race",
  },
  {
    year: "2003",
    title: "SunRace '03",
    vehicle: "SR-II",
    description: "2nd Place.",
    image: "/achievements/sunrace-03.avif",
    kind: "race",
  },
  {
    year: "2002",
    title: "SunRace '02",
    vehicle: "SR-II",
    description: "2nd Place.",
    image: "/achievements/sunrace-02.avif",
    kind: "race",
  },
  {
    year: "2001",
    title: "World Solar Challenge '01",
    vehicle: "SR-II",
    description: "UNSW Sunswift II was the 11th car to cross the line.",
    image: "/achievements/wsc-01.avif",
    kind: "race",
  },
  {
    year: "1999",
    title: "Federal Government",
    vehicle: "SR-II",
    description:
      "NRMA Sunswift II participated in a trade exhibition in Taipei, on request from the Federal Government.",
    image: "/achievements/federal-govt.avif",
    kind: "showcase",
  },
  {
    year: "1999",
    title: "CitiPower SunRace '99",
    vehicle: "SR-II",
    description:
      "Three days after completing the Perth-Sydney record attempt the team entered the CitiPower SunRace. NRMA Sunswift II obtained third place in a highly competitive field of five entries, proving the car's reliability and the team's dedication after five continuous weeks on the road.",
    image: "/achievements/citipower-sunrace.avif",
    kind: "race",
  },
  {
    year: "1999",
    title: "Transcontinental Record Attempt '99",
    vehicle: "SR-II",
    description:
      "The car 'NRMA Sunswift II' completed 4,012 kilometres (2,493 mi) in ten days, despite five days of bad weather. Even though the record of 8½ days was not broken, the attempt was still regarded to be a success with $2.4 million worth of publicity generated.",
    image: "/achievements/transcontient-99.avif",
    kind: "record",
  },
  {
    year: "1999",
    title: "World Solar Challenge '99",
    vehicle: "SR-II",
    description:
      "NRMA Sunswift II finished a respectable 18th out of 48 international entries.",
    image: "/achievements/wsc-99.avif",
    kind: "race",
  },
  {
    year: "1996",
    title: "World Solar Challenge '96",
    vehicle: "SR-I",
    description:
      "Sunswift finished 9th out of 46 entries. This was the University's first entry in a solar car event amongst the prestigious and competitive entries from Honda Motors Corporation, the Swiss entry from Biel, and Mitsubishi Materials Corporation.",
    image: "/achievements/wsc-96.avif",
    kind: "archive",
  },
]

export const vehicles: Vehicle[] = [
  {
    slug: "sunswift-8",
    name: "SR-8",
    years: "2026",
    summary: "Tomorrow, Today.",
    image: "/vehicle-fleet/vehicle-sunswift-8.jpg",
    specs: {
      Class: "Sports Car",
      Status: "In production",
      Programme: "Coming to a track near you",
      Focus: "The future of sustainable mobility",
    },
    achievements: [
      "Under construction at UNSW Sydney",
      "Targeting the 2025 Bridgestone World Solar Challenge",
      "Eighth car in the Sunswift programme since 1996",
    ],
  },
  {
    slug: "sunswift-7",
    name: "SR-7",
    years: "2020-2025",
    summary: "World Champion.",
    overview:
      "SR-7 is Sunswift's seventh solar car and the team's most capable endurance platform to date. Developed through pandemic-era lockdowns and remote collaboration, it was unveiled in 2022 for the Cruiser Class with a lightweight carbon fibre chassis, four seats and a 4.4 m² solar array. Its efficiency led to a 1,000 km single-charge Guinness World Record and a 2023 Cruiser Class victory.",
    image: "/vehicle-fleet/vehicle-sunswift-7.jpeg",
    specs: {
      Class: "Cruiser",
      "Solar array": "4.4 m²",
      Weight: "680 kg",
      "Drag coefficient": "0.095",
      "Top speed": "130 km/h",
      "Maximum range": "1500 km",
      Battery: "38 kWh, 151.2 V Li-ion",
      Seats: "4",
    },
    achievements: [
      "Guinness World Record 2022 — fastest 1,000 km by an electric car on a single charge",
      "1st overall, Cruiser Class — Bridgestone World Solar Challenge 2023",
      "Optus Remote Driving Initiative with Audi driver Chaz Mostert",
    ],
  },
  {
    slug: "violet",
    name: "VIolet",
    years: "2015-2019",
    summary: "Sustainability at your doorstep.",
    overview:
      "VIolet was Sunswift's sixth vehicle and the second Cruiser Class car. Built as a practical four-door, four-seat solar vehicle, it added systems such as live monitoring, air conditioning, navigation, Wi-Fi, parking sensors and dual boot space. After competing in 2017, it crossed Australia from Perth in 2018 with record-low electric energy consumption, then returned upgraded for the 2019 World Solar Challenge.",
    image: "/vehicle-fleet/vehicle-violet.avif",
    specs: {
      Class: "Cruiser",
      "Solar array": "5.0 m², 22% efficiency",
      Weight: "700 kg",
      Seats: "4",
      "Top speed": "140 km/h",
      "Maximum range": "1000 km @ 100 km/h",
      Battery: "10–20 kWh Li-ion",
    },
    achievements: [
      "Guinness World Record 2018 — lowest energy consumption, Perth to Sydney by an electric car",
      "3rd in Practicality Judging — Cruiser Class, Bridgestone World Solar Challenge 2017",
      "2nd overall and first across the line in Adelaide — Bridgestone World Solar Challenge 2019",
    ],
  },
  {
    slug: "eve",
    name: "eVe",
    years: "2012-2015",
    summary: "Pushing the limits of technology.",
    overview:
      "eVe was designed and built in 18 months for the 2013 World Solar Challenge's then-new Cruiser Class, where practicality, passenger space, safety and battery efficiency mattered alongside speed. It could travel hundreds of kilometres from its battery and further under solar power. In 2014, eVe set an FIA record for the fastest electric vehicle over 500 km on a single charge.",
    image: "/vehicle-fleet/vehicle-eve.jpg",
    specs: {
      Class: "Cruiser",
      "Solar array": "4.0 m², >23% efficiency",
      Weight: "430 kg",
      Seats: "2",
      "Top speed": "132 km/h",
      Battery: "16 kWh",
    },
    achievements: [
      "FIA Land Speed Record 2014 — fastest electric car over 500 km, averaging 107 km/h",
      "Line honours and 3rd overall in Cruiser Class — World Solar Challenge 2013",
      "3rd across the line and 4th overall — World Solar Challenge 2015",
    ],
  },
  {
    slug: "ivy",
    name: "IVy",
    years: "2009-2011",
    summary: "A Guinness World Record holder.",
    overview:
      "IVy was built for the 2009 World Solar Challenge as a Challenger Class solar car and became the first silicon-powered car across the line while finishing fourth overall. The project took about 18 months to complete. In 2011, with the battery removed and running solely on sunlight, IVy broke the Guinness World Record for the fastest solar-powered vehicle before returning to finish first in the Production Challenge Class.",
    image: publicAssetPath("/vehicle-fleet/vehicle-ivy.jpg"),
    specs: {
      Class: "Challenger",
      "Solar array": "5.99 m²",
      Weight: "165 kg",
      "Top speed": "110 km/h",
      Battery: "4.85 kWh, 89.1–138.6 V",
    },
    achievements: [
      "Guinness World Record 2011 — fastest solar-powered vehicle at 88.8 km/h",
      "1st in Silicon Challenge Class, 4th overall — World Solar Challenge 2009",
      "1st in Production Challenge Class, 6th overall — World Solar Challenge 2011",
    ],
  },
  {
    slug: "sunswift-iii",
    name: "SR-III",
    years: "2005-2008",
    summary: "Perth to Sydney in 5½ days.",
    overview:
      "SR-III was designed for the 2005 World Solar Challenge. After early mechanical issues, the team improved the car and used it to set a Perth-to-Sydney solar journey record in 2007, completing the crossing in five and a half days. It later placed ninth overall in the World Solar Challenge and received a technical innovation award.",
    image: "/vehicle-fleet/vehicle-iii.jpg",
    specs: {
      "Solar array": "11.5 m², 20% efficiency",
      Weight: "220 kg",
      "Top speed": "120 km/h",
      Battery: "2.5 kWh",
      Chassis: "Carbon fibre monocoque",
    },
    achievements: [
      "World transcontinental record — Perth to Sydney in 5.5 days",
      "9th overall and Freescale Technical Innovation Award — World Solar Challenge 2007",
      "Engineers Australia Engineering Excellence Award, 2007",
    ],
  },
  {
    slug: "sunswift-ii",
    name: "SR-II",
    years: "1998-2005",
    summary: "Redefining sustainable transport.",
    overview:
      "SR-II evolved through four versions between 1997 and 2003. The team developed its own buried-contact solar cells through the TopCell project, making Sunswift the only team to manufacture its own solar cells and contributing to a world-record efficiency result. Its remaining PERL cells were made at UNSW, and the team pioneered curved solar panel encapsulation for the car.",
    image: "/vehicle-fleet/vehicle-ii.jpg",
    specs: {
      "Solar array": "8 m², 19.5% efficiency",
      Weight: "180 kg",
      "Top speed": "120 km/h",
      Battery: "3 kWh Li-ion (102 cells)",
      Motors: "UNSW/CSIRO 3 kW wheel motor",
    },
    achievements: [
      "First team to manufacture its own solar cells — TopCell project, 2000–2001",
      "World record efficiency for buried-contact cells",
      "18th of 48 international entries — World Solar Challenge 1999",
    ],
  },
  {
    slug: "sunswift-i",
    name: "SR-I",
    years: "1996-1998",
    summary: "Hello, world.",
    overview:
      "SR-I began as the Aurora Q1 vehicle purchased from the Aurora Vehicle Association in 1996. The UNSW Solar Racing Team upgraded it with a new motor, controller, roll cage, chassis and batteries before racing it in the 1996 World Solar Challenge. Its ninth-place finish established Sunswift's foundation and directly inspired the development of SR-II.",
    image: "/vehicle-fleet/vehicle-i.jpg",
    specs: {
      "Solar array": "7.88 m², 1923 PERL cells, 18.5%",
      Weight: "255 kg",
      "Top speed": "63 km/h",
      Battery: "3 kWh Pb/acid",
      Origin: "Built on the Aurora Q1 chassis",
    },
    achievements: [
      "9th of 46 entries — World Solar Challenge 1996",
      "UNSW's first solar car entry, founding the Sunswift program",
    ],
  },
]
