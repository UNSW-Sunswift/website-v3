import type { RecruitmentRole, TeamMember, Vehicle } from "@/lib/cms/types"

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

export const vehicles: Vehicle[] = [
  {
    slug: "sunswift-7",
    name: "Sunswift 7",
    years: "2020-Current",
    summary:
      "The current generation cruiser, built for endurance, efficiency and world-record pace.",
    image: "/placeholders/vehicle-sunswift-7.svg",
    specs: {
      Class: "Cruiser",
      "Solar array": "4.4 m²",
      Weight: "680 kg",
      "Drag coefficient": "0.095",
    },
    achievements: [
      "Fastest 1000 km by an electric car on a single charge",
      "First overall in the Cruiser Class at the 2023 World Solar Challenge",
    ],
    relatedPosts: ["Sunswift 7's Journey to a World Record"],
  },
  {
    slug: "violet",
    name: "Sunswift VIolet",
    years: "2015-2019",
    summary:
      "A road-registered solar car that moved Sunswift closer to everyday sustainable transport.",
    image: "/placeholders/vehicle-violet.svg",
    specs: {
      Class: "Cruiser",
      Focus: "Road registration",
      Legacy: "Practical solar mobility",
    },
    achievements: ["Connected the race program to road-ready design constraints"],
    relatedPosts: ["Team Highlights"],
  },
  {
    slug: "eve",
    name: "Sunswift eVe",
    years: "2012-2015",
    summary:
      "A student-built solar sports car that helped define the team’s modern performance identity.",
    image: "/placeholders/vehicle-eve.svg",
    specs: {
      Class: "Cruiser",
      Focus: "Solar sports car",
      Legacy: "Performance-led design",
    },
    achievements: ["Expanded the team’s ambition beyond prototype competition vehicles"],
    relatedPosts: ["Partnership Spotlights"],
  },
]
