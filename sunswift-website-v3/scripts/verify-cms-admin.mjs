import { spawnSync } from "node:child_process"

const baseUrl = process.env.VERIFY_URL ?? "http://localhost:3000"
const adminUrl = new URL("/admin", baseUrl).toString()
const teamUrl = new URL("/admin/team", baseUrl).toString()
const partnersUrl = new URL("/admin/partners", baseUrl).toString()
const assetsUrl = new URL("/admin/assets", baseUrl).toString()

function runAgentBrowser(args, options = {}) {
  const result = spawnSync("pnpm", ["exec", "agent-browser", ...args], {
    cwd: process.cwd(),
    encoding: "utf8",
    input: options.input,
    stdio: options.input ? ["pipe", "pipe", "pipe"] : ["ignore", "pipe", "pipe"],
  })

  if (result.status !== 0) {
    throw new Error(
      [
        `agent-browser ${args.join(" ")} failed`,
        result.stdout.trim(),
        result.stderr.trim(),
      ]
        .filter(Boolean)
        .join("\n")
    )
  }

  return result.stdout.trim()
}

function evalInBrowser(source) {
  return runAgentBrowser(["eval", "--stdin"], { input: source })
}

function pageHealthContract(expectedTitle) {
  return `(() => {
    if (document.querySelector("[data-nextjs-dialog], .vite-error-overlay, #webpack-dev-server-client-overlay")) {
      throw new Error("ERROR_OVERLAY");
    }

    if (document.body.innerText.trim().length === 0) {
      throw new Error("BLANK_PAGE");
    }

    if (document.title !== ${JSON.stringify(expectedTitle)}) {
      throw new Error("BAD_TITLE:" + document.title);
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
      throw new Error("HORIZONTAL_OVERFLOW:" + overflow.join(","));
    }

    return "PAGE_HEALTH_OK";
  })()`
}

const loginOrDashboardContract = `(() => new Promise((resolve, reject) => {
  const finish = () => {
    const text = document.body.textContent || "";
    if (location.pathname === "/admin" && text.includes("CMS staging")) {
      resolve("ADMIN_ALREADY_AUTHENTICATED");
      return;
    }

    if (location.pathname !== "/admin/login") {
      reject(new Error("ADMIN_DID_NOT_REDIRECT_TO_LOGIN:" + location.pathname));
      return;
    }

    const button = document.querySelector("[data-dev-admin-login]");
    if (!button) {
      reject(new Error("MISSING_DEV_ADMIN_LOGIN"));
      return;
    }

    if (!text.includes("Local test account: developer@sunswift.unsw.edu.au")) {
      reject(new Error("MISSING_DEV_ACCOUNT_COPY"));
      return;
    }

    button.click();
    resolve("DEV_LOGIN_CLICKED");
  };

  setTimeout(finish, 250);
}))()`

const adminDashboardContract = `(() => new Promise((resolve, reject) => {
  const deadline = Date.now() + 8000;
  const tick = () => {
    const text = document.body.textContent || "";
    if (location.pathname === "/admin" && text.includes("CMS staging")) {
      for (const phrase of ["Draft team members", "Draft recruitment roles", "Draft partners", "Published S3 assets", "developer@sunswift.unsw.edu.au"]) {
        if (!text.includes(phrase)) {
          reject(new Error("MISSING_DASHBOARD_COPY:" + phrase));
          return;
        }
      }

      resolve("ADMIN_DASHBOARD_OK");
      return;
    }

    if (Date.now() > deadline) {
      reject(new Error("ADMIN_LOGIN_TIMEOUT:" + location.pathname + ":" + text.slice(0, 120)));
      return;
    }

    setTimeout(tick, 150);
  };

  tick();
}))()`

const teamDraftEditContract = `(() => new Promise((resolve, reject) => {
  const form = document.querySelector("[data-admin-team-editor]");
  const importForm = document.querySelector("[data-admin-team-import]");
  const roleInput = form?.querySelector('input[name="role"]');
  const departmentSelect = form?.querySelector('select[name="department"]');
  const hierarchySelect = form?.querySelector('select[name="hierarchyLevel"]');
  const publishAll = Array.from(document.querySelectorAll("button")).find((button) => (button.textContent || "").includes("Publish all team members"));
  const visibleText = document.body.textContent || "";

  if (!form || !importForm || !roleInput || !departmentSelect || !hierarchySelect || !publishAll) {
    reject(new Error("MISSING_TEAM_ADMIN_EDITOR"));
    return;
  }

  if (form.querySelector('input[name="discipline"], textarea[name="bio"]') || visibleText.includes("Optional override")) {
    reject(new Error("REMOVED_TEAM_FIELDS_VISIBLE"));
    return;
  }

  if (!Array.from(departmentSelect.options).some((option) => option.value === "Vehicle Dynamics")) {
    reject(new Error("MISSING_TEAM_DEPARTMENT_OPTIONS"));
    return;
  }

  if (!Array.from(hierarchySelect.options).some((option) => option.value === "Officer")) {
    reject(new Error("MISSING_TEAM_HIERARCHY_OPTIONS"));
    return;
  }

  const marker = "Regression Test Lead " + Date.now();
  roleInput.value = marker;
  roleInput.dispatchEvent(new Event("input", { bubbles: true }));
  roleInput.dispatchEvent(new Event("change", { bubbles: true }));
  form.requestSubmit();

  setTimeout(() => resolve(marker), 1500);
}))()`

function teamDraftSavedContract(marker) {
  return `(() => {
    const form = document.querySelector("[data-admin-team-editor]");
    const roleInput = form?.querySelector('input[name="role"]');

    if (!form || !roleInput) {
      throw new Error("MISSING_TEAM_ADMIN_EDITOR_AFTER_SAVE");
    }

    if (roleInput.value !== ${JSON.stringify(marker)}) {
      throw new Error("TEAM_DRAFT_EDIT_NOT_REFLECTED:" + roleInput.value);
    }

    return "TEAM_DRAFT_EDIT_OK:" + roleInput.value;
  })()`
}

const partnersContract = `(() => {
  const text = document.body.textContent || "";
  if (!document.querySelector("[data-admin-partners-import]")) {
    throw new Error("MISSING_PARTNERS_IMPORT");
  }
  if (!text.includes("Partners") || !text.includes("Import partners CSV") || !text.includes("Publish")) {
    throw new Error("MISSING_PARTNERS_ADMIN_COPY");
  }
  return "PARTNERS_ADMIN_OK";
})()`

const assetsContract = `(() => {
  const text = document.body.textContent || "";
  if (!text.includes("Public media assets") || !text.includes("Register heavy media")) {
    throw new Error("MISSING_ASSETS_ADMIN_COPY");
  }
  if (!text.includes("public-media/placeholders/sr7-world-record.mp4")) {
    throw new Error("MISSING_HEAVY_MEDIA_RECORD");
  }
  return "ASSETS_ADMIN_OK";
})()`

try {
  runAgentBrowser(["close"])
} catch {
  // A browser session may not exist yet.
}

try {
  runAgentBrowser(["open", adminUrl])
  runAgentBrowser(["wait", "--load", "networkidle"])
  console.log(evalInBrowser(loginOrDashboardContract))
  runAgentBrowser(["wait", "--load", "networkidle"])
  console.log(evalInBrowser(adminDashboardContract))
  console.log(evalInBrowser(pageHealthContract("Admin | Sunswift Racing")))

  runAgentBrowser(["open", teamUrl])
  runAgentBrowser(["wait", "--load", "networkidle"])
  console.log(evalInBrowser(pageHealthContract("Admin Team | Sunswift Racing")))
  const draftMarker = JSON.parse(evalInBrowser(teamDraftEditContract))
  runAgentBrowser(["wait", "--load", "networkidle"])
  runAgentBrowser(["open", teamUrl])
  runAgentBrowser(["wait", "--load", "networkidle"])
  console.log(evalInBrowser(teamDraftSavedContract(draftMarker)))

  runAgentBrowser(["open", partnersUrl])
  runAgentBrowser(["wait", "--load", "networkidle"])
  console.log(evalInBrowser(pageHealthContract("Admin Partners | Sunswift Racing")))
  console.log(evalInBrowser(partnersContract))

  runAgentBrowser(["open", assetsUrl])
  runAgentBrowser(["wait", "--load", "networkidle"])
  console.log(evalInBrowser(pageHealthContract("Admin Assets | Sunswift Racing")))
  console.log(evalInBrowser(assetsContract))

  console.log("CMS admin browser regression passed.")
} finally {
  try {
    runAgentBrowser(["close"])
  } catch {
    // Nothing to close.
  }
}
