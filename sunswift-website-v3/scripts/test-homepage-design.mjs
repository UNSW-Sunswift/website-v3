import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"

const root = process.cwd()
const page = readFileSync(join(root, "app/page.tsx"), "utf8")
const hero = readFileSync(
  join(root, "components/site/homepage-hero.tsx"),
  "utf8"
)
const navbar = readFileSync(
  join(root, "components/site/transparent-navbar.tsx"),
  "utf8"
)
const about = readFileSync(
  join(root, "components/site/homepage-about.tsx"),
  "utf8"
)
const records = readFileSync(
  join(root, "components/site/homepage-records.tsx"),
  "utf8"
)
const recruitmentCta = readFileSync(
  join(root, "components/site/homepage-recruitment.tsx"),
  "utf8"
)
const zoomReveal = readFileSync(
  join(root, "components/site/homepage-zoom-reveal.tsx"),
  "utf8"
)
const vehiclesPage = readFileSync(
  join(root, "app/(public)/vehicles/page.tsx"),
  "utf8"
)
const recruitmentPage = readFileSync(
  join(root, "app/(public)/recruitment/page.tsx"),
  "utf8"
)
const availableRolesPage = readFileSync(
  join(root, "app/(public)/recruitment/available-roles/page.tsx"),
  "utf8"
)
const roleStreamPage = readFileSync(
  join(root, "app/(public)/recruitment/available-roles/[stream]/page.tsx"),
  "utf8"
)
const partnersPage = readFileSync(
  join(root, "app/(public)/partners/page.tsx"),
  "utf8"
)
const partnersPageContent = readFileSync(
  join(root, "components/site/partners-page.tsx"),
  "utf8"
)
const teamPage = readFileSync(join(root, "app/(public)/team/page.tsx"), "utf8")
const teamRoster = readFileSync(
  join(root, "components/site/team-roster.tsx"),
  "utf8"
)
const vehiclesGallery = readFileSync(
  join(root, "components/site/vehicles-gallery.tsx"),
  "utf8"
)
const achievementsPage = readFileSync(
  join(root, "app/(public)/achievements/page.tsx"),
  "utf8"
)
const achievementsTimeline = readFileSync(
  join(root, "components/site/achievements-timeline.tsx"),
  "utf8"
)
const whoWeArePage = readFileSync(
  join(root, "app/(public)/who-we-are/page.tsx"),
  "utf8"
)
const ourStoryPage = readFileSync(
  join(root, "app/(public)/our-story/page.tsx"),
  "utf8"
)
const aboutEditorialPages = readFileSync(
  join(root, "components/site/about-editorial-pages.tsx"),
  "utf8"
)
const siteShell = readFileSync(
  join(root, "components/site/site-shell.tsx"),
  "utf8"
)
const themeProvider = readFileSync(
  join(root, "components/theme-provider.tsx"),
  "utf8"
)
const globalsCss = readFileSync(join(root, "app/globals.css"), "utf8")
const staticData = readFileSync(join(root, "lib/cms/static-data.ts"), "utf8")
const aboutPages = readFileSync(join(root, "content/about-pages.json"), "utf8")
const recruitmentContent = readFileSync(
  join(root, "components/site/recruitment-content.ts"),
  "utf8"
)

const failures = []

function assert(condition, message) {
  if (!condition) {
    failures.push(message)
  }
}

assert(
  !existsSync(join(root, "components/site/opal-homepage-hero.tsx")),
  "Legacy opal-homepage-hero.tsx must not exist; rename to homepage-hero.tsx."
)

const opalReferences = [
  page,
  hero,
  navbar,
  about,
  records,
  recruitmentCta,
  zoomReveal,
].some((source) => /opal/i.test(source))
assert(!opalReferences, "Homepage source files must not mention Opal.")

assert(
  page.includes("<HomepageHero />"),
  "Homepage must render the dedicated homepage hero component."
)
assert(
  page.includes("<TransparentNavbar />"),
  "Homepage must render the transparent navbar component."
)
assert(
  !page.includes("<HomepageStatement"),
  "Homepage must no longer render the removed HomepageStatement section."
)
assert(
  page.includes("<HomepageZoomReveal />"),
  "Homepage must render the zoom-reveal scroll section."
)
assert(
  page.includes("<HomepageAbout />"),
  "Homepage must render the about section component."
)
assert(
  page.includes("<HomepageRecords />"),
  "Homepage must render the Guinness records section component."
)
assert(
  page.includes("<HomepageRecruitment roles={roles} />"),
  "Homepage must render the bottom recruitment CTA section with CMS roles."
)
assert(
  page.includes("getRecruitmentRoles"),
  "Homepage must source recruitment cards from the CMS/database helper."
)
assert(
  page.includes('getRecruitmentRoles("published")'),
  "Homepage recruitment section must use published recruitment roles."
)
assert(
  /export const dynamic = "force-dynamic"/.test(page),
  "Homepage must stay dynamic while recruitment roles are CMS-backed."
)

assert(
  !existsSync(join(root, "components/site/homepage-statement.tsx")),
  "components/site/homepage-statement.tsx must be deleted; the zoom-reveal supersedes it."
)

const heroIdx = page.indexOf("<HomepageHero")
const zoomIdx = page.indexOf("<HomepageZoomReveal")
const aboutIdx = page.indexOf("<HomepageAbout")
const recordsIdx = page.indexOf("<HomepageRecords")
const recruitmentIdx = page.indexOf("<HomepageRecruitment")
assert(
  heroIdx < zoomIdx &&
    zoomIdx < aboutIdx &&
    aboutIdx < recordsIdx &&
    recordsIdx < recruitmentIdx,
  "Page order must be Hero -> ZoomReveal -> About -> Records -> Recruitment."
)

assert(
  zoomReveal.includes("data-homepage-zoom-reveal"),
  "Zoom-reveal section must expose data-homepage-zoom-reveal for verification."
)
assert(
  zoomReveal.includes("data-homepage-zoom-text"),
  "Zoom-reveal section must expose data-homepage-zoom-text on the headline."
)
assert(
  zoomReveal.includes("data-homepage-vehicle-render"),
  "Zoom-reveal section must expose data-homepage-vehicle-render as the live-render placeholder slot."
)
assert(
  zoomReveal.includes("Built by Students."),
  "Zoom-reveal headline must include 'Built by Students.'."
)
assert(
  zoomReveal.includes("Driving Sustainability."),
  "Zoom-reveal headline must include 'Driving Sustainability.'."
)
assert(
  zoomReveal.includes("useEffect"),
  "Zoom-reveal section must be scroll-reactive via useEffect."
)
assert(
  /window\.addEventListener\("scroll"/.test(zoomReveal),
  "Zoom-reveal section must listen to scroll events to drive the focus reveal."
)
assert(
  !/--zoom-scale/.test(zoomReveal),
  "Zoom-reveal headline must not use --zoom-scale; this section should no longer zoom in."
)
assert(
  /--zoom-blur/.test(zoomReveal),
  "Zoom-reveal section must drive a --zoom-blur custom property for the focus effect."
)
assert(
  /--zoom-text-y/.test(zoomReveal),
  "Zoom-reveal section must drive a --zoom-text-y custom property for the glide effect."
)
assert(
  /--zoom-sweep-x/.test(zoomReveal),
  "Zoom-reveal section must drive a --zoom-sweep-x custom property for the light sweep."
)
assert(
  /--zoom-opacity/.test(zoomReveal),
  "Zoom-reveal section must drive a --zoom-opacity custom property."
)
assert(
  /--zoom-text-color/.test(zoomReveal),
  "Zoom-reveal section must drive a --zoom-text-color custom property so the headline darkens on scroll."
)
assert(
  /rgb\(\$\{channel\},\s*\$\{channel\},\s*\$\{channel\}\)/.test(zoomReveal),
  "Zoom-reveal must interpolate the headline tone from a gray channel to black on scroll."
)
assert(
  /homepage-zoom-sweep/.test(zoomReveal),
  "Zoom-reveal section must render the moving light sweep overlay."
)
assert(
  /font-thin/.test(zoomReveal),
  "Zoom-reveal headline must use font-thin (Inter 100)."
)
assert(
  /h-\[180svh\]/.test(zoomReveal),
  "Zoom-reveal section must reserve tall scroll distance (~180svh) to drive the animation."
)
assert(
  /sticky\s+top-0/.test(zoomReveal),
  "Zoom-reveal section must use a sticky inner stage."
)
assert(
  /bg-\[#f6f5f1\]|bg-white/.test(zoomReveal),
  "Zoom-reveal section must use a light canvas so the headline can darken from gray to black."
)
assert(
  !/bg-black/.test(zoomReveal),
  "Zoom-reveal section must not use a black canvas; the tone shift requires a light background."
)
assert(
  !/text-shadow:[^;]*rgba\(0,\s*0,\s*0,\s*0\.5/.test(zoomReveal),
  "Zoom-reveal headline must not carry a heavy dark text-shadow on the light canvas."
)

assert(
  /\.homepage-zoom-text\s*{/.test(globalsCss),
  "globals.css must style the .homepage-zoom-text helper."
)
assert(
  /\.homepage-zoom-render\s*{/.test(globalsCss),
  "globals.css must style the .homepage-zoom-render helper."
)
assert(
  /\.homepage-zoom-sweep\s*{/.test(globalsCss),
  "globals.css must style the .homepage-zoom-sweep helper."
)
assert(
  !/transform:\s*scale\(var\(--zoom-scale\)\)/.test(globalsCss),
  ".homepage-zoom-text must not scale with --zoom-scale."
)
assert(
  /transform:\s*translate3d\(0,\s*var\(--zoom-text-y\),\s*0\)/.test(globalsCss),
  ".homepage-zoom-text must glide via --zoom-text-y instead of scaling."
)
assert(
  /filter:\s*blur\(var\(--zoom-blur\)\)/.test(globalsCss),
  ".homepage-zoom-text must read --zoom-blur for the focus effect."
)
assert(
  /color:\s*var\(--zoom-text-color\)/.test(globalsCss),
  ".homepage-zoom-text must read the --zoom-text-color custom property for its colour."
)
assert(
  /opacity:\s*var\(--zoom-render-opacity\)/.test(globalsCss),
  ".homepage-zoom-render must read the --zoom-render-opacity custom property so the render fades in on scroll."
)

assert(
  hero.includes("data-homepage-hero"),
  "Hero must expose data-homepage-hero for browser verification."
)
assert(
  hero.includes('"Tomorrow, Today."'),
  "Hero must use the slogan 'Tomorrow, Today.' with the trailing period."
)
assert(
  hero.includes("useEffect"),
  "Hero must include scroll-reactive behavior."
)
assert(
  /setInterval|setTimeout/.test(hero),
  "Hero must drive the typing animation with a timer."
)
assert(
  hero.includes("data-full-text"),
  "Hero must expose data-full-text for the typing animation."
)
assert(
  hero.includes("homepage-hero-caret"),
  "Hero must render the typewriter caret element."
)
assert(
  /sr-only/.test(hero),
  "Hero must keep an accessible copy of the slogan for screen readers."
)
assert(
  !hero.includes("@/components/ui"),
  "Hero must not import shadcn UI components."
)

assert(
  navbar.includes("data-homepage-navbar"),
  "Navbar must expose data-homepage-navbar for verification."
)
assert(/bg-transparent/.test(navbar), "Navbar must be transparent.")
for (const label of [
  "About Us",
  "Our Team",
  "Vehicles",
  "Partners",
  "Media",
  "Recruitment",
  "Contact",
]) {
  assert(navbar.includes(label), `Navbar must include the ${label} link.`)
}
assert(
  /data-about-dropdown/.test(navbar),
  "Transparent navbar must expose the About Us dropdown."
)
assert(
  /<button[^]*About Us[^]*ChevronDown/.test(navbar),
  "Transparent navbar About Us item must be a dropdown button with a chevron arrow."
)
assert(
  navbar.includes("Who We Are"),
  "Transparent navbar About Us dropdown must include Who We Are."
)
assert(
  navbar.includes("/who-we-are"),
  "Transparent navbar Who We Are dropdown item must link to /who-we-are."
)
assert(
  navbar.includes("Achievements"),
  "Transparent navbar About Us dropdown must include Achievements."
)
assert(
  navbar.includes("/achievements"),
  "Transparent navbar Achievements dropdown item must link to /achievements."
)
assert(
  navbar.includes("Our Story"),
  "Transparent navbar About Us dropdown must include Our Story."
)
assert(
  navbar.includes("/our-story"),
  "Transparent navbar Our Story dropdown item must link to /our-story."
)
assert(
  /ArrowUpRight/.test(navbar),
  "Transparent navbar dropdown must use directional link arrows instead of plain menu rows."
)
assert(
  /backdrop-blur-2xl/.test(navbar),
  "Transparent navbar dropdown must use a deeper glass treatment."
)
assert(
  /data-recruitment-dropdown/.test(navbar),
  "Transparent navbar must expose the Recruitment dropdown."
)
assert(
  /<button[^]*Recruitment[^]*ChevronDown/.test(navbar),
  "Transparent navbar Recruitment item must be a dropdown button with a chevron arrow."
)
assert(
  navbar.includes("Recruitment Hub"),
  "Transparent navbar Recruitment dropdown must include Recruitment Hub."
)
assert(
  !navbar.includes("Available Roles"),
  "Transparent navbar Recruitment dropdown must not include the superseded Available Roles item."
)
assert(
  navbar.includes("recruitmentStreams.map") &&
    navbar.includes("stream.roleTitle"),
  "Transparent navbar Recruitment dropdown must include all stream role pages."
)
assert(
  /data-mobile-nav/.test(navbar) && /Menu/.test(navbar),
  "Transparent navbar must expose a mobile menu instead of hiding navigation on phone widths."
)
assert(
  /lg:hidden/.test(navbar) && /calc\(100vw-2rem\)/.test(navbar),
  "Transparent navbar mobile menu must be phone-width constrained and visible below desktop."
)

assert(
  whoWeArePage.includes("<WhoWeAreEditorialPage />"),
  "Who We Are route must render the new editorial page."
)
assert(
  ourStoryPage.includes("<OurStoryEditorialPage />"),
  "Our Story route must render the new editorial page."
)
assert(
  /data-about-page="who-we-are"/.test(aboutEditorialPages),
  "Who We Are editorial page must expose data-about-page."
)
assert(
  /data-about-page="our-story"/.test(aboutEditorialPages),
  "Our Story editorial page must expose data-about-page."
)
assert(
  /TransparentNavbar/.test(aboutEditorialPages),
  "About editorial pages must use the transparent navbar like the homepage/achievements/vehicles pages."
)
assert(
  /PlaceholderImage/.test(aboutEditorialPages),
  "About editorial pages must include placeholder image slots."
)
assert(
  /sticky top-0/.test(aboutEditorialPages),
  "Our Story page must include sticky section navigation."
)
for (const phrase of [
  "Sunswift Racing has been redefining the future of automotive technology since 1996.",
  "Led by Team Principal Professor Richard Hopkins",
  "The development of a car from scratch is only possible through the support of a wide network",
  "What started as a wild thesis idea at the uni bar launched a legacy of solar racing.",
  "Born from a cancelled race and a bold phone call",
  "Crashing in testing, finishing a race unofficially",
  "Faced with shutdown, one student rebuilt the team from scratch",
]) {
  assert(
    aboutPages.includes(phrase),
    `About pages content must include verbatim Webflow phrase: ${phrase}`
  )
}

const aboutFlat = about.replace(/\s+/g, " ")
assert(
  about.includes("data-homepage-about"),
  "About section must expose data-homepage-about for verification."
)
assert(
  aboutFlat.includes("What is Sunswift Racing?"),
  "About section must include the Sunswift headline."
)
assert(
  aboutFlat.includes("World Solar Challenge"),
  "About section must include the World Solar Challenge copy."
)
assert(
  aboutFlat.includes("Sydney, Australia since 1996"),
  "About section must include the Sydney since 1996 copy."
)
assert(
  aboutFlat.includes("Guinness World Records"),
  "About section must include the Guinness World Records copy."
)

const recordsFlat = records.replace(/\s+/g, " ")
assert(
  records.includes("data-homepage-records"),
  "Records section must expose data-homepage-records for verification."
)
assert(
  records.includes("data-homepage-record"),
  "Records section must mark each record card with data-homepage-record."
)
assert(
  records.includes('"use client"') &&
    records.includes("data-homepage-records-transition") &&
    records.includes("data-homepage-records-carousel") &&
    records.includes("--records-carousel-y") &&
    records.includes("--records-dark-opacity") &&
    records.includes("--records-handoff-opacity") &&
    records.includes("--records-content-opacity") &&
    records.includes("--records-text-color") &&
    records.includes("--records-muted-color"),
  "Records section must be one client-side sticky section that cycles achievements and hands off into recruitment."
)
assert(
  records.includes("Moving records forward."),
  "Records transition must include the Moving records forward handoff headline."
)
assert(
  records.includes("data-homepage-records-handoff"),
  "Records section must expose the final handoff into Embrace Tomorrow."
)
assert(
  !records.includes("Embrace tomorrow."),
  "Records handoff must not duplicate the Embrace Tomorrow headline before the recruitment section."
)
assert(
  !/font-mono[^"]*"\s*>\s*Guinness World Records/.test(records),
  "Records section must not display a 'Guinness World Records' kicker label."
)
assert(
  recordsFlat.includes("Moving records forward"),
  "Records section must include the headline."
)
assert(
  recordsFlat.includes("1,000"),
  "Records section must surface the 1,000 km distance record."
)
assert(
  recordsFlat.includes("single charge"),
  "Records section must describe the single-charge distance record."
)
for (const recordId of ["thousand-km", "speed-record", "world-firsts"]) {
  assert(
    records.includes(recordId),
    `Records section must include the ${recordId} record entry.`
  )
}

const recruitmentFlat = recruitmentCta.replace(/\s+/g, " ")
assert(
  recruitmentCta.includes("data-homepage-recruitment"),
  "Recruitment CTA section must expose data-homepage-recruitment."
)
assert(
  recruitmentCta.includes('data-recruitment-source="cms"'),
  "Recruitment CTA section must declare that cards are CMS/database sourced."
)
assert(
  recruitmentFlat.includes("Embrace Tomorrow"),
  "Recruitment CTA section must include the Embrace Tomorrow headline."
)
assert(
  recruitmentCta.includes("data-homepage-recruitment-gradient") &&
    recruitmentCta.includes("homepage-recruitment-background-core"),
  "Recruitment CTA section must keep the animated gradient in the background, not through the headline text."
)
assert(
  globalsCss.includes("@keyframes homepage-recruitment-background"),
  "globals.css must define the animated Embrace Tomorrow background gradient."
)
assert(
  globalsCss.includes("translate3d(-7%, 3%, 0)") &&
    globalsCss.includes("translate3d(8%, -5%, 0)"),
  "Embrace Tomorrow background gradient must drift around, not only blur in place."
)

// Records → recruitment transition timing contract: content + copy + handoff must complete inside
// the records section so the recruitment headline doesn't bleed through during scroll.
const recordsTransition = readFileSync(
  join(root, "components/site/homepage-records.tsx"),
  "utf8"
)
assert(
  /handoffProgress\s*=\s*clamp\(\(progress - 0\.58\) \/ 0\.3\)/.test(
    recordsTransition
  ),
  "Records handoff must start at progress 0.58 so the dark veil is fully covering the recruitment glow by the end of the section."
)
assert(
  /contentClear\s*=\s*clamp\(\(progress - 0\.66\) \/ 0\.12\)/.test(
    recordsTransition
  ),
  "Records content must fully fade between progress 0.66 and 0.78, before the section releases."
)
assert(
  /copyClear\s*=\s*clamp\(\(progress - 0\.6\) \/ 0\.12\)/.test(
    recordsTransition
  ),
  "Records copy must fully fade between progress 0.60 and 0.72, before the section releases."
)
assert(
  /-bottom-\[40svh\][^"]*h-\[180svh\]/.test(recordsTransition),
  "Records handoff overlay must be tall enough (h-[180svh] with -bottom-[40svh]) to cover the recruitment glow bleeding in from below."
)
assert(
  !recordsTransition.includes("radial-gradient(ellipse_at_50%_78%"),
  "Records handoff overlay must stay dark-only so it does not create a yellow seam at the recruitment boundary."
)
const recruitmentTransition = readFileSync(
  join(root, "components/site/homepage-recruitment.tsx"),
  "utf8"
)
assert(
  /clamp\(\(progress - 0\.26\) \/ 0\.18\)/.test(recruitmentTransition),
  "Recruitment intro opacity must wait until progress 0.26 so the headline only appears after the records dark veil completes."
)
assert(
  !recruitmentTransition.includes("circle_at_78%_18%") &&
    !recruitmentTransition.includes("ellipse_at_50%_0%"),
  "Recruitment background must not anchor yellow radial gradients to the section top edge."
)
assert(
  recruitmentTransition.includes("top-[24svh]") &&
    recruitmentTransition.includes("h-[min(82vw,46rem)]") &&
    recruitmentTransition.includes("-inset-[18%]") &&
    recruitmentTransition.includes("h-[42svh]") &&
    recruitmentTransition.includes("-top-[34svh]") &&
    recruitmentTransition.includes("overflow-x-clip") &&
    recruitmentTransition.includes("overflow-y-visible"),
  "Recruitment glow must sit lower behind the headline with an unclipped soft edge and an upward dark veil to avoid visible seams."
)
assert(
  !recruitmentCta.includes("bg-clip-text") &&
    !recruitmentCta.includes("text-transparent"),
  "Embrace Tomorrow must not use a yellow text sweep effect."
)
assert(
  !/text-accent-yellow[^>]*>\s*Recruitment\s*</.test(recruitmentCta),
  "Recruitment CTA section must not render a yellow 'Recruitment' kicker above Embrace Tomorrow."
)
assert(
  recruitmentCta.includes('href="/recruitment"'),
  "Recruitment CTA section must link to the recruitment route."
)
assert(
  recruitmentCta.includes('"use client"'),
  "Recruitment CTA section must be client-side so it can animate on scroll."
)
assert(
  recruitmentCta.includes("useEffect"),
  "Recruitment CTA section must drive its scroll transition with useEffect."
)
assert(
  /window\.addEventListener\("scroll"/.test(recruitmentCta),
  "Recruitment CTA section must listen to scroll events for its transition."
)
assert(
  /data-homepage-recruitment-intro/.test(recruitmentCta),
  "Recruitment CTA section must expose a centered intro hook."
)
assert(
  /items-center text-center/.test(recruitmentCta),
  "Recruitment CTA intro must be centered so the Join the team action aligns cleanly."
)
assert(
  /--recruitment-intro-y/.test(recruitmentCta),
  "Recruitment CTA section must animate the headline/CTA vertical entrance."
)
assert(
  /--recruitment-panel-blur/.test(recruitmentCta),
  "Recruitment CTA section must animate the dropdown panel blur while scrolling in."
)
assert(
  /--recruitment-glow-scale/.test(recruitmentCta),
  "Recruitment CTA section must animate the background glow scale while scrolling in."
)
assert(
  /<details/.test(recruitmentCta),
  "Recruitment CTA section must use dropdown details for disciplines."
)
assert(
  recruitmentCta.includes("data-homepage-recruitment-discipline"),
  "Recruitment CTA section must mark each discipline dropdown."
)
for (const discipline of ["Design", "Engineering", "Business"]) {
  assert(
    recruitmentContent.includes(`name: "${discipline}"`),
    `Recruitment content must include a ${discipline} stream.`
  )
  assert(
    recruitmentCta.includes(`data-homepage-recruitment-roles={stream.name}`),
    "Recruitment CTA must expose stream-specific role family groups."
  )
}
assert(
  recruitmentCta.includes("data-homepage-recruitment-role"),
  "Recruitment CTA section must mark populated role cards."
)
for (const family of [
  "Software Engineering",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Renewables",
  "Chemical Engineering",
  "Design",
  "Media",
  "Finance",
  "Marketing",
  "Operations",
]) {
  assert(
    recruitmentContent.includes(family),
    `Recruitment stream summary must include ${family}.`
  )
}

assert(
  recruitmentPage.includes("data-recruitment-hub"),
  "Recruitment page must expose the redesigned hub."
)
assert(
  recruitmentPage.includes("<TransparentNavbar />"),
  "Recruitment page must render the transparent navbar."
)
assert(
  recruitmentPage.includes('className="bg-[#0a0c0e] text-white"'),
  "Recruitment page must use the darker recruitment theme."
)
assert(
  recruitmentPage.includes("data-recruitment-streams"),
  "Recruitment page must expose stream dropdowns."
)
assert(
  recruitmentPage.includes("data-recruitment-stream={stream.name}"),
  "Recruitment page must mark each Design/Engineering/Business dropdown."
)
assert(
  recruitmentPage.includes("data-alternative-applications-link"),
  "Recruitment page must expose the alternative business/media applications CTA."
)
assert(
  recruitmentPage.includes(
    "https://forms.gle/sunswift-business-media-placeholder"
  ),
  "Recruitment page must link the alternative applications CTA to the placeholder Google Forms URL."
)
assert(
  recruitmentPage.includes("Business/media form"),
  "Recruitment page secondary hero CTA must be for business/media applications."
)
assert(
  recruitmentPage.includes("recruitmentStreamHref(stream)"),
  "Recruitment stream links must route to the dedicated role stream pages."
)
assert(
  !recruitmentPage.includes("rolesForRecruitmentStream"),
  "Recruitment hub must not render role grouping inline; it should defer cards to the available roles page."
)
assert(
  !recruitmentPage.includes("data-recruitment-role-card"),
  "Recruitment hub must not render inline role cards."
)
assert(
  !recruitmentPage.includes("data-recruitment-role-empty"),
  "Recruitment hub must not render inline role empty states."
)
assert(
  !recruitmentPage.includes("getRecruitmentRoles"),
  "Recruitment hub must not fetch published roles; cards belong on the available roles page."
)
assert(
  !recruitmentPage.includes("Recruitment hub"),
  "Recruitment hub must not show the yellow 'Recruitment hub' heading text."
)
assert(
  recruitmentPage.includes("Business and media students support operations"),
  "Recruitment hub must include Webflow-inspired business/media overview copy."
)
assert(
  recruitmentPage.includes("Engineering students work across electrical"),
  "Recruitment hub must include Webflow-inspired engineering overview copy."
)
assert(
  recruitmentContent.includes('slug: "design"'),
  "Recruitment content must include a design slug for deep links."
)
assert(
  recruitmentContent.includes('rolePath: "design-roles"'),
  "Recruitment content must include the design role page path."
)
assert(
  recruitmentContent.includes('slug: "engineering"'),
  "Recruitment content must include an engineering slug for deep links."
)
assert(
  recruitmentContent.includes('rolePath: "engineering-roles"'),
  "Recruitment content must include the engineering role page path."
)
assert(
  recruitmentContent.includes('slug: "business"'),
  "Recruitment content must include a business slug for deep links."
)
assert(
  recruitmentContent.includes('rolePath: "business-roles"'),
  "Recruitment content must include the business role page path."
)

assert(
  availableRolesPage.includes("data-available-roles-page"),
  "Available roles page must expose the quick-scan page hook."
)
assert(
  availableRolesPage.includes("<TransparentNavbar />"),
  "Available roles page must render the transparent navbar."
)
assert(
  availableRolesPage.includes("getRecruitmentRoles"),
  "Available roles page must source role cards from the CMS/database helper."
)
assert(
  availableRolesPage.includes('getRecruitmentRoles("published")'),
  "Available roles page must use published recruitment roles."
)
assert(
  availableRolesPage.includes("rolesForRecruitmentStream"),
  "Available roles index must count database-backed role cards by recruitment stream."
)
assert(
  availableRolesPage.includes("recruitmentStreamHref(stream)"),
  "Available roles index must link to the three dedicated role pages."
)
assert(
  availableRolesPage.includes("data-available-role-stream={stream.name}"),
  "Available roles page must mark each stream section."
)
assert(
  availableRolesPage.includes("data-available-role-streams"),
  "Available roles index must expose the role stream chooser grid."
)
assert(
  !availableRolesPage.includes("data-available-role-card"),
  "Available roles index must not render CMS role cards directly."
)
assert(
  !availableRolesPage.includes("data-available-role-empty"),
  "Available roles index must not render CMS role empty states directly."
)
assert(
  roleStreamPage.includes("data-role-stream-page={stream.slug}"),
  "Dedicated role pages must expose their stream page hook."
)
assert(
  roleStreamPage.includes("generateStaticParams"),
  "Dedicated role pages must generate stream params."
)
assert(
  roleStreamPage.includes("getRecruitmentStreamByRolePath"),
  "Dedicated role pages must resolve the stream from the role path."
)
assert(
  roleStreamPage.includes("data-role-stream-card"),
  "Dedicated role pages must render CMS role cards."
)
assert(
  roleStreamPage.includes("data-role-stream-empty"),
  "Dedicated role pages must render empty states for streams without published CMS roles."
)

assert(
  partnersPage.includes("<PartnersPageContent />"),
  "Partners route must render the new custom partners page."
)
assert(
  partnersPageContent.includes("data-partners-page"),
  "Partners page must expose data-partners-page for browser verification."
)
assert(
  partnersPageContent.includes("<TransparentNavbar />"),
  "Partners page must use the transparent navbar."
)
assert(
  partnersPageContent.includes(
    "Building world-class cars takes more than just engineering - it takes a community."
  ),
  "Partners page must preserve the Webflow partners overview copy."
)
assert(
  partnersPageContent.includes("data-partners-marquee"),
  "Partners page must render a cycling partners banner."
)
assert(
  partnersPageContent.includes("data-partner-marquee-card"),
  "Partners marquee must render compact placeholder cards for every partner."
)
assert(
  partnersPageContent.includes("partner-marquee"),
  "Partners page must use the partner marquee animation hook."
)
assert(
  partnersPageContent.includes("data-partners-grid"),
  "Partners page must expose the partners grid."
)
assert(
  partnersPageContent.includes("lg:grid-cols-4"),
  "Partners grid must render as a 4-column grid on desktop."
)
assert(
  partnersPageContent.includes("max-w-[76rem]"),
  "Partners grid must be width-constrained so the 4-column layout reads closer to a square logo wall."
)
assert(
  partnersPageContent.includes("aspect-square"),
  "Partner placeholder cards must be square tiles."
)
assert(
  /backdrop-blur-xl/.test(partnersPageContent),
  "Partners grid and marquee cards must use the liquid-glass backdrop blur treatment."
)
assert(
  partnersPageContent.includes("data-partner-card"),
  "Partners page must mark partner placeholder cards."
)
for (const partner of [
  "3M",
  "Altium",
  "Ampcontrol",
  "Audi",
  "Optus",
  "UNSW",
  "WrapStyle Sydney",
]) {
  assert(
    partnersPageContent.includes(partner),
    `Partners page placeholder grid must include ${partner}.`
  )
}
assert(
  /@keyframes partner-marquee/.test(globalsCss),
  "globals.css must define the partners marquee animation."
)

// Vehicles gallery contract.
assert(
  vehiclesPage.includes("<VehiclesGallery"),
  "Vehicles route must mount the VehiclesGallery component."
)
assert(
  vehiclesPage.includes("<TransparentNavbar />"),
  "Vehicles route must render the transparent navbar overlay."
)

assert(
  vehiclesGallery.includes("data-vehicles-gallery"),
  "Vehicles gallery must expose data-vehicles-gallery for verification."
)
assert(
  vehiclesGallery.includes("data-vehicle-card"),
  "Vehicles gallery must mark each card with data-vehicle-card."
)
assert(
  vehiclesGallery.includes("data-vehicle-slug"),
  "Vehicles gallery must expose data-vehicle-slug on each card."
)
assert(
  vehiclesGallery.includes("data-vehicle-detail"),
  "Vehicles gallery must expose data-vehicle-detail for the detail view."
)
assert(
  vehiclesGallery.includes("data-clicking"),
  "Vehicles gallery must drive a click animation via data-clicking state."
)

// Scope the card-specific checks to the gallery section only (above the detail view).
const detailSplitIdx = vehiclesGallery.indexOf("function VehicleDetail")
assert(
  detailSplitIdx > 0,
  "Vehicles gallery file must export a VehicleDetail function for the detail view."
)
const gallerySection =
  detailSplitIdx > 0
    ? vehiclesGallery.slice(0, detailSplitIdx)
    : vehiclesGallery

assert(
  /gap-0/.test(gallerySection),
  "Vehicles gallery cards must sit edge-to-edge with gap-0."
)

// Extract the card <button>'s outermost className so corner/border checks only target the card surface itself.
const cardClassMatch = gallerySection.match(
  /aria-label=\{`Open[^]*?className=\{\[([^]*?)\]\.join\(" "\)\}/
)
assert(
  cardClassMatch !== null,
  "Vehicle card must declare its className via the join-array pattern."
)
const cardClassNames = cardClassMatch ? cardClassMatch[1] : ""
assert(
  !/rounded-(xl|lg|md|2xl|3xl)/.test(cardClassNames),
  "Vehicle card surface must have square corners (no rounded utilities)."
)
assert(
  !/\bborder\s+border-white\/(10|15|20|25)/.test(cardClassNames),
  "Vehicle card surface must not carry a hairline white border."
)

assert(
  /pointer-events-none[^"]*absolute[^"]*bottom-0[^"]*bg-transparent/.test(
    gallerySection
  ),
  "Vehicles gallery footer must be an absolutely positioned transparent overlay."
)

assert(
  /pb-(40|44|48|52|56|60)/.test(gallerySection),
  "Vehicle card content must reserve enough bottom padding so the title clears the footer overlay."
)

assert(
  !/right-4 top-4[^]*?\+\s*<\/span>/.test(gallerySection),
  "Vehicles cards must not render the redundant yellow + indicator at the top-right."
)
assert(
  !/>\s*\+\s*<\/span>/.test(gallerySection),
  "Vehicles cards must not render the redundant + indicator."
)

assert(
  !/shadow-\[[^\]]*rgba\(\s*245\s*,\s*208\s*,\s*0/.test(gallerySection),
  "Vehicles cards must not carry a yellow glow shadow on the click state."
)

assert(
  /data-vehicle-name/.test(gallerySection),
  "Vehicles cards must render a data-vehicle-name element so every car's name is visible."
)
assert(
  /writingMode:\s*"vertical-rl"/.test(gallerySection),
  "Vehicles card names must use writing-mode: vertical-rl to read top-to-bottom."
)
assert(
  /vehicle-name-vertical/.test(gallerySection),
  "Vehicles card names must carry the vehicle-name-vertical class hook."
)

const nameSpanMatch = gallerySection.match(/data-vehicle-name[^]*?<\/span>/)
assert(
  nameSpanMatch !== null,
  "Vehicles gallery must include a data-vehicle-name span block."
)
const nameSpan = nameSpanMatch ? nameSpanMatch[0] : ""
assert(
  /\bright-4\b/.test(nameSpan),
  "Vehicle name must be anchored to the right edge of the card."
)
assert(
  /sm:right-6/.test(nameSpan),
  "Vehicle name responsive anchor must remain on the right edge at sm."
)
assert(
  !/\bleft-4\b/.test(nameSpan),
  "Vehicle name must not be anchored to the left edge anymore."
)
assert(
  /font-thin/.test(nameSpan),
  "Vehicle name must use font-thin (Inter 100)."
)

assert(
  /\.vehicle-name-vertical\s*{/.test(globalsCss),
  "globals.css must style the .vehicle-name-vertical helper."
)
assert(
  /font-family:\s*var\(--font-inter\)/.test(globalsCss),
  ".vehicle-name-vertical must declare the Inter font family."
)
assert(
  /font-weight:\s*100/.test(globalsCss),
  ".vehicle-name-vertical must set font-weight: 100 (Inter Thin)."
)

const layoutSource = readFileSync(join(root, "app/layout.tsx"), "utf8")
assert(
  /from\s+"next\/font\/google"/.test(layoutSource),
  "Root layout must load fonts via next/font/google."
)
assert(/Inter\(/.test(layoutSource), "Root layout must load the Inter font.")
assert(
  /weight:\s*\[[^\]]*"100"/.test(layoutSource),
  "Root layout must request Inter weight 100 (Thin)."
)
assert(
  /variable:\s*"--font-inter"/.test(layoutSource),
  "Root layout must expose Inter via the --font-inter CSS variable."
)
assert(
  /className=\{inter\.variable\}/.test(layoutSource),
  "Root <html> must apply the Inter font variable class."
)
assert(
  layoutSource.includes("<SiteFooter />"),
  "Root layout must render the persistent shared footer on every page."
)

assert(
  /data-homepage-vignette/.test(gallerySection),
  "Vehicles gallery footer area must include a vignette overlay (data-homepage-vignette)."
)
const vignetteMatch = gallerySection.match(/data-homepage-vignette[^]*?\/>/)
const vignetteBlock = vignetteMatch ? vignetteMatch[0] : ""
assert(
  /pointer-events-none/.test(vignetteBlock),
  "Vignette overlay must be pointer-events-none."
)
assert(
  /linear-gradient\(180deg/.test(vignetteBlock),
  "Vignette overlay must use a vertical linear-gradient."
)
assert(
  /#000|rgba\(10,12,14,0?\.9/.test(vignetteBlock),
  "Vignette overlay must fade to (near-)black at the bottom."
)

assert(
  /data-homepage-top-vignette/.test(gallerySection),
  "Vehicles gallery must include a top vignette behind the navbar."
)
const topVignetteMatch = gallerySection.match(
  /data-homepage-top-vignette[^]*?\/>/
)
const topVignetteBlock = topVignetteMatch ? topVignetteMatch[0] : ""
assert(
  /pointer-events-none/.test(topVignetteBlock),
  "Top vignette must be pointer-events-none."
)
assert(
  /top-0/.test(topVignetteBlock),
  "Top vignette must be anchored to the top of the gallery."
)
assert(
  /linear-gradient\(180deg,\s*#000/.test(topVignetteBlock),
  "Top vignette must start from black at the top and fade downward."
)

assert(
  /slug:\s*"sunswift-8"/.test(staticData),
  "Vehicles dataset must include the sunswift-8 entry."
)

const expectedNames = [
  { slug: '"sunswift-8"', pattern: /^SR-?8$/, label: "SR8 / SR-8" },
  { slug: '"sunswift-7"', pattern: /^SR-?7$/, label: "SR7 / SR-7" },
  { slug: '"sunswift-iii"', pattern: /^SR-?III$/, label: "SRIII / SR-III" },
  { slug: '"sunswift-ii"', pattern: /^SR-?II$/, label: "SRII / SR-II" },
  { slug: '"sunswift-i"', pattern: /^SR-?I$/, label: "SRI / SR-I" },
  { slug: '"ivy"', pattern: /^IVy$/, label: "IVy" },
  { slug: '"eve"', pattern: /^eVe$/, label: "eVe" },
  { slug: '"violet"', pattern: /^VIolet$/, label: "VIolet" },
]
for (const { slug, pattern, label } of expectedNames) {
  const slugIdx = staticData.indexOf(`slug: ${slug}`)
  assert(slugIdx >= 0, `Vehicles dataset must declare slug ${slug}.`)
  const blockEnd = staticData.indexOf("relatedPosts", slugIdx)
  const block = blockEnd > slugIdx ? staticData.slice(slugIdx, blockEnd) : ""
  const nameMatch = block.match(/name:\s*"([^"]+)"/)
  const nameValue = nameMatch ? nameMatch[1] : ""
  assert(
    pattern.test(nameValue),
    `Vehicle ${slug} must use the abbreviated name (${label}), got "${nameValue}".`
  )
  assert(
    !/name:\s*"Sunswift\s/.test(block),
    `Vehicle ${slug} must not keep the 'Sunswift ' prefix in its display name.`
  )
}

assert(
  /vehicle-card-rise/.test(globalsCss),
  "globals.css must define the vehicle-card-rise keyframe."
)
assert(
  /vehicle-click-pulse/.test(globalsCss),
  "globals.css must define the vehicle-click-pulse keyframe."
)
assert(
  /vehicle-detail-in/.test(globalsCss),
  "globals.css must define the vehicle-detail-in keyframe."
)

// Theme contract.
assert(
  /forcedTheme="light"/.test(themeProvider),
  "ThemeProvider must force the public site to light mode."
)
assert(
  !/setTheme\("dark"\)|setTheme\(resolvedTheme === "dark"/.test(themeProvider),
  "ThemeProvider must not expose a dark-mode toggle hotkey."
)

assert(
  /--primary:\s*oklch\(0\.1[0-9]/.test(globalsCss),
  "Primary token must be a near-black colour."
)
assert(
  /--primary-foreground:\s*oklch\(1 /.test(globalsCss),
  "Primary foreground must be white."
)
assert(
  /--accent-yellow:/.test(globalsCss),
  "globals.css must declare an --accent-yellow token."
)
assert(
  /--color-accent-yellow:/.test(globalsCss),
  "globals.css must expose --color-accent-yellow to Tailwind."
)
assert(
  /--radius:\s*0?\.[0-3]/.test(globalsCss),
  "Radius must be small (square-ish) for the liquid-glass look."
)

// Shared site shell glass + yellow-on-hover contract.
assert(
  /backdrop-blur-xl/.test(siteShell),
  "Shared site shell must use backdrop-blur for liquid-glass surfaces."
)
assert(
  /bg-white\/(55|60|65|70|75|80)/.test(siteShell),
  "Shared site shell must use a translucent white background."
)
assert(
  /hover:bg-accent-yellow/.test(siteShell),
  "Shared site shell must reserve accent-yellow for hover states."
)
assert(
  /hover:text-accent-yellow/.test(siteShell),
  "Shared site shell nav links must hover to accent-yellow."
)
assert(
  /data-site-footer/.test(siteShell),
  "Shared site shell must expose the persistent site footer."
)
assert(
  siteShell.includes("/brand/unsw-sydney-dark.png"),
  "Site footer must render the dark-theme UNSW Sydney logo asset."
)
assert(
  siteShell.includes("footerUnswLogoSrc") &&
    siteShell.includes("?v=20260515-footer") &&
    siteShell.includes("unoptimized"),
  "Site footer UNSW logo must bypass the Next image optimizer with a versioned public asset path so branding updates are not stale."
)
assert(
  !/border-t border-white\/10 bg-\[#0a0c0e\]/.test(siteShell),
  "Site footer must not use a hard top border."
)
assert(
  siteShell.includes("before:-top-32") &&
    siteShell.includes("linear-gradient(180deg") &&
    siteShell.includes("shadow-[0_-64px_140px_rgba(0,0,0,0.52)]"),
  "Site footer must use a dark vignette transition instead of a hard line."
)
assert(
  /lg:w-5[02]/.test(siteShell),
  "Site footer UNSW logo must be noticeably larger on desktop."
)
assert(
  /text-base[^"]*sm:text-lg/.test(siteShell),
  "Site footer Sunswift Racing heading must stay smaller than the enlarged UNSW logo."
)
assert(
  /Room G14,\s*Blockhouse \(G6\),\s*University Mall,\s*UNSW,\s*Kensington NSW\s*2052/.test(
    siteShell
  ),
  "Site footer must include the Sunswift room/address line."
)
assert(
  siteShell.includes("https://linktr.ee/sunswiftracing"),
  "Site footer Stay connected CTA must link to Linktree."
)
assert(
  siteShell.includes("Stay connected"),
  "Site footer must include the Stay connected CTA copy."
)
assert(
  siteShell.includes("Copyright © 2025"),
  "Site footer must include the requested copyright line."
)
assert(
  !/<SiteFooter \/>/.test(
    siteShell.slice(siteShell.indexOf("export function PageFrame"))
  ),
  "PageFrame must not render SiteFooter now that the footer is persistent in the root layout."
)

assert(
  /hover:bg-accent-yellow/.test(navbar),
  "Transparent navbar Join CTA must swap to accent-yellow on hover."
)
assert(
  /hover:text-accent-yellow/.test(navbar),
  "Transparent navbar links must hover to accent-yellow."
)

assert(
  /data-about-dropdown/.test(siteShell),
  "Shared site shell must expose the About Us dropdown."
)
assert(
  /<button[^]*About Us[^]*ChevronDown/.test(siteShell),
  "Shared site shell About Us item must be a dropdown button with a chevron arrow."
)
assert(
  /ArrowUpRight/.test(siteShell),
  "Shared site shell dropdown must use directional link arrows instead of plain menu rows."
)
assert(
  siteShell.includes("Who We Are"),
  "Shared site shell About Us dropdown must include Who We Are."
)
assert(
  siteShell.includes("/achievements"),
  "Shared site shell About Us dropdown must link to Achievements."
)
assert(
  siteShell.includes("Our Story"),
  "Shared site shell About Us dropdown must include Our Story."
)
assert(
  siteShell.includes("/our-story"),
  "Shared site shell About Us dropdown must link to Our Story."
)
assert(
  /data-recruitment-dropdown/.test(siteShell),
  "Shared site shell must expose the Recruitment dropdown."
)
assert(
  /<button[^]*Recruitment[^]*ChevronDown/.test(siteShell),
  "Shared site shell Recruitment item must be a dropdown button with a chevron arrow."
)
assert(
  siteShell.includes("Recruitment Hub"),
  "Shared site shell Recruitment dropdown must include Recruitment Hub."
)
assert(
  !siteShell.includes("Available Roles"),
  "Shared site shell Recruitment dropdown must not include the superseded Available Roles item."
)
assert(
  siteShell.includes("recruitmentStreams.map") &&
    siteShell.includes("stream.roleTitle"),
  "Shared site shell Recruitment dropdown must include all stream role pages."
)
assert(
  /data-mobile-nav/.test(siteShell) && /Menu/.test(siteShell),
  "Shared site shell must expose a mobile menu instead of hiding navigation on phone widths."
)
assert(
  /lg:hidden/.test(siteShell) && /calc\(100vw-2rem\)/.test(siteShell),
  "Shared site shell mobile menu must be phone-width constrained and visible below desktop."
)

assert(
  achievementsPage.includes("<TransparentNavbar />"),
  "Achievements route must render the transparent navbar."
)
assert(
  achievementsPage.includes("<AchievementsTimeline"),
  "Achievements route must mount the AchievementsTimeline component."
)
assert(
  /data-achievements-page/.test(achievementsTimeline),
  "Achievements timeline must expose data-achievements-page."
)
assert(
  /data-achievements-timeline/.test(achievementsTimeline),
  "Achievements timeline must expose data-achievements-timeline."
)
assert(
  /data-achievements-stage/.test(achievementsTimeline),
  "Achievements timeline must expose the sticky scroll stage."
)
assert(
  /data-achievements-intro-section/.test(achievementsTimeline),
  "Achievements intro copy must live in its own opening section."
)
assert(
  /data-achievements-scroll-section/.test(achievementsTimeline),
  "Achievements scroll-driven timeline must live in a separate scroll section."
)
assert(
  /data-achievements-intro/.test(achievementsTimeline),
  "Achievements timeline must expose the intro copy block."
)
assert(
  /data-achievements-current-copy/.test(achievementsTimeline),
  "Achievements timeline must expose the persistent current-copy block."
)
assert(
  /data-achievements-minimal-copy/.test(achievementsTimeline),
  "Achievements timeline must expose the persistent minimal-copy block."
)
assert(
  /const\s+detailOpacity\s*=\s*1\b/.test(achievementsTimeline),
  "Achievements current-copy block must stay visible (detailOpacity = 1) so the description renders for every milestone, including 2023."
)
assert(
  /const\s+minimalOpacity\s*=\s*1\b/.test(achievementsTimeline),
  "Achievements minimal-copy block must stay visible (minimalOpacity = 1) so the kicker + giant year + title renders for every milestone, including 2023."
)
assert(
  /data-achievements-year-rail/.test(achievementsTimeline),
  "Achievements timeline must include a bottom year rail."
)
assert(
  /data-achievements-year-progress/.test(achievementsTimeline),
  "Achievements timeline must include a progress indicator on the bottom year rail."
)
assert(
  /data-achievement-year-marker/.test(achievementsTimeline),
  "Achievements timeline must render year markers on the bottom rail."
)
assert(
  /data-achievement-card/.test(achievementsTimeline),
  "Achievements timeline must mark each horizontal card."
)
assert(
  /data-achievements-timeline-viewport/.test(achievementsTimeline),
  "Achievements timeline must use a clipped viewport so cards stay visible in the sticky stage."
)
assert(
  /h-\[clamp\(7\.5rem,18svh,10\.5rem\)\]/.test(achievementsTimeline),
  "Achievement cards must use viewport-aware heights tall enough to keep the vehicle name visible."
)
assert(
  /w-\[58vw\]/.test(achievementsTimeline) &&
    /sm:w-\[31vw\]/.test(achievementsTimeline) &&
    /lg:w-\[17vw\]/.test(achievementsTimeline),
  "Achievement cards must resize responsively across mobile, tablet, and desktop."
)
assert(
  /data-achievement-vehicle/.test(achievementsTimeline),
  "Achievement cards must mark the vehicle name with data-achievement-vehicle so it can be verified as visible."
)
assert(
  /mt-auto[^"]*pt-2[^"]*font-mono[^"]*tracking-\[0\.22em\]/.test(
    achievementsTimeline
  ),
  "Achievement card vehicle name must be pinned to the bottom of the card with mt-auto so it is never clipped by a long title."
)
assert(
  /line-clamp-2/.test(achievementsTimeline),
  "Achievement card titles must use line-clamp-2 so they cannot overflow the card and push the vehicle name out of view."
)
assert(
  /data-active-year/.test(achievementsTimeline),
  "Achievements page must expose the active year."
)
assert(
  /window\.addEventListener\("scroll"/.test(achievementsTimeline),
  "Achievements timeline must listen to vertical scroll events."
)
assert(
  /section\.offsetHeight - window\.innerHeight/.test(achievementsTimeline),
  "Achievements timeline must derive progress from vertical scroll distance."
)
assert(
  /rail\.scrollWidth - stage\.clientWidth/.test(achievementsTimeline),
  "Achievements timeline must translate across the horizontal rail width."
)
assert(
  /--achievements-track-x/.test(achievementsTimeline),
  "Achievements timeline must expose a transform variable for the horizontal rail."
)
assert(
  /translate3d\(-\$\{translateX\}px/.test(achievementsTimeline),
  "Achievements timeline must translate the rail horizontally from vertical scroll progress."
)
assert(
  !/overflow-x-auto/.test(achievementsTimeline),
  "Achievements timeline should be driven by vertical scroll, not manual horizontal overflow."
)
assert(
  !/snap-x/.test(achievementsTimeline),
  "Achievements timeline should not rely on snap-x now that vertical scroll drives the rail."
)
assert(
  /setTimelineState/.test(achievementsTimeline),
  "Achievements timeline must update active state as the user scrolls."
)
assert(
  /activeAchievement\?\.image|achievement\.image/.test(achievementsTimeline),
  "Achievements timeline must render media driven by the active achievement data."
)

const introSectionIdx = achievementsTimeline.indexOf(
  "data-achievements-intro-section"
)
const scrollSectionIdx = achievementsTimeline.indexOf(
  "data-achievements-scroll-section"
)
const stageIdx = achievementsTimeline.indexOf("data-achievements-stage")
assert(
  introSectionIdx >= 0 &&
    scrollSectionIdx > introSectionIdx &&
    stageIdx > scrollSectionIdx,
  "Achievements intro must appear before the separate sticky timeline section."
)

// Cinematic intro→timeline transition contract.
assert(
  /height:\s*"240svh"/.test(achievementsTimeline),
  "Achievements intro section must reserve a 240svh pinned scroll range so the transition has room to play."
)
assert(
  /sticky\s+top-0\s+h-svh/.test(achievementsTimeline),
  "Achievements intro must use a sticky h-svh inner stage that pins through the transition."
)
assert(
  /phaseScatter/.test(achievementsTimeline),
  "Achievements intro transition must compute a phaseScatter stage for the headline scatter."
)
assert(
  /phaseWipe/.test(achievementsTimeline),
  "Achievements intro transition must compute a phaseWipe stage for the accent wipe."
)
assert(
  /phaseHandoff/.test(achievementsTimeline),
  "Achievements intro transition must compute a phaseHandoff stage for the timeline takeover."
)
assert(
  /data-achievements-wipe/.test(achievementsTimeline),
  "Achievements intro must render a data-achievements-wipe accent line during the transition."
)
assert(
  /headlineWords\.map/.test(achievementsTimeline),
  "Achievements intro headline must be split into per-word spans so they can scatter independently."
)
assert(
  /headlineWordOpacity\(/.test(achievementsTimeline) &&
    /headlineWordY\(/.test(achievementsTimeline) &&
    /headlineWordBlur\(/.test(achievementsTimeline),
  "Achievements intro headline words must animate opacity, translate, and blur per word during the scatter."
)
assert(
  /1996[^]*2026/.test(achievementsTimeline),
  "Achievements intro transition must reveal a 1996 → 2026 year stamp at the wipe point."
)
assert(
  /achievementsOverview/.test(staticData),
  "Static data must include the Webflow-sourced achievements overview."
)
assert(
  /export const achievements/.test(staticData),
  "Static data must export achievements."
)
for (const phrase of [
  "Bridgestone World Solar Challenge '23",
  "Optus Remote Driving Initiative",
  "Guinness World Record '22",
  "FIA Land Speed Record",
  "World Solar Challenge '96",
]) {
  assert(
    staticData.includes(phrase),
    `Achievements data must include ${phrase}.`
  )
}

assert(
  teamPage.includes("<TransparentNavbar />") && teamPage.includes("<TeamRoster />"),
  "Team route must render the transparent navbar and the front-end roster component."
)
assert(
  !teamPage.includes("@/lib/cms/dynamodb") &&
    !teamPage.includes("getTeamMembers") &&
    !teamPage.includes("assetUrl") &&
    !/force-dynamic/.test(teamPage),
  "Team route must stay front-end only for this slice; CMS integration is deferred."
)
assert(
  teamRoster.includes('"use client"') &&
    teamRoster.includes("useState") &&
    teamRoster.includes("useMemo"),
  "Team roster must be a client component with local filtering state."
)
assert(
  /data-team-page/.test(teamRoster) &&
    /data-team-filter/.test(teamRoster) &&
    /data-team-grid/.test(teamRoster) &&
    /data-team-card/.test(teamRoster) &&
    /data-team-department/.test(teamRoster) &&
    /data-filtered-count/.test(teamRoster),
  "Team roster must expose data hooks for browser verification."
)
assert(
  /<select[^]*data-team-filter/.test(teamRoster) &&
    /selectedDepartment/.test(teamRoster) &&
    /setSelectedDepartment/.test(teamRoster),
  "Team roster must include an accessible department dropdown filter."
)
for (const department of [
  "Embedded Systems",
  "Energy Systems",
  "Chassis and Bodywork",
  "Powertrain",
  "Vehicle Dynamics",
  "Business",
  "Media",
]) {
  assert(
    teamRoster.includes(department),
    `Team placeholder roster must include the ${department} department.`
  )
}
assert(
  teamRoster.includes("/placeholders/team-member.svg"),
  "Team roster must use the local team-member placeholder image path."
)
assert(
  teamRoster.includes("team-card-filter-in") &&
    globalsCss.includes("@keyframes team-card-filter-in"),
  "Team filtering must use the team-card-filter-in transition."
)
assert(
  !teamRoster.includes("@/components/ui"),
  "Public team roster must not use shadcn UI; shadcn styling is reserved for admin."
)

if (failures.length > 0) {
  console.error("Homepage design contract failed:")
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log("Homepage design contract passed.")
