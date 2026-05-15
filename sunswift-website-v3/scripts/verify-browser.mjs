import { spawnSync } from "node:child_process"

const baseUrl = process.env.VERIFY_URL ?? "http://localhost:3000"
const achievementsUrl = new URL("/achievements", baseUrl).toString()
const whoWeAreUrl = new URL("/who-we-are", baseUrl).toString()
const ourStoryUrl = new URL("/our-story", baseUrl).toString()
const teamUrl = new URL("/team", baseUrl).toString()
const recruitmentUrl = new URL("/recruitment", baseUrl).toString()
const availableRolesUrl = new URL(
  "/recruitment/available-roles",
  baseUrl
).toString()
const engineeringRolesUrl = new URL(
  "/recruitment/available-roles/engineering-roles",
  baseUrl
).toString()
const designRolesUrl = new URL(
  "/recruitment/available-roles/design-roles",
  baseUrl
).toString()
const businessRolesUrl = new URL(
  "/recruitment/available-roles/business-roles",
  baseUrl
).toString()
const partnersUrl = new URL("/partners", baseUrl).toString()

const homepageContract = `(() => new Promise((resolve, reject) => {
  const main = document.querySelector("main[data-homepage]");
  const hero = document.querySelector("[data-homepage-hero]");
  const navbar = document.querySelector("[data-homepage-navbar]");
  const about = document.querySelector("[data-homepage-about]");
  const records = document.querySelector("[data-homepage-records]");
  const recruitment = document.querySelector("[data-homepage-recruitment]");
  const title = hero?.querySelector("h1");
  const image = hero?.querySelector("img");
  const mobileNav = navbar?.querySelector("[data-mobile-nav]");

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

  if (window.innerWidth <= 640) {
    if (!mobileNav) {
      reject(new Error("MISSING_MOBILE_NAV"));
      return;
    }
    if (getComputedStyle(mobileNav).display === "none") {
      reject(new Error("MOBILE_NAV_HIDDEN"));
      return;
    }
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
  if (!recordsText.includes("Moving records forward") || !recordsText.includes("1,000")) {
    reject(new Error("MISSING_RECORDS_COPY"));
    return;
  }

  if (!recruitment) {
    reject(new Error("MISSING_HOMEPAGE_RECRUITMENT"));
    return;
  }
  const recruitmentText = recruitment.textContent || "";
  for (const phrase of ["Embrace Tomorrow", "Design", "Engineering", "Business", "Software Engineering", "Finance", "Marketing", "Join the team"]) {
    if (!recruitmentText.includes(phrase)) {
      reject(new Error("MISSING_RECRUITMENT_COPY:" + phrase));
      return;
    }
  }
  const disciplineDropdowns = recruitment.querySelectorAll("[data-homepage-recruitment-discipline]");
  if (disciplineDropdowns.length !== 3) {
    reject(new Error("MISSING_RECRUITMENT_DISCIPLINES:" + disciplineDropdowns.length));
    return;
  }
  const roleCards = recruitment.querySelectorAll("[data-homepage-recruitment-role]");
  if (roleCards.length < 3) {
    reject(new Error("MISSING_RECRUITMENT_ROLE_CARDS:" + roleCards.length));
    return;
  }
  if (recruitment.getAttribute("data-recruitment-source") !== "cms") {
    reject(new Error("RECRUITMENT_NOT_CMS_BACKED"));
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
}))()`

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
        element.closest("[aria-label='Our Story sections']") ||
        element.closest("[data-partners-marquee]") ||
        (element.closest("[data-homepage-recruitment]") && style.position === "absolute") ||
        (element.closest("[data-achievements-page]") && style.position === "absolute");
      return !expectedMotion && rect.width > 0 && rect.height > 0 && style.position !== "fixed" && (rect.left < -1 || rect.right > window.innerWidth + 1);
    })
    .slice(0, 3)
    .map((element) => element.tagName.toLowerCase());

  if (overflow.length > 0) {
    throw new Error(\`HORIZONTAL_OVERFLOW:\${overflow.join(",")}\`);
  }

  return "OK";
})()`

const siteFooterContract = `(() => {
  const footer = document.querySelector("[data-site-footer]");
  if (!footer) {
    throw new Error("MISSING_SITE_FOOTER");
  }

  const text = footer.textContent || "";
  for (const phrase of [
    "Sunswift Racing",
    "Room G14, Blockhouse (G6), University Mall, UNSW, Kensington NSW 2052",
    "Stay connected",
    "Copyright © 2025",
    "Credits"
  ]) {
    if (!text.includes(phrase)) {
      throw new Error("MISSING_SITE_FOOTER_COPY:" + phrase);
    }
  }

  const logo = footer.querySelector('img[src*="unsw-sydney"]');
  if (!logo) {
    throw new Error("MISSING_UNSW_FOOTER_LOGO");
  }

  const logoSrc = logo.getAttribute("src") || "";
  if (!logoSrc.includes("?v=20260515-footer")) {
    throw new Error("UNSW_FOOTER_LOGO_NOT_VERSIONED:" + logoSrc);
  }

  const logoWidth = logo.getBoundingClientRect().width;
  if (logoWidth < 140) {
    throw new Error("UNSW_FOOTER_LOGO_TOO_SMALL:" + Math.round(logoWidth));
  }

  const footerStyle = getComputedStyle(footer);
  if (Number.parseFloat(footerStyle.borderTopWidth || "0") > 0) {
    throw new Error("SITE_FOOTER_HAS_HARD_BORDER");
  }

  const footerBeforeStyle = getComputedStyle(footer, "::before");
  if (!footerBeforeStyle.backgroundImage.includes("gradient")) {
    throw new Error("SITE_FOOTER_MISSING_VIGNETTE");
  }

  const title = Array.from(footer.querySelectorAll("h2")).find((heading) => (heading.textContent || "").includes("Sunswift Racing"));
  const titleSize = title ? Number.parseFloat(getComputedStyle(title).fontSize) : 0;
  if (!title || titleSize > 20) {
    throw new Error("SUNSWIFT_FOOTER_TITLE_TOO_LARGE:" + titleSize);
  }

  const link = footer.querySelector('a[href="https://linktr.ee/sunswiftracing"]');
  if (!link) {
    throw new Error("MISSING_STAY_CONNECTED_LINK");
  }

  return "SITE_FOOTER_OK";
})()`

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
}))()`

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
}))()`

const recordsTransitionWorks = `(() => new Promise((resolve, reject) => {
  const transition = document.querySelector("[data-homepage-records-transition]");
  const carousel = document.querySelector("[data-homepage-records-carousel]");
  const recruitmentGradient = document.querySelector("[data-homepage-recruitment-gradient] .homepage-recruitment-background-core");
  const handoff = document.querySelector("[data-homepage-records-handoff]");

  if (!transition || !carousel || !handoff) {
    reject(new Error("MISSING_RECORDS_TRANSITION"));
    return;
  }

  if (!recruitmentGradient) {
    reject(new Error("MISSING_RECRUITMENT_GRADIENT"));
    return;
  }

  const gradientAnimation = getComputedStyle(recruitmentGradient).animationName;
  if (!gradientAnimation || gradientAnimation === "none") {
    reject(new Error("RECRUITMENT_GRADIENT_NOT_ANIMATED"));
    return;
  }

  window.scrollTo(0, 0);
  requestAnimationFrame(() => {
    transition.scrollIntoView({ block: "start" });
    const beforeStyle = getComputedStyle(transition);
    const beforeY = beforeStyle.getPropertyValue("--records-carousel-y").trim();
    const beforeDark = Number(beforeStyle.getPropertyValue("--records-dark-opacity") || 0);
    const beforeHandoff = Number(beforeStyle.getPropertyValue("--records-handoff-opacity") || 0);
    const beforeContent = Number(beforeStyle.getPropertyValue("--records-content-opacity") || 1);
    const beforeTextColor = beforeStyle.getPropertyValue("--records-text-color").trim();

    window.scrollBy(0, Math.max(window.innerHeight * 2.78, 1));

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const afterStyle = getComputedStyle(transition);
        const afterY = afterStyle.getPropertyValue("--records-carousel-y").trim();
        const afterDark = Number(afterStyle.getPropertyValue("--records-dark-opacity") || 0);
        const afterHandoff = Number(afterStyle.getPropertyValue("--records-handoff-opacity") || 0);
        const afterContent = Number(afterStyle.getPropertyValue("--records-content-opacity") || 1);
        const afterTextColor = afterStyle.getPropertyValue("--records-text-color").trim();

        window.scrollTo(0, 0);

        if (beforeY === afterY) {
          reject(new Error("RECORDS_CAROUSEL_STATIC:" + beforeY));
          return;
        }

        if (!(afterDark > beforeDark + 0.25)) {
          reject(new Error(\`RECORDS_DARK_FADE_STATIC:\${beforeDark}->\${afterDark}\`));
          return;
        }

        if (!(afterHandoff > beforeHandoff + 0.25)) {
          reject(new Error(\`RECORDS_HANDOFF_STATIC:\${beforeHandoff}->\${afterHandoff}\`));
          return;
        }

        if (!(afterContent < beforeContent - 0.35)) {
          reject(new Error(\`RECORDS_CONTENT_NOT_CLEARING:\${beforeContent}->\${afterContent}\`));
          return;
        }

        if (beforeTextColor === afterTextColor || !beforeTextColor.includes("12") || !afterTextColor.includes("255")) {
          reject(new Error(\`RECORDS_TEXT_COLOR_STATIC:\${beforeTextColor}->\${afterTextColor}\`));
          return;
        }

        if ((transition.textContent || "").includes("Embrace tomorrow.")) {
          reject(new Error("RECORDS_DUPLICATES_RECRUITMENT_HEADLINE"));
          return;
        }

        resolve(\`RECORDS_TRANSITION_OK:\${beforeY}->\${afterY}\`);
      });
    });
  });
}))()`

const recruitmentTransitionWorks = `(() => new Promise((resolve, reject) => {
  const section = document.querySelector("[data-homepage-recruitment]");
  const intro = document.querySelector("[data-homepage-recruitment-intro]");
  const cta = section?.querySelector('a[href="/recruitment"]');

  if (!section || !intro || !cta) {
    reject(new Error("MISSING_RECRUITMENT_TRANSITION_TARGETS"));
    return;
  }

  window.scrollTo(0, 0);
  requestAnimationFrame(() => {
    const beforeOpacity = Number(getComputedStyle(section).getPropertyValue("--recruitment-intro-opacity") || 0);
    section.scrollIntoView({ block: "center" });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const afterStyle = getComputedStyle(section);
        const afterOpacity = Number(afterStyle.getPropertyValue("--recruitment-intro-opacity") || 0);
        const panelBlur = afterStyle.getPropertyValue("--recruitment-panel-blur").trim();
        const sectionRect = section.getBoundingClientRect();
        const ctaRect = cta.getBoundingClientRect();
        const ctaCenter = ctaRect.left + ctaRect.width / 2;
        const sectionCenter = sectionRect.left + sectionRect.width / 2;

        window.scrollTo(0, 0);

        if (!(afterOpacity > beforeOpacity + 0.25)) {
          reject(new Error(\`RECRUITMENT_TRANSITION_STATIC:\${beforeOpacity}->\${afterOpacity}\`));
          return;
        }

        if (!panelBlur || panelBlur === "16px") {
          reject(new Error("RECRUITMENT_PANEL_BLUR_STATIC:" + panelBlur));
          return;
        }

        if (Math.abs(ctaCenter - sectionCenter) > sectionRect.width * 0.08) {
          reject(new Error(\`RECRUITMENT_CTA_NOT_CENTERED:\${Math.round(ctaCenter)}:\${Math.round(sectionCenter)}\`));
          return;
        }

        resolve(\`RECRUITMENT_TRANSITION_OK:\${beforeOpacity}->\${afterOpacity}\`);
      });
    });
  });
}))()`

const achievementsContract = `(() => new Promise((resolve, reject) => {
  const page = document.querySelector("[data-achievements-page]");
  const introSection = document.querySelector("[data-achievements-intro-section]");
  const scrollSection = document.querySelector("[data-achievements-scroll-section]");
  const stage = document.querySelector("[data-achievements-stage]");
  const rail = document.querySelector("[data-achievements-timeline]");
  const railViewport = document.querySelector("[data-achievements-timeline-viewport]");
  const intro = document.querySelector("[data-achievements-intro]");
  const currentCopy = document.querySelector("[data-achievements-current-copy]");
  const minimalCopy = document.querySelector("[data-achievements-minimal-copy]");
  const yearRail = document.querySelector("[data-achievements-year-rail]");
  const yearProgress = document.querySelector("[data-achievements-year-progress]");
  const cards = Array.from(document.querySelectorAll("[data-achievement-card]"));

  if (!page || !introSection || !scrollSection || !stage || !rail || !railViewport) {
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

  const introRect = introSection.getBoundingClientRect();
  const scrollRect = scrollSection.getBoundingClientRect();
  if (scrollRect.top <= introRect.top + window.innerHeight * 0.7) {
    reject(new Error("ACHIEVEMENTS_INTRO_NOT_SEPARATE"));
    return;
  }

  const text = document.body.textContent || "";
  for (const phrase of ["A timeline of solar racing milestones", "Bridgestone World Solar Challenge '23", "Guinness World Record '22", "World Solar Challenge '96"]) {
    if (!text.includes(phrase)) {
      reject(new Error("MISSING_ACHIEVEMENT_COPY:" + phrase));
      return;
    }
  }

  const beforeYear = page.getAttribute("data-active-year");
  const beforeTransform = getComputedStyle(rail).transform;
  const beforeCurrentOpacity = Number(getComputedStyle(currentCopy).opacity);
  const beforeMinimalOpacity = Number(getComputedStyle(minimalCopy).opacity);
  const beforeMinimalText = (minimalCopy.textContent || "").trim();
  const beforeCurrentText = (currentCopy.textContent || "").trim();
  const beforeProgressWidth = yearProgress.getBoundingClientRect().width;

  const sectionTop = scrollSection.getBoundingClientRect().top + window.scrollY;
  window.scrollTo(0, sectionTop + Math.max(window.innerHeight * 2.2, 1));

  setTimeout(() => {
      const afterYear = page.getAttribute("data-active-year");
      const afterTransform = getComputedStyle(rail).transform;
      const afterCurrentOpacity = Number(getComputedStyle(currentCopy).opacity);
      const afterMinimalOpacity = Number(getComputedStyle(minimalCopy).opacity);
      const afterMinimalText = (minimalCopy.textContent || "").trim();
      const afterCurrentText = (currentCopy.textContent || "").trim();
      const afterProgressWidth = yearProgress.getBoundingClientRect().width;
      const railViewportRect = railViewport.getBoundingClientRect();
      const yearRailRect = yearRail.getBoundingClientRect();
      const firstCardRect = cards[0].getBoundingClientRect();

      window.scrollTo(0, 0);

      if (!beforeYear || !afterYear || beforeYear === afterYear) {
        reject(new Error(\`ACHIEVEMENTS_SCROLL_STATIC:\${beforeYear}->\${afterYear}\`));
        return;
      }

      if (beforeTransform === afterTransform || afterTransform === "none") {
        reject(new Error("ACHIEVEMENTS_RAIL_STATIC:" + beforeTransform + "->" + afterTransform));
        return;
      }

      // Both copy blocks must stay visible across the entire timeline so the first milestone reads
      // the same way as later ones (no fade-in/fade-out crossfade between them).
      if (afterCurrentOpacity < 0.95 || afterMinimalOpacity < 0.95 || beforeCurrentOpacity < 0.95 || beforeMinimalOpacity < 0.95) {
        reject(new Error(\`ACHIEVEMENTS_COPY_NOT_PERSISTENT:\${beforeCurrentOpacity}->\${afterCurrentOpacity}/\${beforeMinimalOpacity}->\${afterMinimalOpacity}\`));
        return;
      }

      // Both copy blocks must always reflect the active milestone — the first milestone (2023) and
      // the scrolled milestone must each be present in the corresponding copy.
      if (!beforeMinimalText.includes(beforeYear) || !afterMinimalText.includes(afterYear)) {
        reject(new Error(\`ACHIEVEMENTS_MINIMAL_NOT_ACTIVE:\${beforeYear}/\${afterYear}\`));
        return;
      }
      if (beforeCurrentText.length < 4 || afterCurrentText.length < 4 || beforeCurrentText === afterCurrentText) {
        reject(new Error(\`ACHIEVEMENTS_CURRENT_NOT_UPDATING:\${beforeCurrentText.length}/\${afterCurrentText.length}\`));
        return;
      }

      if (!(afterProgressWidth > beforeProgressWidth)) {
        reject(new Error(\`ACHIEVEMENTS_YEAR_PROGRESS_STATIC:\${beforeProgressWidth}->\${afterProgressWidth}\`));
        return;
      }

      if (railViewportRect.bottom > window.innerHeight - 32 || yearRailRect.bottom > window.innerHeight - 8 || firstCardRect.height > window.innerHeight * 0.24) {
        reject(new Error(\`ACHIEVEMENTS_TIMELINE_NOT_FITTED:\${railViewportRect.bottom}/\${yearRailRect.bottom}/\${firstCardRect.height}\`));
        return;
      }

      // The vehicle label on every visible card must render fully inside the card so it is never clipped.
      const visibleCards = cards.filter((card) => {
        const r = card.getBoundingClientRect();
        return r.right > 0 && r.left < window.innerWidth;
      });
      for (const card of visibleCards) {
        const cardRect = card.getBoundingClientRect();
        const label = card.querySelector("[data-achievement-vehicle]");
        if (!label) {
          reject(new Error("ACHIEVEMENTS_VEHICLE_LABEL_MISSING:" + card.getAttribute("data-achievement-year")));
          return;
        }
        const labelRect = label.getBoundingClientRect();
        const labelText = (label.textContent || "").trim();
        if (!labelText) {
          reject(new Error("ACHIEVEMENTS_VEHICLE_LABEL_EMPTY:" + card.getAttribute("data-achievement-year")));
          return;
        }
        if (labelRect.bottom > cardRect.bottom + 1 || labelRect.top < cardRect.top - 1 || labelRect.width < 8) {
          reject(new Error("ACHIEVEMENTS_VEHICLE_LABEL_CLIPPED:" + card.getAttribute("data-achievement-year") + ":" + Math.round(labelRect.top) + "-" + Math.round(labelRect.bottom) + "/" + Math.round(cardRect.top) + "-" + Math.round(cardRect.bottom)));
          return;
        }
      }

      resolve(\`ACHIEVEMENTS_CONTRACT_OK:\${beforeYear}->\${afterYear}\`);
  }, 250);
}))()`

const aboutPagesContract = `(() => {
  const page = document.querySelector("[data-about-page]");
  if (!page) {
    throw new Error("MISSING_ABOUT_EDITORIAL_PAGE");
  }

  const text = document.body.textContent || "";
  const route = page.getAttribute("data-about-page");
  const requiredByRoute = {
    "who-we-are": [
      "Who We Are",
      "Sunswift Racing has been redefining the future of automotive technology since 1996.",
      "Led by Team Principal Professor Richard Hopkins",
      "Our Cars",
      "Our Vision",
      "Discover Sunswift",
      "Our Achievements",
      "Our Story"
    ],
    "our-story": [
      "Our Story",
      "The Dawn of Sunswift I",
      "What started as a wild thesis idea at the uni bar launched a legacy of solar racing.",
      "The Rebirth of Sunswift II",
      "Sunswift III: Triple Threat",
      "Sunswift IVy: Race to the Finish",
      "WSC 2011 Team"
    ]
  };

  for (const phrase of requiredByRoute[route] ?? []) {
    if (!text.includes(phrase)) {
      throw new Error("MISSING_ABOUT_COPY:" + route + ":" + phrase);
    }
  }

  const images = document.querySelectorAll("img");
  if (images.length < (route === "our-story" ? 8 : 6)) {
    throw new Error("MISSING_ABOUT_PLACEHOLDERS:" + route + ":" + images.length);
  }

  if (!text.includes("Who We Are") || !text.includes("Achievements") || !text.includes("Our Story")) {
    throw new Error("MISSING_ABOUT_NAV_ITEMS:" + route);
  }

  return "ABOUT_PAGE_OK:" + route;
})()`

const recruitmentHubContract = `(() => {
  const hub = document.querySelector("[data-recruitment-hub]");
  const streams = document.querySelectorAll("[data-recruitment-stream]");
  const navbar = document.querySelector("[data-homepage-navbar]");
  const text = document.body.textContent || "";

  if (!hub) {
    throw new Error("MISSING_RECRUITMENT_HUB");
  }

  if (!navbar) {
    throw new Error("MISSING_RECRUITMENT_TRANSPARENT_NAVBAR");
  }

  for (const phrase of [
    "Join Sunswift Racing.",
    "Business/media form",
    "Choose your lane.",
    "Design",
    "Engineering",
    "Business",
    "Software Engineering",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Renewables",
    "Chemical Engineering",
    "Finance",
    "Marketing",
    "Operations"
  ]) {
    if (!text.includes(phrase)) {
      throw new Error("MISSING_RECRUITMENT_HUB_COPY:" + phrase);
    }
  }

  if (text.includes("Recruitment hub")) {
    throw new Error("RECRUITMENT_HUB_KICKER_STILL_VISIBLE");
  }

  const alternativeLink = document.querySelector("[data-alternative-applications-link]");
  if (!alternativeLink || alternativeLink.getAttribute("href") !== "https://forms.gle/sunswift-business-media-placeholder") {
    throw new Error("MISSING_ALTERNATIVE_APPLICATIONS_LINK");
  }

  if (streams.length !== 3) {
    throw new Error("MISSING_RECRUITMENT_STREAMS:" + streams.length);
  }

  for (const stream of streams) {
    if (stream.tagName.toLowerCase() !== "a") {
      throw new Error("RECRUITMENT_STREAM_NOT_LINK:" + stream.getAttribute("data-recruitment-stream"));
    }
    const href = stream.getAttribute("href") || "";
    if (!href.startsWith("/recruitment/available-roles/")) {
      throw new Error("RECRUITMENT_STREAM_BAD_HREF:" + href);
    }
  }

  const inlineRoleCards = document.querySelectorAll("[data-recruitment-role-card]");
  if (inlineRoleCards.length > 0) {
    throw new Error("RECRUITMENT_HUB_HAS_INLINE_ROLE_CARDS:" + inlineRoleCards.length);
  }

  if (!document.querySelector("[data-recruitment-families='Design']") || !document.querySelector("[data-recruitment-families='Engineering']") || !document.querySelector("[data-recruitment-families='Business']")) {
    throw new Error("MISSING_RECRUITMENT_FAMILY_GROUPS");
  }

  return "RECRUITMENT_HUB_OK:" + streams.length;
})()`

const availableRolesContract = `(() => {
  const page = document.querySelector("[data-available-roles-page]");
  const streams = document.querySelectorAll("[data-available-role-stream]");
  const text = document.body.textContent || "";

  if (!page) {
    throw new Error("MISSING_AVAILABLE_ROLES_PAGE");
  }

  for (const phrase of [
    "Available roles.",
    "Design",
    "Engineering",
    "Business",
    "Software Engineering",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Renewables",
    "Chemical Engineering",
    "Finance",
    "Marketing",
    "Operations"
  ]) {
    if (!text.includes(phrase)) {
      throw new Error("MISSING_AVAILABLE_ROLES_COPY:" + phrase);
    }
  }

  if (streams.length !== 3) {
    throw new Error("MISSING_AVAILABLE_ROLE_STREAMS:" + streams.length);
  }

  for (const path of ["design-roles", "engineering-roles", "business-roles"]) {
    if (!document.querySelector('a[href="/recruitment/available-roles/' + path + '"]')) {
      throw new Error("MISSING_AVAILABLE_ROLE_LINK:" + path);
    }
  }

  if (document.querySelectorAll("[data-available-role-card], [data-role-stream-card]").length > 0) {
    throw new Error("AVAILABLE_ROLES_INDEX_HAS_INLINE_CARDS");
  }

  return "AVAILABLE_ROLES_OK:" + streams.length;
})()`

const roleStreamContract = `(() => {
  const page = document.querySelector("[data-role-stream-page]");
  const cards = document.querySelectorAll("[data-role-stream-card]");
  const text = document.body.textContent || "";

  if (!page) {
    throw new Error("MISSING_ROLE_STREAM_PAGE");
  }

  const stream = page.getAttribute("data-role-stream-page");
  const expectedByStream = {
    design: ["Design Roles.", "Design", "Media"],
    engineering: ["Engineering Roles.", "Software Engineering", "Electrical Engineering", "Mechanical Engineering"],
    business: ["Business Roles.", "Finance", "Marketing", "Operations"]
  };

  for (const phrase of expectedByStream[stream] ?? []) {
    if (!text.includes(phrase)) {
      throw new Error("MISSING_ROLE_STREAM_COPY:" + stream + ":" + phrase);
    }
  }

  if (stream === "design") {
    if (!document.querySelector("[data-role-stream-empty]")) {
      throw new Error("MISSING_DESIGN_EMPTY_STATE");
    }
  } else if (cards.length < 1) {
    throw new Error("MISSING_ROLE_STREAM_CARDS:" + stream + ":" + cards.length);
  }

  return "ROLE_STREAM_OK:" + stream + ":" + cards.length;
})()`

const partnersContract = `(() => {
  const page = document.querySelector("[data-partners-page]");
  const marquee = document.querySelector("[data-partners-marquee]");
  const grid = document.querySelector("[data-partners-grid]");
  const cards = document.querySelectorAll("[data-partner-card]");
  const marqueeCards = document.querySelectorAll("[data-partner-marquee-card]");
  const text = document.body.textContent || "";

  if (!page || !marquee || !grid) {
    throw new Error("MISSING_PARTNERS_PAGE");
  }

  for (const phrase of [
    "Partners.",
    "Building world-class cars takes more than just engineering - it takes a community.",
    "Interested in supporting our mission?",
    "Partner grid",
    "3M",
    "Altium",
    "Ampcontrol",
    "Audi",
    "Optus",
    "UNSW",
    "WrapStyle Sydney"
  ]) {
    if (!text.includes(phrase)) {
      throw new Error("MISSING_PARTNERS_COPY:" + phrase);
    }
  }

  if (cards.length < 30) {
    throw new Error("MISSING_PARTNER_CARDS:" + cards.length);
  }

  if (marqueeCards.length < 60) {
    throw new Error("MISSING_PARTNER_MARQUEE_CARDS:" + marqueeCards.length);
  }

  const gridColumns = getComputedStyle(grid).gridTemplateColumns.split(" ").filter(Boolean).length;
  if (gridColumns !== 4) {
    throw new Error("PARTNERS_GRID_NOT_FOUR_COLUMNS:" + gridColumns);
  }

  const gridWidth = grid.getBoundingClientRect().width;
  if (gridWidth > 1240) {
    throw new Error("PARTNERS_GRID_TOO_WIDE:" + Math.round(gridWidth));
  }

  for (const card of Array.from(cards).slice(0, 8)) {
    const rect = card.getBoundingClientRect();
    const ratio = rect.width / rect.height;
    if (ratio < 0.92 || ratio > 1.08) {
      throw new Error("PARTNER_CARD_NOT_SQUARE:" + Math.round(rect.width) + "x" + Math.round(rect.height));
    }
  }

  const marqueeTrack = marquee.querySelector(".partner-marquee");
  const animation = marqueeTrack ? getComputedStyle(marqueeTrack).animationName : "";
  if (!animation || animation === "none") {
    throw new Error("PARTNER_MARQUEE_NOT_ANIMATED");
  }

  return "PARTNERS_OK:" + cards.length;
})()`

const teamContract = `(() => new Promise((resolve, reject) => {
  const page = document.querySelector("[data-team-page]");
  const filter = document.querySelector("[data-team-filter]");
  const grid = document.querySelector("[data-team-grid]");
  const filteredCount = document.querySelector("[data-filtered-count]");

  if (!page || !filter || !grid || !filteredCount) {
    reject(new Error("MISSING_TEAM_ROSTER"));
    return;
  }

  const text = document.body.textContent || "";
  for (const phrase of ["Our Team.", "Filter roster", "Embedded Systems", "Chassis and Bodywork", "Vehicle Dynamics", "Business", "Media"]) {
    if (!text.includes(phrase)) {
      reject(new Error("MISSING_TEAM_COPY:" + phrase));
      return;
    }
  }

  const initialCards = document.querySelectorAll("[data-team-card]");
  if (initialCards.length < 10) {
    reject(new Error("MISSING_TEAM_PLACEHOLDERS:" + initialCards.length));
    return;
  }

  filter.value = "Business";
  filter.dispatchEvent(new Event("change", { bubbles: true }));

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const businessCards = Array.from(document.querySelectorAll("[data-team-card]"));
      if (businessCards.length < 2 || businessCards.length >= initialCards.length) {
        reject(new Error("TEAM_FILTER_COUNT_STATIC:" + initialCards.length + "->" + businessCards.length));
        return;
      }

      for (const card of businessCards) {
        if (card.getAttribute("data-team-department") !== "Business") {
          reject(new Error("TEAM_FILTER_WRONG_DEPARTMENT:" + card.getAttribute("data-team-department")));
          return;
        }

        if (!card.classList.contains("team-card-filter-in")) {
          reject(new Error("TEAM_CARD_FILTER_TRANSITION_CLASS_MISSING"));
          return;
        }
      }

      const count = (filteredCount.textContent || "").trim();
      if (count !== String(businessCards.length)) {
        reject(new Error("TEAM_FILTERED_COUNT_STALE:" + count + ":" + businessCards.length));
        return;
      }

      resolve("TEAM_CONTRACT_OK:" + businessCards.length);
    });
  });
}))()`

const commands = [
  ["open", baseUrl],
  ["set", "viewport", "1440", "1000"],
  ["reload"],
  ["wait", "--load", "networkidle"],
  ["eval", pageIsHealthy],
  ["eval", siteFooterContract],
  ["eval", homepageContract],
  ["eval", scrollEffectWorks],
  ["eval", focusRevealEffectWorks],
  ["eval", recordsTransitionWorks],
  ["eval", recruitmentTransitionWorks],
  ["screenshot", "--annotate"],
  ["snapshot", "-i"],
  ["set", "viewport", "390", "844"],
  ["reload"],
  ["wait", "--load", "networkidle"],
  ["eval", pageIsHealthy],
  ["eval", siteFooterContract],
  ["eval", homepageContract],
  ["eval", scrollEffectWorks],
  ["eval", focusRevealEffectWorks],
  ["eval", recordsTransitionWorks],
  ["eval", recruitmentTransitionWorks],
  ["screenshot", "--annotate"],
  ["snapshot", "-i"],
  ["open", achievementsUrl],
  ["wait", "--load", "networkidle"],
  ["eval", pageIsHealthy],
  ["eval", siteFooterContract],
  ["eval", achievementsContract],
  ["screenshot", "--annotate"],
  ["snapshot", "-i"],
  ["open", whoWeAreUrl],
  ["wait", "--load", "networkidle"],
  ["eval", pageIsHealthy],
  ["eval", siteFooterContract],
  ["eval", aboutPagesContract],
  ["screenshot", "--annotate"],
  ["snapshot", "-i"],
  ["open", ourStoryUrl],
  ["wait", "--load", "networkidle"],
  ["eval", pageIsHealthy],
  ["eval", siteFooterContract],
  ["eval", aboutPagesContract],
  ["screenshot", "--annotate"],
  ["snapshot", "-i"],
  ["open", teamUrl],
  ["wait", "--load", "networkidle"],
  ["eval", pageIsHealthy],
  ["eval", siteFooterContract],
  ["eval", teamContract],
  ["screenshot", "--annotate"],
  ["snapshot", "-i"],
  ["open", recruitmentUrl],
  ["wait", "--load", "networkidle"],
  ["eval", pageIsHealthy],
  ["eval", siteFooterContract],
  ["eval", recruitmentHubContract],
  ["screenshot", "--annotate"],
  ["snapshot", "-i"],
  ["open", availableRolesUrl],
  ["wait", "--load", "networkidle"],
  ["eval", pageIsHealthy],
  ["eval", siteFooterContract],
  ["eval", availableRolesContract],
  ["screenshot", "--annotate"],
  ["snapshot", "-i"],
  ["open", engineeringRolesUrl],
  ["wait", "--load", "networkidle"],
  ["eval", pageIsHealthy],
  ["eval", siteFooterContract],
  ["eval", roleStreamContract],
  ["screenshot", "--annotate"],
  ["snapshot", "-i"],
  ["open", designRolesUrl],
  ["wait", "--load", "networkidle"],
  ["eval", pageIsHealthy],
  ["eval", siteFooterContract],
  ["eval", roleStreamContract],
  ["screenshot", "--annotate"],
  ["snapshot", "-i"],
  ["open", businessRolesUrl],
  ["wait", "--load", "networkidle"],
  ["eval", pageIsHealthy],
  ["eval", siteFooterContract],
  ["eval", roleStreamContract],
  ["screenshot", "--annotate"],
  ["snapshot", "-i"],
  ["set", "viewport", "1440", "1000"],
  ["open", partnersUrl],
  ["wait", "--load", "networkidle"],
  ["eval", pageIsHealthy],
  ["eval", siteFooterContract],
  ["eval", partnersContract],
  ["screenshot", "--annotate"],
  ["snapshot", "-i"],
]

function run(args, allowFailure = false) {
  const result = spawnSync("agent-browser", args, {
    stdio: "inherit",
    env: process.env,
  })

  if (!allowFailure && result.status !== 0) {
    spawnSync("agent-browser", ["close"], { stdio: "ignore" })
    process.exit(result.status ?? 1)
  }
}

for (const args of commands) {
  run(args)
}

run(["close"], true)
