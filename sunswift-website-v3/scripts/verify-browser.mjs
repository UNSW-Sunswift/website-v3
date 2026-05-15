import { spawnSync } from "node:child_process";

const baseUrl = process.env.VERIFY_URL ?? "http://localhost:3000";
const achievementsUrl = new URL("/achievements", baseUrl).toString();

const homepageContract = `(() => new Promise((resolve, reject) => {
  const main = document.querySelector("main[data-homepage]");
  const hero = document.querySelector("[data-homepage-hero]");
  const navbar = document.querySelector("[data-homepage-navbar]");
  const about = document.querySelector("[data-homepage-about]");
  const records = document.querySelector("[data-homepage-records]");
  const title = hero?.querySelector("h1");
  const image = hero?.querySelector("img");

  if (!main || !hero) {
    reject(new Error("MISSING_HOMEPAGE_HERO"));
    return;
  }

  if (!navbar) {
    reject(new Error("MISSING_HOMEPAGE_NAVBAR"));
    return;
  }

  const requiredLinks = ["About Us", "Who We Are", "Achievements", "Our Team", "Vehicles", "Partners", "Media", "Recruitment", "Contact"];
  const navText = navbar.textContent || "";
  const missingLink = requiredLinks.find((label) => !navText.includes(label));
  if (missingLink) {
    reject(new Error("MISSING_NAV_LINK:" + missingLink));
    return;
  }

  if (!about) {
    reject(new Error("MISSING_HOMEPAGE_ABOUT"));
    return;
  }

  const aboutText = about.innerText;
  if (!aboutText.includes("What is Sunswift Racing?")) {
    reject(new Error("MISSING_ABOUT_HEADLINE"));
    return;
  }
  if (!aboutText.includes("World Solar Challenge") || !aboutText.includes("Guinness World Records")) {
    reject(new Error("MISSING_ABOUT_COPY"));
    return;
  }

  const focusReveal = document.querySelector("[data-homepage-zoom-reveal]");
  if (!focusReveal) {
    reject(new Error("MISSING_HOMEPAGE_FOCUS_REVEAL"));
    return;
  }
  const focusHeadline = focusReveal.querySelector("[data-homepage-zoom-text]");
  const focusText = focusHeadline?.innerText ?? "";
  if (!focusHeadline || !focusText.includes("Built by Students.") || !focusText.includes("Driving Sustainability.")) {
    reject(new Error("MISSING_FOCUS_REVEAL_HEADLINE"));
    return;
  }

  if (!records) {
    reject(new Error("MISSING_HOMEPAGE_RECORDS"));
    return;
  }
  const recordCards = records.querySelectorAll("[data-homepage-record]");
  if (recordCards.length < 3) {
    reject(new Error("MISSING_RECORD_CARDS:" + recordCards.length));
    return;
  }
  const recordsText = records.innerText;
  if (!recordsText.includes("Records that move") || !recordsText.includes("1,000")) {
    reject(new Error("MISSING_RECORDS_COPY"));
    return;
  }

  if (!image) {
    reject(new Error("MISSING_HERO_IMAGE"));
    return;
  }

  if (!title) {
    reject(new Error("MISSING_SLOGAN_TITLE"));
    return;
  }

  const expected = title.dataset.fullText;
  if (expected !== "Tomorrow, Today.") {
    reject(new Error("MISSING_SLOGAN_DATA:" + expected));
    return;
  }

  const deadline = Date.now() + 5000;
  const tick = () => {
    if (title.dataset.typingComplete === "true") {
      resolve("HOMEPAGE_CONTRACT_OK");
      return;
    }
    if (Date.now() > deadline) {
      reject(new Error("TYPING_NEVER_COMPLETED:" + (title.textContent || "").trim()));
      return;
    }
    setTimeout(tick, 80);
  };
  tick();
}))()`;

const pageIsHealthy = `(() => {
  if (document.querySelector("[data-nextjs-dialog], .vite-error-overlay, #webpack-dev-server-client-overlay")) {
    throw new Error("ERROR_OVERLAY");
  }

  if (document.body.innerText.trim().length === 0) {
    throw new Error("BLANK_PAGE");
  }

  const overflow = Array.from(document.querySelectorAll("body *"))
    .filter((element) => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      const expectedMotion =
        element.matches(".homepage-hero-image, .homepage-zoom-render, .homepage-zoom-sweep") ||
        element.closest(".homepage-zoom-render, [data-achievements-timeline]") ||
        (element.closest("[data-achievements-page]") && style.position === "absolute");
      return !expectedMotion && rect.width > 0 && rect.height > 0 && style.position !== "fixed" && (rect.left < -1 || rect.right > window.innerWidth + 1);
    })
    .slice(0, 3)
    .map((element) => element.tagName.toLowerCase());

  if (overflow.length > 0) {
    throw new Error(\`HORIZONTAL_OVERFLOW:\${overflow.join(",")}\`);
  }

  return "OK";
})()`;

const scrollEffectWorks = `(() => new Promise((resolve, reject) => {
  const hero = document.querySelector("[data-homepage-hero]");

  if (!hero) {
    reject(new Error("MISSING_HOMEPAGE_HERO"));
    return;
  }

  const before = getComputedStyle(hero).getPropertyValue("--hero-title-y").trim();
  window.scrollTo(0, Math.max(window.innerHeight * 0.55, 1));
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const after = getComputedStyle(hero).getPropertyValue("--hero-title-y").trim();
      window.scrollTo(0, 0);

      if (before === after || after === "0rem") {
        reject(new Error(\`SCROLL_EFFECT_STATIC:\${before}->\${after}\`));
        return;
      }

      resolve(\`SCROLL_EFFECT_OK:\${before}->\${after}\`);
    });
  });
}))()`;

const focusRevealEffectWorks = `(() => new Promise((resolve, reject) => {
  const reveal = document.querySelector("[data-homepage-zoom-reveal]");
  const headline = document.querySelector("[data-homepage-zoom-text]");

  if (!reveal || !headline) {
    reject(new Error("MISSING_HOMEPAGE_FOCUS_REVEAL"));
    return;
  }

  const before = getComputedStyle(headline);
  const beforeFilter = before.filter;
  const beforeTracking = before.letterSpacing;

  reveal.scrollIntoView({ block: "start" });
  window.scrollBy(0, Math.max(window.innerHeight * 0.72, 1));

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const after = getComputedStyle(headline);
      const afterTransform = after.transform;
      const afterFilter = after.filter;
      const afterTracking = after.letterSpacing;
      const afterScale = afterTransform.includes("matrix(") ? afterTransform.match(/matrix\\(([^)]+)\\)/)?.[1]?.split(",").slice(0, 4).map((value) => Number(value.trim())) : null;

      window.scrollTo(0, 0);

      if (beforeFilter === afterFilter && beforeTracking === afterTracking) {
        reject(new Error("FOCUS_REVEAL_STATIC"));
        return;
      }

      if (afterScale && (Math.abs(afterScale[0] - 1) > 0.03 || Math.abs(afterScale[3] - 1) > 0.03 || Math.abs(afterScale[1]) > 0.03 || Math.abs(afterScale[2]) > 0.03)) {
        reject(new Error("FOCUS_REVEAL_USES_ZOOM:" + afterTransform));
        return;
      }

      resolve(\`FOCUS_REVEAL_OK:\${beforeFilter}->\${afterFilter}\`);
    });
  });
}))()`;

const achievementsContract = `(() => new Promise((resolve, reject) => {
  const page = document.querySelector("[data-achievements-page]");
  const rail = document.querySelector("[data-achievements-timeline]");
  const intro = document.querySelector("[data-achievements-intro]");
  const currentCopy = document.querySelector("[data-achievements-current-copy]");
  const minimalCopy = document.querySelector("[data-achievements-minimal-copy]");
  const yearRail = document.querySelector("[data-achievements-year-rail]");
  const yearProgress = document.querySelector("[data-achievements-year-progress]");
  const cards = Array.from(document.querySelectorAll("[data-achievement-card]"));

  if (!page || !rail) {
    reject(new Error("MISSING_ACHIEVEMENTS_TIMELINE"));
    return;
  }

  if (!intro || !currentCopy || !minimalCopy || !yearRail || !yearProgress) {
    reject(new Error("MISSING_ACHIEVEMENTS_SCROLL_UI"));
    return;
  }

  if (cards.length < 18) {
    reject(new Error("MISSING_ACHIEVEMENT_CARDS:" + cards.length));
    return;
  }

  const text = document.body.innerText;
  for (const phrase of ["A timeline of solar racing milestones", "Bridgestone World Solar Challenge '23", "Guinness World Record '22", "World Solar Challenge '96"]) {
    if (!text.includes(phrase)) {
      reject(new Error("MISSING_ACHIEVEMENT_COPY:" + phrase));
      return;
    }
  }

  const beforeYear = page.getAttribute("data-active-year");
  const beforeTransform = getComputedStyle(rail).transform;
  const beforeIntroOpacity = Number(getComputedStyle(intro).opacity);
  const beforeMinimalOpacity = Number(getComputedStyle(minimalCopy).opacity);
  const beforeProgressWidth = yearProgress.getBoundingClientRect().width;

  const sectionTop = page.getBoundingClientRect().top + window.scrollY;
  window.scrollTo(0, sectionTop + Math.max(window.innerHeight * 2.2, 1));

  setTimeout(() => {
      const afterYear = page.getAttribute("data-active-year");
      const afterTransform = getComputedStyle(rail).transform;
      const afterIntroOpacity = Number(getComputedStyle(intro).opacity);
      const afterMinimalOpacity = Number(getComputedStyle(minimalCopy).opacity);
      const afterProgressWidth = yearProgress.getBoundingClientRect().width;

      window.scrollTo(0, 0);

      if (!beforeYear || !afterYear || beforeYear === afterYear) {
        reject(new Error(\`ACHIEVEMENTS_SCROLL_STATIC:\${beforeYear}->\${afterYear}\`));
        return;
      }

      if (beforeTransform === afterTransform || afterTransform === "none") {
        reject(new Error("ACHIEVEMENTS_RAIL_STATIC:" + beforeTransform + "->" + afterTransform));
        return;
      }

      if (!(afterIntroOpacity < beforeIntroOpacity) || !(afterMinimalOpacity > beforeMinimalOpacity)) {
        reject(new Error(\`ACHIEVEMENTS_COPY_FADE_STATIC:\${beforeIntroOpacity}->\${afterIntroOpacity}/\${beforeMinimalOpacity}->\${afterMinimalOpacity}\`));
        return;
      }

      if (!(afterProgressWidth > beforeProgressWidth)) {
        reject(new Error(\`ACHIEVEMENTS_YEAR_PROGRESS_STATIC:\${beforeProgressWidth}->\${afterProgressWidth}\`));
        return;
      }

      resolve(\`ACHIEVEMENTS_CONTRACT_OK:\${beforeYear}->\${afterYear}\`);
  }, 250);
}))()`;

const commands = [
  ["open", baseUrl],
  ["set", "viewport", "1440", "1000"],
  ["reload"],
  ["wait", "--load", "networkidle"],
  ["eval", pageIsHealthy],
  ["eval", homepageContract],
  ["eval", scrollEffectWorks],
  ["eval", focusRevealEffectWorks],
  ["screenshot", "--annotate"],
  ["snapshot", "-i"],
  ["set", "viewport", "390", "844"],
  ["reload"],
  ["wait", "--load", "networkidle"],
  ["eval", pageIsHealthy],
  ["eval", homepageContract],
  ["eval", scrollEffectWorks],
  ["eval", focusRevealEffectWorks],
  ["screenshot", "--annotate"],
  ["snapshot", "-i"],
  ["open", achievementsUrl],
  ["wait", "--load", "networkidle"],
  ["eval", pageIsHealthy],
  ["eval", achievementsContract],
  ["screenshot", "--annotate"],
  ["snapshot", "-i"],
];

function run(args, allowFailure = false) {
  const result = spawnSync("agent-browser", args, {
    stdio: "inherit",
    env: process.env,
  });

  if (!allowFailure && result.status !== 0) {
    spawnSync("agent-browser", ["close"], { stdio: "ignore" });
    process.exit(result.status ?? 1);
  }
}

for (const args of commands) {
  run(args);
}

run(["close"], true);
