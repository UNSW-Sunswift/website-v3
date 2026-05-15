import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const page = readFileSync(join(root, "app/page.tsx"), "utf8");
const hero = readFileSync(join(root, "components/site/homepage-hero.tsx"), "utf8");
const navbar = readFileSync(join(root, "components/site/transparent-navbar.tsx"), "utf8");
const about = readFileSync(join(root, "components/site/homepage-about.tsx"), "utf8");
const records = readFileSync(join(root, "components/site/homepage-records.tsx"), "utf8");
const zoomReveal = readFileSync(join(root, "components/site/homepage-zoom-reveal.tsx"), "utf8");
const vehiclesPage = readFileSync(join(root, "app/(public)/vehicles/page.tsx"), "utf8");
const vehiclesGallery = readFileSync(join(root, "components/site/vehicles-gallery.tsx"), "utf8");
const achievementsPage = readFileSync(join(root, "app/(public)/achievements/page.tsx"), "utf8");
const achievementsTimeline = readFileSync(join(root, "components/site/achievements-timeline.tsx"), "utf8");
const siteShell = readFileSync(join(root, "components/site/site-shell.tsx"), "utf8");
const themeProvider = readFileSync(join(root, "components/theme-provider.tsx"), "utf8");
const globalsCss = readFileSync(join(root, "app/globals.css"), "utf8");
const staticData = readFileSync(join(root, "lib/cms/static-data.ts"), "utf8");

const failures = [];

function assert(condition, message) {
  if (!condition) {
    failures.push(message);
  }
}

assert(
  !existsSync(join(root, "components/site/opal-homepage-hero.tsx")),
  "Legacy opal-homepage-hero.tsx must not exist; rename to homepage-hero.tsx.",
);

const opalReferences = [page, hero, navbar, about, records, zoomReveal].some((source) => /opal/i.test(source));
assert(!opalReferences, "Homepage source files must not mention Opal.");

assert(page.includes("<HomepageHero />"), "Homepage must render the dedicated homepage hero component.");
assert(page.includes("<TransparentNavbar />"), "Homepage must render the transparent navbar component.");
assert(!page.includes("<HomepageStatement"), "Homepage must no longer render the removed HomepageStatement section.");
assert(page.includes("<HomepageZoomReveal />"), "Homepage must render the zoom-reveal scroll section.");
assert(page.includes("<HomepageAbout />"), "Homepage must render the about section component.");
assert(page.includes("<HomepageRecords />"), "Homepage must render the Guinness records section component.");

assert(!existsSync(join(root, "components/site/homepage-statement.tsx")), "components/site/homepage-statement.tsx must be deleted; the zoom-reveal supersedes it.");

const heroIdx = page.indexOf("<HomepageHero")
const zoomIdx = page.indexOf("<HomepageZoomReveal")
const aboutIdx = page.indexOf("<HomepageAbout")
const recordsIdx = page.indexOf("<HomepageRecords")
assert(heroIdx < zoomIdx && zoomIdx < aboutIdx && aboutIdx < recordsIdx, "Page order must be Hero -> ZoomReveal -> About -> Records.");

assert(zoomReveal.includes("data-homepage-zoom-reveal"), "Zoom-reveal section must expose data-homepage-zoom-reveal for verification.");
assert(zoomReveal.includes("data-homepage-zoom-text"), "Zoom-reveal section must expose data-homepage-zoom-text on the headline.");
assert(zoomReveal.includes("data-homepage-vehicle-render"), "Zoom-reveal section must expose data-homepage-vehicle-render as the live-render placeholder slot.");
assert(zoomReveal.includes("Built by Students."), "Zoom-reveal headline must include 'Built by Students.'.");
assert(zoomReveal.includes("Driving Sustainability."), "Zoom-reveal headline must include 'Driving Sustainability.'.");
assert(zoomReveal.includes("useEffect"), "Zoom-reveal section must be scroll-reactive via useEffect.");
assert(/window\.addEventListener\("scroll"/.test(zoomReveal), "Zoom-reveal section must listen to scroll events to drive the focus reveal.");
assert(!/--zoom-scale/.test(zoomReveal), "Zoom-reveal headline must not use --zoom-scale; this section should no longer zoom in.");
assert(/--zoom-blur/.test(zoomReveal), "Zoom-reveal section must drive a --zoom-blur custom property for the focus effect.");
assert(/--zoom-text-y/.test(zoomReveal), "Zoom-reveal section must drive a --zoom-text-y custom property for the glide effect.");
assert(/--zoom-sweep-x/.test(zoomReveal), "Zoom-reveal section must drive a --zoom-sweep-x custom property for the light sweep.");
assert(/--zoom-opacity/.test(zoomReveal), "Zoom-reveal section must drive a --zoom-opacity custom property.");
assert(/--zoom-text-color/.test(zoomReveal), "Zoom-reveal section must drive a --zoom-text-color custom property so the headline darkens on scroll.");
assert(/rgb\(\$\{channel\},\s*\$\{channel\},\s*\$\{channel\}\)/.test(zoomReveal), "Zoom-reveal must interpolate the headline tone from a gray channel to black on scroll.");
assert(/homepage-zoom-sweep/.test(zoomReveal), "Zoom-reveal section must render the moving light sweep overlay.");
assert(/font-thin/.test(zoomReveal), "Zoom-reveal headline must use font-thin (Inter 100).");
assert(/h-\[180svh\]/.test(zoomReveal), "Zoom-reveal section must reserve tall scroll distance (~180svh) to drive the animation.");
assert(/sticky\s+top-0/.test(zoomReveal), "Zoom-reveal section must use a sticky inner stage.");
assert(/bg-\[#f6f5f1\]|bg-white/.test(zoomReveal), "Zoom-reveal section must use a light canvas so the headline can darken from gray to black.");
assert(!/bg-black/.test(zoomReveal), "Zoom-reveal section must not use a black canvas; the tone shift requires a light background.");
assert(!/text-shadow:[^;]*rgba\(0,\s*0,\s*0,\s*0\.5/.test(zoomReveal), "Zoom-reveal headline must not carry a heavy dark text-shadow on the light canvas.");

assert(/\.homepage-zoom-text\s*{/.test(globalsCss), "globals.css must style the .homepage-zoom-text helper.");
assert(/\.homepage-zoom-render\s*{/.test(globalsCss), "globals.css must style the .homepage-zoom-render helper.");
assert(/\.homepage-zoom-sweep\s*{/.test(globalsCss), "globals.css must style the .homepage-zoom-sweep helper.");
assert(!/transform:\s*scale\(var\(--zoom-scale\)\)/.test(globalsCss), ".homepage-zoom-text must not scale with --zoom-scale.");
assert(/transform:\s*translate3d\(0,\s*var\(--zoom-text-y\),\s*0\)/.test(globalsCss), ".homepage-zoom-text must glide via --zoom-text-y instead of scaling.");
assert(/filter:\s*blur\(var\(--zoom-blur\)\)/.test(globalsCss), ".homepage-zoom-text must read --zoom-blur for the focus effect.");
assert(/color:\s*var\(--zoom-text-color\)/.test(globalsCss), ".homepage-zoom-text must read the --zoom-text-color custom property for its colour.");
assert(/opacity:\s*var\(--zoom-render-opacity\)/.test(globalsCss), ".homepage-zoom-render must read the --zoom-render-opacity custom property so the render fades in on scroll.");

assert(hero.includes("data-homepage-hero"), "Hero must expose data-homepage-hero for browser verification.");
assert(hero.includes('"Tomorrow, Today."'), "Hero must use the slogan 'Tomorrow, Today.' with the trailing period.");
assert(hero.includes("useEffect"), "Hero must include scroll-reactive behavior.");
assert(/setInterval|setTimeout/.test(hero), "Hero must drive the typing animation with a timer.");
assert(hero.includes("data-full-text"), "Hero must expose data-full-text for the typing animation.");
assert(hero.includes("homepage-hero-caret"), "Hero must render the typewriter caret element.");
assert(/sr-only/.test(hero), "Hero must keep an accessible copy of the slogan for screen readers.");
assert(!hero.includes("@/components/ui"), "Hero must not import shadcn UI components.");

assert(navbar.includes("data-homepage-navbar"), "Navbar must expose data-homepage-navbar for verification.");
assert(/bg-transparent/.test(navbar), "Navbar must be transparent.");
for (const label of ["About Us", "Our Team", "Vehicles", "Partners", "Media", "Recruitment", "Contact"]) {
  assert(navbar.includes(label), `Navbar must include the ${label} link.`);
}
assert(/data-about-dropdown/.test(navbar), "Transparent navbar must expose the About Us dropdown.");
assert(/<button[^]*About Us[^]*ChevronDown/.test(navbar), "Transparent navbar About Us item must be a dropdown button with a chevron arrow.");
assert(navbar.includes("Who We Are"), "Transparent navbar About Us dropdown must include Who We Are.");
assert(navbar.includes("/who-we-are"), "Transparent navbar Who We Are dropdown item must link to /who-we-are.");
assert(navbar.includes("Achievements"), "Transparent navbar About Us dropdown must include Achievements.");
assert(navbar.includes("/achievements"), "Transparent navbar Achievements dropdown item must link to /achievements.");
assert(/ArrowUpRight/.test(navbar), "Transparent navbar dropdown must use directional link arrows instead of plain menu rows.");
assert(/backdrop-blur-2xl/.test(navbar), "Transparent navbar dropdown must use a deeper glass treatment.");

const aboutFlat = about.replace(/\s+/g, " ");
assert(about.includes("data-homepage-about"), "About section must expose data-homepage-about for verification.");
assert(aboutFlat.includes("What is Sunswift Racing?"), "About section must include the Sunswift headline.");
assert(aboutFlat.includes("World Solar Challenge"), "About section must include the World Solar Challenge copy.");
assert(aboutFlat.includes("Sydney, Australia since 1996"), "About section must include the Sydney since 1996 copy.");
assert(aboutFlat.includes("Guinness World Records"), "About section must include the Guinness World Records copy.");

const recordsFlat = records.replace(/\s+/g, " ");
assert(records.includes("data-homepage-records"), "Records section must expose data-homepage-records for verification.");
assert(records.includes("data-homepage-record"), "Records section must mark each record card with data-homepage-record.");
assert(!/font-mono[^"]*"\s*>\s*Guinness World Records/.test(records), "Records section must not display a 'Guinness World Records' kicker label.");
assert(recordsFlat.includes("Records that move"), "Records section must include the headline.");
assert(recordsFlat.includes("1,000"), "Records section must surface the 1,000 km distance record.");
assert(recordsFlat.includes("single charge"), "Records section must describe the single-charge distance record.");
for (const recordId of ["thousand-km", "speed-record", "world-firsts"]) {
  assert(records.includes(recordId), `Records section must include the ${recordId} record entry.`);
}

// Vehicles gallery contract.
assert(vehiclesPage.includes("<VehiclesGallery"), "Vehicles route must mount the VehiclesGallery component.");
assert(vehiclesPage.includes("<TransparentNavbar />"), "Vehicles route must render the transparent navbar overlay.");

assert(vehiclesGallery.includes("data-vehicles-gallery"), "Vehicles gallery must expose data-vehicles-gallery for verification.");
assert(vehiclesGallery.includes("data-vehicle-card"), "Vehicles gallery must mark each card with data-vehicle-card.");
assert(vehiclesGallery.includes("data-vehicle-slug"), "Vehicles gallery must expose data-vehicle-slug on each card.");
assert(vehiclesGallery.includes("data-vehicle-detail"), "Vehicles gallery must expose data-vehicle-detail for the detail view.");
assert(vehiclesGallery.includes("data-clicking"), "Vehicles gallery must drive a click animation via data-clicking state.");

// Scope the card-specific checks to the gallery section only (above the detail view).
const detailSplitIdx = vehiclesGallery.indexOf("function VehicleDetail");
assert(detailSplitIdx > 0, "Vehicles gallery file must export a VehicleDetail function for the detail view.");
const gallerySection = detailSplitIdx > 0 ? vehiclesGallery.slice(0, detailSplitIdx) : vehiclesGallery;

assert(/gap-0/.test(gallerySection), "Vehicles gallery cards must sit edge-to-edge with gap-0.");

// Extract the card <button>'s outermost className so corner/border checks only target the card surface itself.
const cardClassMatch = gallerySection.match(/aria-label=\{`Open[^]*?className=\{\[([^]*?)\]\.join\(" "\)\}/);
assert(cardClassMatch !== null, "Vehicle card must declare its className via the join-array pattern.");
const cardClassNames = cardClassMatch ? cardClassMatch[1] : "";
assert(!/rounded-(xl|lg|md|2xl|3xl)/.test(cardClassNames), "Vehicle card surface must have square corners (no rounded utilities).");
assert(!/\bborder\s+border-white\/(10|15|20|25)/.test(cardClassNames), "Vehicle card surface must not carry a hairline white border.");

assert(/pointer-events-none[^"]*absolute[^"]*bottom-0[^"]*bg-transparent/.test(gallerySection), "Vehicles gallery footer must be an absolutely positioned transparent overlay.");

assert(/pb-(40|44|48|52|56|60)/.test(gallerySection), "Vehicle card content must reserve enough bottom padding so the title clears the footer overlay.");

assert(!/right-4 top-4[^]*?\+\s*<\/span>/.test(gallerySection), "Vehicles cards must not render the redundant yellow + indicator at the top-right.");
assert(!/>\s*\+\s*<\/span>/.test(gallerySection), "Vehicles cards must not render the redundant + indicator.");

assert(!/shadow-\[[^\]]*rgba\(\s*245\s*,\s*208\s*,\s*0/.test(gallerySection), "Vehicles cards must not carry a yellow glow shadow on the click state.");

assert(/data-vehicle-name/.test(gallerySection), "Vehicles cards must render a data-vehicle-name element so every car's name is visible.");
assert(/writingMode:\s*"vertical-rl"/.test(gallerySection), "Vehicles card names must use writing-mode: vertical-rl to read top-to-bottom.");
assert(/vehicle-name-vertical/.test(gallerySection), "Vehicles card names must carry the vehicle-name-vertical class hook.");

const nameSpanMatch = gallerySection.match(/data-vehicle-name[^]*?<\/span>/);
assert(nameSpanMatch !== null, "Vehicles gallery must include a data-vehicle-name span block.");
const nameSpan = nameSpanMatch ? nameSpanMatch[0] : "";
assert(/\bright-4\b/.test(nameSpan), "Vehicle name must be anchored to the right edge of the card.");
assert(/sm:right-6/.test(nameSpan), "Vehicle name responsive anchor must remain on the right edge at sm.");
assert(!/\bleft-4\b/.test(nameSpan), "Vehicle name must not be anchored to the left edge anymore.");
assert(/font-thin/.test(nameSpan), "Vehicle name must use font-thin (Inter 100).");

assert(/\.vehicle-name-vertical\s*{/.test(globalsCss), "globals.css must style the .vehicle-name-vertical helper.");
assert(/font-family:\s*var\(--font-inter\)/.test(globalsCss), ".vehicle-name-vertical must declare the Inter font family.");
assert(/font-weight:\s*100/.test(globalsCss), ".vehicle-name-vertical must set font-weight: 100 (Inter Thin).");

const layoutSource = readFileSync(join(root, "app/layout.tsx"), "utf8");
assert(/from\s+"next\/font\/google"/.test(layoutSource), "Root layout must load fonts via next/font/google.");
assert(/Inter\(/.test(layoutSource), "Root layout must load the Inter font.");
assert(/weight:\s*\[[^\]]*"100"/.test(layoutSource), "Root layout must request Inter weight 100 (Thin).");
assert(/variable:\s*"--font-inter"/.test(layoutSource), "Root layout must expose Inter via the --font-inter CSS variable.");
assert(/className=\{inter\.variable\}/.test(layoutSource), "Root <html> must apply the Inter font variable class.");

assert(/data-homepage-vignette/.test(gallerySection), "Vehicles gallery footer area must include a vignette overlay (data-homepage-vignette).");
const vignetteMatch = gallerySection.match(/data-homepage-vignette[^]*?\/>/);
const vignetteBlock = vignetteMatch ? vignetteMatch[0] : "";
assert(/pointer-events-none/.test(vignetteBlock), "Vignette overlay must be pointer-events-none.");
assert(/linear-gradient\(180deg/.test(vignetteBlock), "Vignette overlay must use a vertical linear-gradient.");
assert(/#000|rgba\(10,12,14,0?\.9/.test(vignetteBlock), "Vignette overlay must fade to (near-)black at the bottom.");

assert(/data-homepage-top-vignette/.test(gallerySection), "Vehicles gallery must include a top vignette behind the navbar.");
const topVignetteMatch = gallerySection.match(/data-homepage-top-vignette[^]*?\/>/);
const topVignetteBlock = topVignetteMatch ? topVignetteMatch[0] : "";
assert(/pointer-events-none/.test(topVignetteBlock), "Top vignette must be pointer-events-none.");
assert(/top-0/.test(topVignetteBlock), "Top vignette must be anchored to the top of the gallery.");
assert(/linear-gradient\(180deg,\s*#000/.test(topVignetteBlock), "Top vignette must start from black at the top and fade downward.");

assert(/slug:\s*"sunswift-8"/.test(staticData), "Vehicles dataset must include the sunswift-8 entry.");

const expectedNames = [
  { slug: '"sunswift-8"', pattern: /^SR-?8$/, label: "SR8 / SR-8" },
  { slug: '"sunswift-7"', pattern: /^SR-?7$/, label: "SR7 / SR-7" },
  { slug: '"sunswift-iii"', pattern: /^SR-?III$/, label: "SRIII / SR-III" },
  { slug: '"sunswift-ii"', pattern: /^SR-?II$/, label: "SRII / SR-II" },
  { slug: '"sunswift-i"', pattern: /^SR-?I$/, label: "SRI / SR-I" },
  { slug: '"ivy"', pattern: /^IVy$/, label: "IVy" },
  { slug: '"eve"', pattern: /^eVe$/, label: "eVe" },
  { slug: '"violet"', pattern: /^VIolet$/, label: "VIolet" },
];
for (const { slug, pattern, label } of expectedNames) {
  const slugIdx = staticData.indexOf(`slug: ${slug}`);
  assert(slugIdx >= 0, `Vehicles dataset must declare slug ${slug}.`);
  const blockEnd = staticData.indexOf("relatedPosts", slugIdx);
  const block = blockEnd > slugIdx ? staticData.slice(slugIdx, blockEnd) : "";
  const nameMatch = block.match(/name:\s*"([^"]+)"/);
  const nameValue = nameMatch ? nameMatch[1] : "";
  assert(pattern.test(nameValue), `Vehicle ${slug} must use the abbreviated name (${label}), got "${nameValue}".`);
  assert(!/name:\s*"Sunswift\s/.test(block), `Vehicle ${slug} must not keep the 'Sunswift ' prefix in its display name.`);
}

assert(/vehicle-card-rise/.test(globalsCss), "globals.css must define the vehicle-card-rise keyframe.");
assert(/vehicle-click-pulse/.test(globalsCss), "globals.css must define the vehicle-click-pulse keyframe.");
assert(/vehicle-detail-in/.test(globalsCss), "globals.css must define the vehicle-detail-in keyframe.");

// Theme contract.
assert(/forcedTheme="light"/.test(themeProvider), "ThemeProvider must force the public site to light mode.");
assert(!/setTheme\("dark"\)|setTheme\(resolvedTheme === "dark"/.test(themeProvider), "ThemeProvider must not expose a dark-mode toggle hotkey.");

assert(/--primary:\s*oklch\(0\.1[0-9]/.test(globalsCss), "Primary token must be a near-black colour.");
assert(/--primary-foreground:\s*oklch\(1 /.test(globalsCss), "Primary foreground must be white.");
assert(/--accent-yellow:/.test(globalsCss), "globals.css must declare an --accent-yellow token.");
assert(/--color-accent-yellow:/.test(globalsCss), "globals.css must expose --color-accent-yellow to Tailwind.");
assert(/--radius:\s*0?\.[0-3]/.test(globalsCss), "Radius must be small (square-ish) for the liquid-glass look.");

// Shared site shell glass + yellow-on-hover contract.
assert(/backdrop-blur-xl/.test(siteShell), "Shared site shell must use backdrop-blur for liquid-glass surfaces.");
assert(/bg-white\/(55|60|65|70|75|80)/.test(siteShell), "Shared site shell must use a translucent white background.");
assert(/hover:bg-accent-yellow/.test(siteShell), "Shared site shell must reserve accent-yellow for hover states.");
assert(/hover:text-accent-yellow/.test(siteShell), "Shared site shell nav links must hover to accent-yellow.");

assert(/hover:bg-accent-yellow/.test(navbar), "Transparent navbar Join CTA must swap to accent-yellow on hover.");
assert(/hover:text-accent-yellow/.test(navbar), "Transparent navbar links must hover to accent-yellow.");

assert(/data-about-dropdown/.test(siteShell), "Shared site shell must expose the About Us dropdown.");
assert(/<button[^]*About Us[^]*ChevronDown/.test(siteShell), "Shared site shell About Us item must be a dropdown button with a chevron arrow.");
assert(/ArrowUpRight/.test(siteShell), "Shared site shell dropdown must use directional link arrows instead of plain menu rows.");
assert(siteShell.includes("Who We Are"), "Shared site shell About Us dropdown must include Who We Are.");
assert(siteShell.includes("/achievements"), "Shared site shell About Us dropdown must link to Achievements.");

assert(achievementsPage.includes("<TransparentNavbar />"), "Achievements route must render the transparent navbar.");
assert(achievementsPage.includes("<AchievementsTimeline"), "Achievements route must mount the AchievementsTimeline component.");
assert(/data-achievements-page/.test(achievementsTimeline), "Achievements timeline must expose data-achievements-page.");
assert(/data-achievements-timeline/.test(achievementsTimeline), "Achievements timeline must expose data-achievements-timeline.");
assert(/data-achievements-stage/.test(achievementsTimeline), "Achievements timeline must expose the sticky scroll stage.");
assert(/data-achievements-intro-section/.test(achievementsTimeline), "Achievements intro copy must live in its own opening section.");
assert(/data-achievements-scroll-section/.test(achievementsTimeline), "Achievements scroll-driven timeline must live in a separate scroll section.");
assert(/data-achievements-intro/.test(achievementsTimeline), "Achievements timeline must expose the intro copy block.");
assert(/data-achievements-current-copy/.test(achievementsTimeline), "Achievements timeline must expose the fading current-copy block.");
assert(/data-achievements-minimal-copy/.test(achievementsTimeline), "Achievements timeline must expose minimal copy for the scrolled state.");
assert(/data-achievements-year-rail/.test(achievementsTimeline), "Achievements timeline must include a bottom year rail.");
assert(/data-achievements-year-progress/.test(achievementsTimeline), "Achievements timeline must include a progress indicator on the bottom year rail.");
assert(/data-achievement-year-marker/.test(achievementsTimeline), "Achievements timeline must render year markers on the bottom rail.");
assert(/data-achievement-card/.test(achievementsTimeline), "Achievements timeline must mark each horizontal card.");
assert(/data-achievements-timeline-viewport/.test(achievementsTimeline), "Achievements timeline must use a clipped viewport so cards stay visible in the sticky stage.");
assert(/h-\[clamp\(5\.75rem,14svh,8\.25rem\)\]/.test(achievementsTimeline), "Achievement cards must use viewport-aware compact heights.");
assert(/w-\[58vw\]/.test(achievementsTimeline) && /sm:w-\[31vw\]/.test(achievementsTimeline) && /lg:w-\[17vw\]/.test(achievementsTimeline), "Achievement cards must resize responsively across mobile, tablet, and desktop.");
assert(/data-active-year/.test(achievementsTimeline), "Achievements page must expose the active year.");
assert(/window\.addEventListener\("scroll"/.test(achievementsTimeline), "Achievements timeline must listen to vertical scroll events.");
assert(/section\.offsetHeight - window\.innerHeight/.test(achievementsTimeline), "Achievements timeline must derive progress from vertical scroll distance.");
assert(/rail\.scrollWidth - stage\.clientWidth/.test(achievementsTimeline), "Achievements timeline must translate across the horizontal rail width.");
assert(/--achievements-track-x/.test(achievementsTimeline), "Achievements timeline must expose a transform variable for the horizontal rail.");
assert(/translate3d\(-\$\{translateX\}px/.test(achievementsTimeline), "Achievements timeline must translate the rail horizontally from vertical scroll progress.");
assert(!/overflow-x-auto/.test(achievementsTimeline), "Achievements timeline should be driven by vertical scroll, not manual horizontal overflow.");
assert(!/snap-x/.test(achievementsTimeline), "Achievements timeline should not rely on snap-x now that vertical scroll drives the rail.");
assert(/setTimelineState/.test(achievementsTimeline), "Achievements timeline must update active state as the user scrolls.");
assert(/activeAchievement\?\.image|achievement\.image/.test(achievementsTimeline), "Achievements timeline must render media driven by the active achievement data.");

const introSectionIdx = achievementsTimeline.indexOf("data-achievements-intro-section");
const scrollSectionIdx = achievementsTimeline.indexOf("data-achievements-scroll-section");
const stageIdx = achievementsTimeline.indexOf("data-achievements-stage");
assert(introSectionIdx >= 0 && scrollSectionIdx > introSectionIdx && stageIdx > scrollSectionIdx, "Achievements intro must appear before the separate sticky timeline section.");
assert(/achievementsOverview/.test(staticData), "Static data must include the Webflow-sourced achievements overview.");
assert(/export const achievements/.test(staticData), "Static data must export achievements.");
for (const phrase of [
  "Bridgestone World Solar Challenge '23",
  "Optus Remote Driving Initiative",
  "Guinness World Record '22",
  "FIA Land Speed Record",
  "World Solar Challenge '96",
]) {
  assert(staticData.includes(phrase), `Achievements data must include ${phrase}.`);
}

if (failures.length > 0) {
  console.error("Homepage design contract failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Homepage design contract passed.");
