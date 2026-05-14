import { spawnSync } from "node:child_process";

const baseUrl = process.env.VERIFY_URL ?? "http://localhost:3000";

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
      return rect.width > 0 && rect.height > 0 && style.position !== "fixed" && (rect.left < -1 || rect.right > window.innerWidth + 1);
    })
    .slice(0, 3)
    .map((element) => element.tagName.toLowerCase());

  if (overflow.length > 0) {
    throw new Error(\`HORIZONTAL_OVERFLOW:\${overflow.join(",")}\`);
  }

  return "OK";
})()`;

const commands = [
  ["open", baseUrl],
  ["set", "viewport", "1440", "1000"],
  ["reload"],
  ["wait", "--load", "networkidle"],
  ["screenshot", "--annotate"],
  ["eval", pageIsHealthy],
  ["snapshot", "-i"],
  ["set", "viewport", "390", "844"],
  ["reload"],
  ["wait", "--load", "networkidle"],
  ["screenshot", "--annotate"],
  ["eval", pageIsHealthy],
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
