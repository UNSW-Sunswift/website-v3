import { spawnSync } from "node:child_process";

const baseUrl = process.env.VERIFY_URL ?? "http://localhost:3000";

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

  const requiredLinks = ["About Us", "Our Team", "Vehicles", "Partners", "Media", "Recruitment", "Contact"];
  const navText = navbar.innerText;
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

  const statement = document.querySelector("[data-homepage-statement]");
  if (!statement) {
    reject(new Error("MISSING_HOMEPAGE_STATEMENT"));
    return;
  }
  const statementH2 = statement.querySelector("h2");
  if (!statementH2 || statementH2.innerText.trim().length < 8) {
    reject(new Error("MISSING_STATEMENT_HEADLINE"));
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
      return !element.matches(".homepage-hero-image") && rect.width > 0 && rect.height > 0 && style.position !== "fixed" && (rect.left < -1 || rect.right > window.innerWidth + 1);
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

const commands = [
  ["open", baseUrl],
  ["set", "viewport", "1440", "1000"],
  ["reload"],
  ["wait", "--load", "networkidle"],
  ["screenshot", "--annotate"],
  ["eval", pageIsHealthy],
  ["eval", homepageContract],
  ["eval", scrollEffectWorks],
  ["snapshot", "-i"],
  ["set", "viewport", "390", "844"],
  ["reload"],
  ["wait", "--load", "networkidle"],
  ["screenshot", "--annotate"],
  ["eval", pageIsHealthy],
  ["eval", homepageContract],
  ["eval", scrollEffectWorks],
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
