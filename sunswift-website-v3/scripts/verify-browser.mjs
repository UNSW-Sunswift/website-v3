import { spawnSync } from "node:child_process";

const baseUrl = process.env.VERIFY_URL ?? "http://localhost:3000";

const homepageContract = `(() => {
  const main = document.querySelector("main[data-homepage]");
  const hero = document.querySelector("[data-homepage-hero]");
  const title = hero?.querySelector("h1");
  const image = hero?.querySelector("img");

  if (!main || !hero) {
    throw new Error("MISSING_HOMEPAGE_HERO");
  }

  if (!title || title.textContent.replace(/\\s+/g, "").trim() !== "Tomorrow,Today") {
    throw new Error("MISSING_SLOGAN");
  }

  if (!image) {
    throw new Error("MISSING_HERO_IMAGE");
  }

  if (main.querySelector("a, button, nav, header, footer, p")) {
    throw new Error("HOMEPAGE_HAS_EXTRA_CHROME");
  }

  if (main.querySelectorAll("h1").length !== 1) {
    throw new Error("HOMEPAGE_MUST_HAVE_ONE_HEADLINE");
  }

  return "HOMEPAGE_CONTRACT_OK";
})()`;

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
      return !element.matches(".opal-hero-image") && rect.width > 0 && rect.height > 0 && style.position !== "fixed" && (rect.left < -1 || rect.right > window.innerWidth + 1);
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
