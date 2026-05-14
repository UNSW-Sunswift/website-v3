import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const page = readFileSync(join(root, "app/page.tsx"), "utf8");
const hero = readFileSync(join(root, "components/site/opal-homepage-hero.tsx"), "utf8");

const failures = [];

function assert(condition, message) {
  if (!condition) {
    failures.push(message);
  }
}

assert(page.includes("<OpalHomepageHero />"), "Homepage must render the dedicated Opal-style hero component.");
assert(!/PageFrame|SiteHeader|SiteFooter|Button|MetricStrip|SplitStatement|CtaBand/.test(page), "Homepage must not use shell, shadcn controls, or section content.");
assert(!/href=|<Link\b/.test(page), "Homepage must not render navigation links.");
assert(hero.includes("data-homepage-hero"), "Hero must expose data-homepage-hero for browser verification.");
assert(hero.includes("Tomorrow,"), "Hero must include the first slogan line.");
assert(hero.includes("Today"), "Hero must include the second slogan line.");
assert(hero.includes("useEffect"), "Hero must include scroll-reactive behavior.");
assert(!hero.includes("@/components/ui"), "Hero must not import shadcn UI components.");
assert(!/<p\b|<a\b|<button\b|<nav\b|<header\b|<footer\b/.test(hero), "Hero must only render image and slogan content.");

if (failures.length > 0) {
  console.error("Homepage design contract failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Homepage design contract passed.");
