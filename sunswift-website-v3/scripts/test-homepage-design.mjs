import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"

const root = process.cwd()
const layout = readFileSync(join(root, "app/layout.tsx"), "utf8")
const page = readFileSync(join(root, "app/page.tsx"), "utf8")
const hero = readFileSync(
  join(root, "components/site/homepage-hero.tsx"),
  "utf8"
)
const navbar = readFileSync(
  join(root, "components/site/transparent-navbar.tsx"),
  "utf8"
)
const brandLogo = readFileSync(
  join(root, "components/site/brand-logo.tsx"),
  "utf8"
)
const juicerSidebar = readFileSync(
  join(root, "components/site/juicer-sidebar.tsx"),
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
const homepageImageSequence = readFileSync(
  join(root, "components/site/homepage-image-sequence.tsx"),
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
const mediaPage = readFileSync(
  join(root, "app/(public)/media/page.tsx"),
  "utf8"
)
const mediaHighlightsPage = readFileSync(
  join(root, "components/site/media-highlights-page.tsx"),
  "utf8"
)
const mediaHighlightsJson = readFileSync(
  join(root, "content/media-highlights.json"),
  "utf8"
)
const contactPage = readFileSync(
  join(root, "app/(public)/contact/page.tsx"),
  "utf8"
)
const contactPageContent = readFileSync(
  join(root, "components/site/contact-page.tsx"),
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
const cmsApi = readFileSync(join(root, "lib/cms/api.ts"), "utf8")
const cmsCsv = readFileSync(join(root, "lib/cms/csv.ts"), "utf8")
const cmsTypes = readFileSync(join(root, "lib/cms/types.ts"), "utf8")
const cmsDynamodb = readFileSync(join(root, "lib/cms/dynamodb.ts"), "utf8")
const cmsAssets = readFileSync(join(root, "content/cms-assets.json"), "utf8")
const packageJson = readFileSync(join(root, "package.json"), "utf8")
const authConfig = readFileSync(join(root, "auth.ts"), "utf8")
const adminActions = readFileSync(join(root, "app/admin/actions.ts"), "utf8")
const adminLoginPage = readFileSync(
  join(root, "app/admin/login/page.tsx"),
  "utf8"
)
const adminTeamPage = readFileSync(
  join(root, "app/admin/team/page.tsx"),
  "utf8"
)
const adminShell = readFileSync(
  join(root, "components/site/admin-shell.tsx"),
  "utf8"
)
const adminPartnersPage = readFileSync(
  join(root, "app/admin/partners/page.tsx"),
  "utf8"
)
const adminAssetsPage = readFileSync(
  join(root, "app/admin/assets/page.tsx"),
  "utf8"
)
const cmsAdminVerifier = readFileSync(
  join(root, "scripts/verify-cms-admin.mjs"),
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
  homepageImageSequence,
].some((source) => /opal/i.test(source))
assert(!opalReferences, "Homepage source files must not mention Opal.")

assert(
  page.includes("<HomepageHero />"),
  "Homepage must render the dedicated homepage hero component."
)
assert(
  hero.includes('posterSrc="/vehicle-fleet/vehicle-sunswift-8.jpg"') &&
    hero.includes('sequenceBasePath="/homepage-sequences/hero"') &&
    !hero.includes('src="/placeholders/hero-track.svg"'),
  "Homepage hero must use the SR8 vehicle image instead of the old SVG placeholder."
)
assert(
  /title:\s*\{\s*default:\s*"Sunswift Racing"[^]*template:\s*"%s \| Sunswift Racing"/.test(
    layout
  ),
  "Root layout must use a per-page browser tab title template."
)
for (const [source, title] of [
  [page, "Home"],
  [whoWeArePage, "About Us"],
  [ourStoryPage, "Our Story"],
  [teamPage, "Our Team"],
  [vehiclesPage, "Vehicles"],
  [partnersPage, "Partners"],
  [mediaPage, "Media"],
  [contactPage, "Contact"],
  [achievementsPage, "Achievements"],
  [recruitmentPage, "Recruitment"],
  [availableRolesPage, "Available Roles"],
]) {
  assert(
    source.includes(`title: "${title}"`),
    `Route metadata must set the browser tab title to ${title}.`
  )
}
assert(
  roleStreamPage.includes("export async function generateMetadata") &&
    roleStreamPage.includes("title: stream?.roleTitle"),
  "Role stream pages must derive the browser tab title from the active stream."
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
  page.includes("listCmsRecords"),
  "Homepage must source recruitment cards from the CMS API facade."
)
assert(
  page.includes('listCmsRecords("roles", "published")'),
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
  zoomReveal.includes('sequenceBasePath="/homepage-sequences/zoom-reveal"') &&
    homepageImageSequence.includes("frame_") &&
    homepageImageSequence.includes("padStart(3") &&
    homepageImageSequence.includes("frameCount = 81") &&
    homepageImageSequence.includes("sequenceUnavailable"),
  "Homepage image sequence prep must support frame_000.webp through frame_080.webp with a poster fallback."
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
  !/--zoom-tracking/.test(zoomReveal) &&
    globalsCss.includes("letter-spacing: 0"),
  "Zoom-reveal headline must keep stable letter spacing so the two-line title does not rewrap after scroll."
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
  navbar.includes("<SunswiftBrandLogo") &&
    siteShell.includes("<SunswiftBrandLogo"),
  "Public navigation and footer must use the Sunswift brand logo asset instead of plain text wordmarks."
)
assert(
  brandLogo.includes("/brand/sunswift-logo.svg") &&
    brandLogo.includes('alt="Sunswift Racing"') &&
    /group-hover:brightness-\[0\.[0-7]/.test(brandLogo),
  "BrandLogo component must render the supplied Sunswift Racing PNG logo with accessible alt text and a darkening hover filter."
)
assert(
  existsSync(join(root, "public/brand/sunswift-logo.svg")),
  "public/brand/sunswift-logo.svg must exist (supplied logo asset)."
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
  about.includes("data-homepage-about-shared-vehicle") &&
    about.includes('posterSrc="/vehicle-fleet/vehicle-sunswift-8.jpg"') &&
    about.includes('sequenceBasePath="/homepage-sequences/about"') &&
    about.includes("bg-[#f6f5f1]"),
  "About section must share the SR8 visual language and light canvas with the scroll reveal."
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
    records.includes("data-homepage-records-black-wipe") &&
    records.includes("--records-carousel-y") &&
    records.includes("--records-black-y") &&
    records.includes("--records-handoff-opacity") &&
    records.includes("--records-content-opacity") &&
    records.includes("--records-text-color") &&
    records.includes("--records-muted-color"),
  "Records section must be one client-side sticky section that cycles achievements and uses an Opal-style hard white-to-black takeover."
)
assert(
  !records.includes("--records-dark-opacity") &&
    !records.includes("--records-light-opacity") &&
    !records.includes("--records-copy-y") &&
    !records.includes("--records-content-y"),
  "Records section must not fade through the old black/grey/white transition or move the fixed left copy."
)
assert(
  records.includes("translate3d(0, var(--records-black-y), 0)") &&
    records.includes("translate3d(0, var(--records-carousel-y), 0)"),
  "Records section must hard-wipe the background while only the right-side record carousel moves vertically."
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
  recruitmentCta.includes("data-homepage-recruitment-block") &&
    recruitmentCta.includes(
      'data-homepage-recruitment-block className="hidden"'
    ) &&
    !/data-homepage-recruitment-block[^>]*bg-accent-yellow/.test(
      recruitmentCta
    ),
  "Recruitment CTA section must keep the background fully black without the yellow accent image/block."
)
assert(
  !recruitmentCta.includes("data-homepage-recruitment-gradient") &&
    !globalsCss.includes("@keyframes homepage-recruitment-background"),
  "Recruitment CTA must not keep the old animated gradient treatment."
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
  /copyClear\s*=\s*clamp\(\(progress - 0\.03\) \/ 0\.07\)/.test(
    recordsTransition
  ),
  "Records intro copy must clear before the black wipe crosses the frame."
)
assert(
  /blackCover\s*=\s*clamp\(\(progress - 0\.12\) \/ 0\.13\)/.test(
    recordsTransition
  ) &&
    /contentReveal\s*=\s*clamp\(\(progress - 0\.26\) \/ 0\.08\)/.test(
      recordsTransition
    ),
  "Records carousel content must wait until after the hard black wipe completes."
)
assert(
  /-bottom-\[40svh\][^"]*h-\[180svh\]/.test(recordsTransition),
  "Records handoff overlay must be tall enough (h-[180svh] with -bottom-[40svh]) to cover the recruitment glow bleeding in from below."
)
assert(
  !/gradient|linear-gradient|radial-gradient|conic-gradient/.test(
    recordsTransition
  ),
  "Landing records section must use hard colour blocks, not gradients."
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
  recruitmentTransition.includes("data-homepage-recruitment-block") &&
    recruitmentTransition.includes('className="hidden"') &&
    recruitmentTransition.includes("h-[42svh]") &&
    recruitmentTransition.includes("-top-[34svh]") &&
    recruitmentTransition.includes("overflow-x-clip") &&
    recruitmentTransition.includes("overflow-y-visible"),
  "Recruitment background must remain fully black with only hard dark handoff blocks to avoid visible seams."
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
  !/--recruitment-panel-blur|blur-sm|group-open:blur-0/.test(recruitmentCta),
  "Recruitment CTA section must not use blur on the discipline dropdowns."
)
assert(
  !/--recruitment-block-opacity/.test(recruitmentCta),
  "Recruitment CTA section must not animate a yellow background block."
)
assert(
  recruitmentCta.includes("grid-rows-[0fr]") &&
    recruitmentCta.includes("group-data-[state=open]:grid-rows-[1fr]") &&
    recruitmentCta.includes("before:w-0") &&
    recruitmentCta.includes("group-data-[state=open]:before:w-full") &&
    recruitmentCta.includes("ease-[cubic-bezier(0.16,1,0.3,1)]") &&
    recruitmentCta.includes("group-data-[state=open]:translate-y-0"),
  "Recruitment CTA discipline panels must use non-blur open/closed motion with a drawn accent rule."
)
assert(
  /aria-expanded=\{isOpen\}/.test(recruitmentCta) &&
    /role="region"/.test(recruitmentCta) &&
    /useState\("Engineering"\)/.test(recruitmentCta) &&
    !/<details/.test(recruitmentCta),
  "Recruitment CTA section must use an accessible state-driven accordion for disciplines."
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
    recruitmentCta.includes(
      `data-homepage-recruitment-stream-card={stream.name}`
    ),
    "Recruitment CTA must expose one stream card per discipline."
  )
}
assert(
  recruitmentCta.includes("data-homepage-recruitment-role"),
  "Recruitment CTA section must mark stream role cards."
)
assert(
  !/families\s*:/.test(recruitmentContent),
  "Recruitment content must not keep Webflow-style family tag lists."
)
assert(
  !/data-[a-z-]*famil/.test(
    recruitmentCta + recruitmentPage + availableRolesPage + roleStreamPage
  ),
  "Recruitment pages must not render legacy family/tag chip groups."
)

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
  availableRolesPage.includes("listCmsRecords"),
  "Available roles page must source role cards from the CMS API facade."
)
assert(
  availableRolesPage.includes('listCmsRecords("roles", "published")'),
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
  partnersPage.includes("<PartnersPageContent partners={partners} />"),
  "Partners route must render the custom partners page with CMS partner records."
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
  !partnersPageContent.includes("data-partners-marquee") &&
    !partnersPageContent.includes("data-partner-marquee-card") &&
    !partnersPageContent.includes("partner-marquee") &&
    !partnersPageContent.includes("data-partners-grid") &&
    !partnersPageContent.includes("data-partner-card") &&
    !partnersPageContent.includes("View grid") &&
    !partnersPageContent.includes("Powered by shared ambition"),
  "Partners page must remove the marquee, grid, view-grid CTA, and powered-by header."
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
    staticData.includes(partner),
    `Fallback partner CMS data must include ${partner}.`
  )
}
assert(!/@keyframes partner-marquee/.test(globalsCss), "Partner marquee CSS must be removed.")

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
  const nextSlugIdx = staticData.indexOf("slug:", slugIdx + 1)
  const block = staticData.slice(
    slugIdx,
    nextSlugIdx > slugIdx ? nextSlugIdx : staticData.length
  )
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
  !/relatedPosts/.test(staticData + vehiclesGallery),
  "Vehicles must not keep related-post tag chips."
)
for (const slug of [
  '"sunswift-7"',
  '"violet"',
  '"eve"',
  '"ivy"',
  '"sunswift-iii"',
  '"sunswift-ii"',
  '"sunswift-i"',
]) {
  const slugIdx = staticData.indexOf(`slug: ${slug}`)
  const nextSlugIdx = staticData.indexOf("slug:", slugIdx + 1)
  const block = staticData.slice(
    slugIdx,
    nextSlugIdx > slugIdx ? nextSlugIdx : staticData.length
  )
  assert(
    /overview:\s*/.test(block),
    `Vehicle ${slug} must include overview copy.`
  )
}
assert(
  vehiclesGallery.includes("data-vehicle-carousel"),
  "Vehicle detail must expose the click-switch achievements/overview carousel."
)
assert(
  vehiclesGallery.includes('data-vehicle-carousel-panel="overview"'),
  "Vehicle detail carousel must include an overview panel."
)
assert(
  vehiclesGallery.includes("data-vehicle-specs"),
  "Vehicle detail must mark the technical specification section."
)
assert(
  vehiclesGallery.indexOf("data-vehicle-carousel") <
    vehiclesGallery.indexOf("data-vehicle-specs"),
  "Vehicle technical specifications must render below the achievements/overview carousel."
)
assert(
  vehiclesGallery.includes("data-vehicle-carousel-controls") &&
    vehiclesGallery.includes("data-vehicle-carousel-trigger={panel}") &&
    vehiclesGallery.includes("onClick={() => setActivePanel(panel)}"),
  "Vehicle carousel must switch through explicit click controls."
)
assert(
  !/onWheel|handleCarouselWheel|WheelEvent|carouselHovered|Hover \+ scroll/.test(
    vehiclesGallery
  ),
  "Vehicle carousel must not keep the old hover-and-scroll gesture."
)
assert(
  vehiclesGallery.includes("[text-shadow:0_1px_14px") &&
    vehiclesGallery.includes("[text-shadow:0_1px_16px"),
  "Vehicle quick summaries must use high-contrast white text over imagery."
)

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
  "Site footer must not use the old hard top border."
)
assert(
  siteShell.includes("before:-top-32") &&
    siteShell.includes("linear-gradient(180deg") &&
    siteShell.includes("shadow-[0_-64px_140px_rgba(0,0,0,0.52)]"),
  "Site footer must use a dark vignette transition instead of a hard line."
)
assert(
  /text-\[clamp\(4\.5rem,13vw,13rem\)\]/.test(siteShell) &&
    siteShell.includes("Tomorrow, Today."),
  "Site footer must use a dark large-type editorial headline."
)
assert(
  siteShell.includes("sm:grid-cols-[1fr_auto]") &&
    siteShell.includes("navItems.map"),
  "Site footer must keep brand/legal/actions organized below the large headline."
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
  /useSyncExternalStore/.test(achievementsTimeline) &&
    /MOBILE_TIMELINE_QUERY/.test(achievementsTimeline),
  "Achievements timeline must use a client media-query subscription for a mobile-specific layout."
)
assert(
  /data-achievements-mobile-timeline/.test(achievementsTimeline) &&
    /data-mobile-achievement-card/.test(achievementsTimeline),
  "Achievements timeline must render a dedicated vertical mobile timeline."
)
assert(
  /md:hidden/.test(achievementsTimeline) &&
    /hidden min-h-svh overflow-hidden md:block/.test(achievementsTimeline),
  "Achievements timeline must show the vertical list on mobile and reserve the cinematic rail for tablet/desktop."
)
assert(
  /isMobileTimeline\s*\?\s*undefined/.test(achievementsTimeline),
  "Achievements timeline must remove the oversized desktop scroll height on mobile."
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
  /const timelineStart = 0\.1/.test(achievementsTimeline) &&
    /timelineProgress/.test(achievementsTimeline),
  "Achievements timeline must hold the first item briefly before horizontal translation starts."
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
  achievementsTimeline.includes("data-achievements-video-reload"),
  "Achievements timeline must expose a circular reload control when milestone video is used."
)
assert(
  /<video\b/.test(achievementsTimeline),
  "Achievements timeline must render native <video> for optional MP4 milestones."
)
assert(
  /activeAchievement\?\.image|achievement\.image|achievement\.videoMp4/.test(
    achievementsTimeline
  ),
  "Achievements timeline must render media driven by the active achievement (image and/or optional video)."
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
  /height:\s*isMobileTimeline\s*\?\s*"145svh"\s*:\s*"240svh"/.test(
    achievementsTimeline
  ),
  "Achievements intro section must use a shorter pinned range on mobile and a 240svh cinematic range on desktop."
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
  /phaseBlockHandoff/.test(achievementsTimeline),
  "Achievements intro transition must compute a block handoff stage."
)
assert(
  /data-achievements-block-handoff/.test(achievementsTimeline),
  "Achievements intro must render a block handoff panel during the transition."
)
assert(
  !/data-achievements-wipe|phaseWipe|phaseHandoff|yearStamp/.test(
    achievementsTimeline
  ),
  "Achievements intro must remove the old wipe/year-stamp transition layers."
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
  !/1996[^]*2026/.test(achievementsTimeline),
  "Achievements intro transition must not reveal the removed 1996 → 2026 stamp."
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
  !staticData.includes("/placeholders/vehicle-violet.svg"),
  "Static CMS data must not reference the removed vehicle-violet.svg."
)
assert(
  staticData.includes("/vehicle-fleet/vehicle-violet.avif"),
  "Static data must reference vehicle-violet.avif under vehicle-fleet for VIolet imagery."
)
assert(
  /\bvideoMp4\s*:/.test(staticData),
  "Achievements in static-data must support optional timeline videoMp4 fields."
)
assert(
  !aboutPages.includes("vehicle-violet.svg"),
  "About pages gallery must not use the removed vehicle-violet.svg asset."
)
assert(
  aboutPages.includes("/vehicle-fleet/vehicle-violet.avif"),
  "About pages gallery must use vehicle-fleet vehicle-violet.avif for Violet imagery."
)
assert(
  teamPage.includes("TransparentNavbar") && teamPage.includes("TeamRoster"),
  "Team route must render the transparent navbar and the front-end roster component."
)
assert(
  teamPage.includes('listCmsRecords("team", "published")') &&
    /force-dynamic/.test(teamPage),
  "Team route must read published members through the CMS API facade."
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
    /data-team-department-count/.test(teamRoster),
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
  teamRoster.includes("publishedAssetKey") &&
    teamRoster.includes("hierarchyLevel") &&
    teamRoster.includes("CMS replacement"),
  "Team roster must accept extended CMS team member fields while preserving local fallbacks."
)
assert(
  teamRoster.includes('"member"') &&
    teamRoster.includes('"members"') &&
    !teamRoster.includes('"profiles"') &&
    !teamRoster.includes("member.discipline"),
  "Team roster must use member copy and stop rendering discipline badges."
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

assert(
  cmsTypes.includes("export type Partner") &&
    cmsTypes.includes("export type MediaAsset") &&
    cmsTypes.includes("publishedAssetKey") &&
    cmsTypes.includes("responsibilitiesHtml") &&
    !/export type TeamMember = \{[^}]*discipline/.test(cmsTypes) &&
    !/export type TeamMember = \{[^}]*bio/.test(cmsTypes),
  "CMS types must include extended team, recruitment, partner, and media asset records."
)
assert(
  cmsApi.includes("CMS_API_URL") &&
    cmsApi.includes("saveCmsDraft") &&
    cmsApi.includes("publishCmsDraft") &&
    cmsApi.includes("stageCmsUpload") &&
    adminActions.includes("listCmsRecords") &&
    !adminActions.includes("putTeamMember(") &&
    !adminActions.includes("putRecruitmentRole("),
  "Admin actions must call the CMS API facade rather than writing DynamoDB records directly."
)
assert(
  /Item:\s*\{\s*\.\.\.member,\s*id:\s*"team-members",\s*type:\s*itemType\("member", member\.slug, status\)/.test(
    cmsDynamodb
  ) &&
    /Item:\s*\{\s*\.\.\.role,\s*id:\s*"recruitment-roles",\s*type:\s*itemType\("role", role\.slug, status\)/.test(
      cmsDynamodb
    ) &&
    /Item:\s*\{\s*\.\.\.partner,\s*id:\s*"partners",\s*type:\s*itemType\("partner", partner\.slug, status\)/.test(
      cmsDynamodb
    ),
  "DynamoDB CMS writes must set id/type/status after spreading records so publish cannot keep draft keys."
)
assert(
  authConfig.includes("Credentials") &&
    authConfig.includes('id: "developer"') &&
    authConfig.includes("developer@sunswift.unsw.edu.au") &&
    authConfig.includes('process.env.NODE_ENV !== "production"') &&
    authConfig.includes('ENABLE_DEV_ADMIN_LOGIN !== "false"'),
  "Auth must expose a developer admin credentials provider only for non-production local regression testing."
)
assert(
  adminActions.includes("signInAsDeveloper") &&
    adminActions.includes('signIn("developer"') &&
    adminActions.includes('process.env.NODE_ENV === "production"'),
  "Admin actions must include a production-disabled developer sign-in server action."
)
assert(
  adminLoginPage.includes("data-dev-admin-login") &&
    adminLoginPage.includes(
      "Local test account: developer@sunswift.unsw.edu.au"
    ) &&
    adminLoginPage.includes("Continue with Google"),
  "Admin login must keep Google OAuth while exposing the local developer test account in non-production."
)
assert(
  adminTeamPage.includes("data-admin-team-editor"),
  "Admin team page must expose a stable editor hook for browser regression testing."
)
assert(
  adminTeamPage.includes("TEAM_DEPARTMENTS") &&
    adminTeamPage.includes("TEAM_HIERARCHIES") &&
    adminTeamPage.includes('name="department"') &&
    adminTeamPage.includes('name="hierarchyLevel"') &&
    adminTeamPage.includes("publishAllTeamMembers") &&
    !adminTeamPage.includes('name="discipline"') &&
    !adminTeamPage.includes('name="bio"') &&
    !adminTeamPage.includes("Optional override"),
  "Admin team page must gate department/hierarchy with dropdowns, expose publish-all, and hide slug/discipline/bio manual fields."
)
assert(
  packageJson.includes(
    '"verify:cms-admin": "node scripts/verify-cms-admin.mjs"'
  ) &&
    cmsAdminVerifier.includes("data-dev-admin-login") &&
    cmsAdminVerifier.includes("TEAM_DRAFT_EDIT_OK") &&
    cmsAdminVerifier.includes("public-media/placeholders/sr7-world-record.mp4"),
  "CMS admin browser regression must be wired into package scripts and cover login, draft edit, and asset records."
)
assert(
  cmsCsv.includes("importTeamCsv") &&
    cmsCsv.includes("importRecruitmentCsv") &&
    cmsCsv.includes("importPartnersCsv") &&
    cmsCsv.includes("slug: slugify(name)") &&
    !cmsCsv.includes("zID"),
  "CSV import helpers must cover team, recruitment, and partners while ignoring private and vestigial roster fields."
)
assert(
  adminShell.includes("/admin/partners") &&
    adminShell.includes("/admin/assets") &&
    adminPartnersPage.includes("data-admin-partners-import") &&
    adminAssetsPage.includes("Register heavy media"),
  "Admin dashboard must expose partners and assets CMS surfaces."
)
assert(
  partnersPage.includes('listCmsRecords("partners", "published")') &&
    partnersPageContent.includes("Partner") &&
    partnersPageContent.includes("partners.length"),
  "Partners page must render published partner summary data from the CMS API facade."
)
assert(
  cmsAssets.includes("public-media/placeholders/sr7-world-record.mp4") &&
    cmsAssets.includes("public-media/placeholders/bwsc-23-vid.mp4") &&
    cmsAssets.includes("public-media/vehicle-fleet/vehicle-ivy.jpg") &&
    staticData.includes("publicAssetPath"),
  "Heavy public media assets must be manifest-backed and routed through the public asset helper."
)

assert(
  mediaPage.includes("<MediaHighlightsPage />"),
  "Media route must render the dedicated highlights page."
)
assert(
  !mediaPage.includes("PublicContentPage"),
  "Media route must not use the generic public content shell."
)
assert(
  mediaHighlightsPage.includes("data-media-highlights-page") &&
    mediaHighlightsPage.includes("data-media-spotlight") &&
    mediaHighlightsPage.includes("data-media-spotlight-embed") &&
    mediaHighlightsPage.includes("youtube-nocookie.com/embed") &&
    mediaHighlightsPage.includes("data-media-journey") &&
    mediaHighlightsPage.includes("data-media-partnerships") &&
    mediaHighlightsPage.includes("data-media-team-highlights") &&
    mediaHighlightsPage.includes("data-media-partner-spotlights"),
  "Media highlights page must expose section hooks for browser verification."
)
assert(
  mediaHighlightsJson.includes('"featuredYoutubeId": "JGSzpsJmfHA"'),
  "Media spotlight JSON must declare the featured AWS YouTube id for the embed."
)
assert(
  mediaHighlightsPage.includes("@/content/media-highlights.json"),
  "Media highlights page must load highlights data from repo-managed JSON (Webflow mirror)."
)
const mediaHighlightsFlat = mediaHighlightsJson.replace(/\s+/g, " ")
for (const phrase of [
  "Amazon Web Services & Sunswift Racing: Solar powered journey across the Australian Outback",
  "Sunswift 7's Journey to a World Record",
  "Part 1: New Beginnings",
  "Part 2: Silver Linings",
  "Part 3: Test. Break. Fix. Repeat.",
  "Part 4: World Record Attempt",
  "Auto-UX Partners with UNSW Sunswift Racing",
  "Driving Greater Energy Efficiency with UNSW's Sunswift Racing and Altium",
  "Optiver partners with UNSW Sunswift Racing to drive innovation for a better future",
  "Sunswift at AWS Summit 2024",
  "Sunswift & Optus Remote Driving Initiative",
]) {
  assert(
    mediaHighlightsFlat.includes(phrase),
    `Media highlights JSON must include Webflow highlights phrase: ${phrase}`
  )
}
assert(
  /TransparentNavbar/.test(mediaHighlightsPage),
  "Media highlights page must use the transparent navbar like current dark public pages."
)
assert(
  !mediaHighlightsPage.includes("@/components/ui"),
  "Public media highlights page must not use shadcn UI; shadcn styling is reserved for admin."
)
assert(
  mediaHighlightsPage.includes("<JuicerSidebar") &&
    mediaHighlightsPage.includes("overflow-x-auto") &&
    mediaHighlightsPage.includes("snap-x") &&
    mediaHighlightsPage.includes("data-media-highlight-row"),
  "Media highlights page must mount the Juicer sidebar and horizontal snap-scroll rows."
)
assert(
  /data-juicer-sidebar/.test(juicerSidebar) &&
    /juicer\.io\/api\/feeds\/unsw-sunswift\/iframe/.test(juicerSidebar),
  "Juicer sidebar must expose data-juicer-sidebar and embed the Webflow unsw-sunswift Juicer feed iframe."
)
assert(
  /data-media-journey-part/.test(mediaHighlightsPage) &&
    /data-media-team-highlight/.test(mediaHighlightsPage) &&
    /data-media-partner-video/.test(mediaHighlightsPage),
  "Media highlights page must mark partnership / journey / team / partner cards with stable data hooks."
)
assert(
  /data-media-highlight-card/.test(mediaHighlightsPage),
  "Each media highlight must expose data-media-highlight-card on the link surface."
)
for (const href of [
  "https://aws.amazon.com/solutions/case-studies/unsw-sunswift-racing-case-study/",
  "https://www.altium.com/company/customer-success/driving-greater-energy-efficiency-unsws-sunswift-racing-and-altium",
  "https://www.unsw.edu.au/newsroom/news/2022/10/ev-record-breakers-sunswift-7-goes-1000km-on-a-single-charge-in-worlds-best-time",
  "https://news.unsw.edu.au/en/sunswift-7--driving-technology-forward",
  "https://www.smh.com.au/national/nsw/international-pros-contested-this-solar-car-race-sydney-students-beat-them-all-20231025-p5eezc.html",
  "https://www.auto-ux.io/resources/auto-ux-partners-with-unsw-sunswift-racing/",
]) {
  assert(
    mediaHighlightsJson.includes(href),
    `Media highlights JSON must link to ${href}`
  )
}

assert(
  contactPage.includes("<ContactPageContent />"),
  "Contact route must render the dedicated new-theme contact page."
)
assert(
  !contactPage.includes("PageFrame") && !contactPage.includes("getPublicPage"),
  "Contact route must not use the old generic PageFrame/content copy path."
)
assert(
  contactPageContent.includes("data-contact-page") &&
    contactPageContent.includes("data-contact-email-link"),
  "Contact page must expose browser verification hooks."
)
assert(
  contactPageContent.includes("mailto:") &&
    contactPageContent.includes("richard.hopkins1@unsw.edu.au"),
  "Contact page must route enquiries to richard.hopkins1@unsw.edu.au via mailto."
)
assert(
  !/<form\b/.test(contactPageContent) &&
    !/<input\b/.test(contactPageContent) &&
    !/<textarea\b/.test(contactPageContent),
  "Contact page must not render a contact form."
)
assert(
  /TransparentNavbar/.test(contactPageContent),
  "Contact page must use the transparent navbar and current dark public page language."
)
assert(
  contactPageContent.includes("data-contact-socials") &&
    contactPageContent.includes("data-contact-social-link") &&
    contactPageContent.includes("instagram.com/sunswiftracing") &&
    contactPageContent.includes("facebook.com/UNSWSunswift") &&
    contactPageContent.includes("linkedin.com/company/unsw-sunswift"),
  "Contact page must expose a social media column with Instagram, Facebook, and LinkedIn outbound links."
)

if (failures.length > 0) {
  console.error("Homepage design contract failed:")
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log("Homepage design contract passed.")
