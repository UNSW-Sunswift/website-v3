import type { RecruitmentRole, TeamMember, Vehicle } from "@/lib/cms/types"

export type Achievement = {
  year: string
  title: string
  vehicle: string
  description: string
  image: string
  kind: "race" | "record" | "showcase" | "archive"
}

export const fallbackTeamMembers: TeamMember[] = [
  {
    slug: "alex-rivera",
    name: "Alex Rivera",
    role: "Mechanical Lead",
    discipline: "Engineering",
    bio: "Placeholder team member seeded for local CMS development.",
    imageKey: "",
    status: "published",
  },
  {
    slug: "maya-chen",
    name: "Maya Chen",
    role: "Race Operations",
    discipline: "Operations",
    bio: "Placeholder member profile for the redesigned Sunswift team page.",
    imageKey: "",
    status: "published",
  },
  {
    slug: "sam-taylor",
    name: "Sam Taylor",
    role: "Media Coordinator",
    discipline: "Business",
    bio: "Placeholder member profile for content, partnerships and media.",
    imageKey: "",
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
    status: "published",
  },
  {
    slug: "embedded-systems-engineer",
    title: "Embedded Systems Engineer",
    team: "Engineering",
    description:
      "Build and maintain the embedded systems that connect telemetry, controls and race operations.",
    status: "published",
  },
  {
    slug: "partnerships-associate",
    title: "Partnerships Associate",
    team: "Business",
    description:
      "Support partner relationships, sponsorship proposals and the storytelling that powers student-led engineering.",
    status: "published",
  },
]

export const achievementsOverview =
  "Since 1996, Sunswift Racing has pushed the boundaries of what student-led innovation can achieve in sustainable transport. From breaking world records to placing on the global stage, each milestone reflects our passion for engineering, endurance, and impact."

export const achievements: Achievement[] = [
  {
    year: "2023",
    title: "Bridgestone World Solar Challenge '23",
    vehicle: "SR-7",
    description: "Sunswift 7 placed first overall in the Cruiser Class.",
    image: "/placeholders/vehicle-sunswift-7.svg",
    kind: "race",
  },
  {
    year: "2022",
    title: "Optus Remote Driving Initiative",
    vehicle: "SR-7",
    description:
      "Sunswift partnered with Optus to showcase the capabilities of the Optus 5G network, with Audi driver Chaz Mostert driving Sunswift 7 remotely around the Adelaide Parklands circuit.",
    image: "/placeholders/vehicle-sunswift-7.svg",
    kind: "showcase",
  },
  {
    year: "2022",
    title: "Guinness World Record '22",
    vehicle: "SR-7",
    description:
      "Sunswift 7 achieved the fastest 1,000 km by an electric car on a single charge.",
    image: "/placeholders/vehicle-sunswift-7.svg",
    kind: "record",
  },
  {
    year: "2019",
    title: "Bridgestone World Solar Challenge '19",
    vehicle: "VIolet",
    description:
      "Sunswift placed 2nd overall in the Cruiser Class and finished first across the line in Adelaide.",
    image: "/placeholders/vehicle-violet.svg",
    kind: "race",
  },
  {
    year: "2018",
    title: "Guinness World Record '18",
    vehicle: "VIolet",
    description:
      "Lowest energy consumption driving Trans-Australia from Perth to Sydney by an electric car.",
    image: "/placeholders/vehicle-violet.svg",
    kind: "record",
  },
  {
    year: "2017",
    title: "Bridgestone World Solar Challenge '17",
    vehicle: "VIolet",
    description: "3rd in Practicality Judging of the Cruiser Class at the World Solar Challenge.",
    image: "/placeholders/vehicle-violet.svg",
    kind: "race",
  },
  {
    year: "2015",
    title: "Bridgestone World Solar Challenge '15",
    vehicle: "eVe",
    description: "Sunswift eVe finished 3rd across the line and 4th overall.",
    image: "/placeholders/vehicle-eve.svg",
    kind: "race",
  },
  {
    year: "2014",
    title: "FIA Land Speed Record",
    vehicle: "eVe",
    description:
      "Sunswift eVe broke the record for the fastest electric car over 500 km, averaging 107 km/h.",
    image: "/placeholders/vehicle-eve.svg",
    kind: "record",
  },
  {
    year: "2013",
    title: "Bridgestone World Solar Challenge '13",
    vehicle: "eVe",
    description:
      "Sunswift eVe took line honours and 3rd overall in the Cruiser Class, including a top speed of 128 km/h.",
    image: "/placeholders/vehicle-eve.svg",
    kind: "race",
  },
  {
    year: "2011",
    title: "World Solar Challenge '11",
    vehicle: "IVy",
    description: "Sunswift IVy finished 1st in the Production Challenge Class and 6th overall.",
    image: "/placeholders/vehicle-ivy.svg",
    kind: "race",
  },
  {
    year: "2011",
    title: "Guinness World Record '11",
    vehicle: "IVy",
    description: "Fastest solar-powered vehicle: 88.8 km/h.",
    image: "/placeholders/vehicle-ivy.svg",
    kind: "record",
  },
  {
    year: "2009",
    title: "World Solar Challenge '09",
    vehicle: "IVy",
    description:
      "Sunswift IV finished 1st in the Silicon Challenge Class and 4th overall.",
    image: "/placeholders/vehicle-ivy.svg",
    kind: "race",
  },
  {
    year: "2007",
    title: "Engineers Australia",
    vehicle: "SR-III",
    description:
      "Jaycar Sunswift III broke the world record for a solar car journey from Perth to Sydney, finishing in 5.5 days and breaking the previous record by 3 days.",
    image: "/placeholders/vehicle-iii.svg",
    kind: "record",
  },
  {
    year: "2007",
    title: "World Solar Challenge '07",
    vehicle: "SR-III",
    description:
      "Placed 4th in the Adventure Challenge, 9th overall, and won the Freescale Technical Innovation Award.",
    image: "/placeholders/vehicle-iii.svg",
    kind: "race",
  },
  {
    year: "2005",
    title: "World Solar Challenge '05",
    vehicle: "SR-III",
    description:
      "UNSW Sunswift III was the 9th car, and the first with silicon solar cells, to cross the line.",
    image: "/placeholders/vehicle-iii.svg",
    kind: "race",
  },
  {
    year: "2003",
    title: "SunRace '03",
    vehicle: "SR-II",
    description: "2nd place.",
    image: "/placeholders/vehicle-ii.svg",
    kind: "race",
  },
  {
    year: "2002",
    title: "SunRace '02",
    vehicle: "SR-II",
    description: "2nd place.",
    image: "/placeholders/vehicle-ii.svg",
    kind: "race",
  },
  {
    year: "2001",
    title: "World Solar Challenge '01",
    vehicle: "SR-II",
    description: "UNSW Sunswift II was the 11th car to cross the line.",
    image: "/placeholders/vehicle-ii.svg",
    kind: "race",
  },
  {
    year: "1999",
    title: "CitiPower SunRace '99",
    vehicle: "SR-II",
    description:
      "Three days after completing the Perth-Sydney record attempt, NRMA Sunswift II entered the CitiPower SunRace and obtained third place.",
    image: "/placeholders/vehicle-ii.svg",
    kind: "race",
  },
  {
    year: "1999",
    title: "Transcontinental Record Attempt '99",
    vehicle: "SR-II",
    description:
      "NRMA Sunswift II completed 4,012 km in ten days despite five days of bad weather, generating $2.4 million worth of publicity.",
    image: "/placeholders/vehicle-ii.svg",
    kind: "record",
  },
  {
    year: "1999",
    title: "World Solar Challenge '99",
    vehicle: "SR-II",
    description: "NRMA Sunswift II finished 18th out of 48 international entries.",
    image: "/placeholders/vehicle-ii.svg",
    kind: "race",
  },
  {
    year: "1996",
    title: "World Solar Challenge '96",
    vehicle: "SR-I",
    description:
      "Sunswift finished 9th out of 46 entries, marking UNSW's first entry in a solar car event.",
    image: "/placeholders/vehicle-i.svg",
    kind: "archive",
  },
]

export const vehicles: Vehicle[] = [
  {
    slug: "sunswift-8",
    name: "SR-8",
    years: "2026",
    summary: "Tomorrow, Today.",
    image: "/placeholders/vehicle-sunswift-8.svg",
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
    relatedPosts: ["Behind the build"],
  },
  {
    slug: "sunswift-7",
    name: "SR-7",
    years: "2020-Current",
    summary: "World Champion.",
    image: "/placeholders/vehicle-sunswift-7.svg",
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
    relatedPosts: ["Sunswift 7's Journey to a World Record"],
  },
  {
    slug: "violet",
    name: "VIolet",
    years: "2015-2019",
    summary: "Sustainability at your doorstep.",
    image: "/placeholders/vehicle-violet.svg",
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
    relatedPosts: ["Team Highlights"],
  },
  {
    slug: "eve",
    name: "eVe",
    years: "2012-2015",
    summary: "Pushing the limits of technology.",
    image: "/placeholders/vehicle-eve.svg",
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
    relatedPosts: ["Partnership Spotlights"],
  },
  {
    slug: "ivy",
    name: "IVy",
    years: "2009-2011",
    summary: "A Guinness World Record holder.",
    image: "/placeholders/vehicle-ivy.svg",
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
    relatedPosts: ["Engineering Wins"],
  },
  {
    slug: "sunswift-iii",
    name: "SR-III",
    years: "2005-2008",
    summary: "Perth to Sydney in 5½ days.",
    image: "/placeholders/vehicle-iii.svg",
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
    relatedPosts: ["Archive"],
  },
  {
    slug: "sunswift-ii",
    name: "SR-II",
    years: "1998-2005",
    summary: "Redefining sustainable transport.",
    image: "/placeholders/vehicle-ii.svg",
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
    relatedPosts: ["Archive"],
  },
  {
    slug: "sunswift-i",
    name: "SR-I",
    years: "1996-1998",
    summary: "Hello, world.",
    image: "/placeholders/vehicle-i.svg",
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
    relatedPosts: ["Archive"],
  },
]
