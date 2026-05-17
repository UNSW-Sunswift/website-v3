import { spawnSync } from "node:child_process"

const baseUrl = process.env.VERIFY_URL ?? "http://localhost:3000"
const achievementsUrl = new URL("/achievements", baseUrl).toString()
const whoWeAreUrl = new URL("/who-we-are", baseUrl).toString()
const ourStoryUrl = new URL("/our-story", baseUrl).toString()
const teamUrl = new URL("/team", baseUrl).toString()
const vehiclesUrl = new URL("/vehicles", baseUrl).toString()
const mediaUrl = new URL("/media", baseUrl).toString()
const contactUrl = new URL("/contact", baseUrl).toString()
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
const adminUrl = new URL("/admin", baseUrl).toString()

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
  if (recordCards.length < 2) {
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
  for (const phrase of ["Embrace Tomorrow", "Design", "Engineering", "Business", "Design Roles", "Engineering Roles", "Business Roles", "Join the team"]) {
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
  if (recruitment.querySelector("[data-recruitment-families], [data-available-role-families]")) {
    reject(new Error("HOMEPAGE_RECRUITMENT_TAGS_STILL_VISIBLE"));
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
  if (expected !== "Today, Tomorrow") {
    reject(new Error("MISSING_SLOGAN_DATA:" + expected));
    return;
  }

  hero.scrollIntoView({ block: "start" });

  const deadline = Date.now() + 5000;
  const tick = () => {
    if (hero.getAttribute("data-hero-reveal-complete") === "true" && title.dataset.typingComplete === "true") {
      window.scrollTo(0, 0);
      resolve("HOMEPAGE_CONTRACT_OK");
      return;
    }
    if (Date.now() > deadline) {
      window.scrollTo(0, 0);
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
        element.matches(".homepage-hero-image, .homepage-zoom-render") ||
        element.closest(".homepage-zoom-render, [data-achievements-timeline]") ||
        element.closest("[aria-label='Our Story sections']") ||
        element.closest("[data-vehicles-gallery]") ||
        element.closest("[data-media-highlight-row]") ||
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
    "Tomorrow, Today.",
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

  const title = Array.from(footer.querySelectorAll("h2")).find((heading) => (heading.textContent || "").includes("Tomorrow, Today."));
  const titleSize = title ? Number.parseFloat(getComputedStyle(title).fontSize) : 0;
  if (!title || titleSize < 32 || titleSize > 112) {
    throw new Error("SUNSWIFT_FOOTER_TITLE_SIZE_OFF:" + titleSize);
  }

  const link = footer.querySelector('a[href="https://linktr.ee/sunswiftracing"]');
  if (!link) {
    throw new Error("MISSING_STAY_CONNECTED_LINK");
  }

  return "SITE_FOOTER_OK";
})()`

const heroIntroEffectWorks = `(() => new Promise((resolve, reject) => {
  const hero = document.querySelector("[data-homepage-hero]");
  const title = hero?.querySelector("h1");
  const wipe = hero?.querySelector("[data-homepage-hero-wipe]");

  if (!hero || !title || !wipe) {
    reject(new Error("MISSING_HOMEPAGE_HERO"));
    return;
  }

  hero.scrollIntoView({ block: "start" });
  if (hero.getAttribute("data-hero-reveal-complete") === "true" && title.dataset.typingComplete === "true") {
    window.scrollTo(0, 0);
    resolve("HERO_TIMED_INTRO_OK:already-complete");
    return;
  }
  const before = getComputedStyle(wipe).transform;
  const deadline = Date.now() + 5200;
  const tick = () => {
    const after = getComputedStyle(wipe).transform;
    if (hero.getAttribute("data-hero-reveal-complete") === "true" && title.dataset.typingComplete === "true" && before !== after) {
      window.scrollTo(0, 0);
      resolve(\`HERO_TIMED_INTRO_OK:\${before}->\${after}\`);
      return;
    }
    if (Date.now() > deadline) {
      window.scrollTo(0, 0);
      reject(new Error(\`HERO_TIMED_INTRO_STALLED:\${before}->\${after}\`));
      return;
    }
    setTimeout(tick, 80);
  };
  tick();
}))()`

const focusRevealEffectWorks = `(() => new Promise((resolve, reject) => {
  const reveal = document.querySelector("[data-homepage-zoom-reveal]");
  const headline = document.querySelector("[data-homepage-zoom-text]");

  if (!reveal || !headline) {
    reject(new Error("MISSING_HOMEPAGE_FOCUS_REVEAL"));
    return;
  }

  const before = getComputedStyle(headline);
  const beforeOpacity = Number(before.opacity);
  const beforeTransform = before.transform;
  const beforeWipe = getComputedStyle(reveal).getPropertyValue("--zoom-wipe-y");

  reveal.scrollIntoView({ block: "start" });
  window.scrollBy(0, Math.max(window.innerHeight * 0.72, 1));

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const after = getComputedStyle(headline);
      const afterTransform = after.transform;
      const afterOpacity = Number(after.opacity);
      const afterWipe = getComputedStyle(reveal).getPropertyValue("--zoom-wipe-y");
      const afterScale = afterTransform.includes("matrix(") ? afterTransform.match(/matrix\\(([^)]+)\\)/)?.[1]?.split(",").slice(0, 4).map((value) => Number(value.trim())) : null;

      window.scrollTo(0, 0);

      if (Math.abs(afterOpacity - beforeOpacity) < 0.25 && beforeTransform === afterTransform && beforeWipe === afterWipe) {
        reject(new Error("FOCUS_REVEAL_STATIC"));
        return;
      }

      if (afterScale && (Math.abs(afterScale[0] - 1) > 0.03 || Math.abs(afterScale[3] - 1) > 0.03 || Math.abs(afterScale[1]) > 0.03 || Math.abs(afterScale[2]) > 0.03)) {
        reject(new Error("FOCUS_REVEAL_USES_ZOOM:" + afterTransform));
        return;
      }

      resolve(\`FOCUS_REVEAL_OK:\${beforeOpacity}->\${afterOpacity},\${beforeWipe}->\${afterWipe}\`);
    });
  });
}))()`

const recordsTransitionWorks = `(() => new Promise((resolve, reject) => {
  const transition = document.querySelector("[data-homepage-records-transition]");
  const carousel = document.querySelector("[data-homepage-records-carousel]");
  const recruitmentBlock = document.querySelector("[data-homepage-recruitment-block]");
  const handoff = document.querySelector("[data-homepage-records-handoff]");

  if (!transition || !carousel || !handoff) {
    reject(new Error("MISSING_RECORDS_TRANSITION"));
    return;
  }

  if (!recruitmentBlock) {
    reject(new Error("MISSING_RECRUITMENT_BLOCK"));
    return;
  }

  if (getComputedStyle(recruitmentBlock).backgroundImage !== "none") {
    reject(new Error("RECRUITMENT_BLOCK_USES_GRADIENT"));
    return;
  }

  window.scrollTo(0, 0);
  requestAnimationFrame(() => {
    transition.scrollIntoView({ block: "start" });
    const beforeStyle = getComputedStyle(transition);
    const beforeY = beforeStyle.getPropertyValue("--records-carousel-y").trim();
    const beforeBlackY = Number.parseFloat(beforeStyle.getPropertyValue("--records-black-y") || "100");
    const beforeHandoff = Number(beforeStyle.getPropertyValue("--records-handoff-opacity") || 0);
    const beforeContent = Number(beforeStyle.getPropertyValue("--records-content-opacity") || 1);
    const beforeTextColor = beforeStyle.getPropertyValue("--records-text-color").trim();
    const distance = Math.max(transition.offsetHeight - window.innerHeight, 1);

    window.scrollBy(0, Math.max(distance * 0.16, 1));

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const earlyStyle = getComputedStyle(transition);
        const earlyBlackY = Number.parseFloat(earlyStyle.getPropertyValue("--records-black-y") || "100");
        const earlyCopy = Number(earlyStyle.getPropertyValue("--records-copy-opacity") || 0);

        window.scrollBy(0, Math.max(distance * 0.8, 1));

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const afterStyle = getComputedStyle(transition);
            const afterY = afterStyle.getPropertyValue("--records-carousel-y").trim();
            const afterBlackY = Number.parseFloat(afterStyle.getPropertyValue("--records-black-y") || "100");
            const afterHandoff = Number(afterStyle.getPropertyValue("--records-handoff-opacity") || 0);
            const afterContent = Number(afterStyle.getPropertyValue("--records-content-opacity") || 1);
            const afterTextColor = afterStyle.getPropertyValue("--records-text-color").trim();

            window.scrollTo(0, 0);

            if (beforeY === afterY) {
              reject(new Error("RECORDS_CAROUSEL_STATIC:" + beforeY));
              return;
            }

            if (!(afterBlackY < beforeBlackY - 50)) {
              reject(new Error(\`RECORDS_BLACK_WIPE_STATIC:\${beforeBlackY}->\${afterBlackY}\`));
              return;
            }

            if (!(earlyBlackY < 5)) {
              reject(new Error(\`RECORDS_BLACK_WIPE_LATE:\${beforeBlackY}->\${earlyBlackY}\`));
              return;
            }

            if (earlyCopy < 0.95) {
              reject(new Error(\`RECORDS_COPY_CLEARS_TOO_EARLY:\${earlyCopy}\`));
              return;
            }

            if (!(afterHandoff > beforeHandoff + 0.25)) {
              reject(new Error(\`RECORDS_HANDOFF_STATIC:\${beforeHandoff}->\${afterHandoff}\`));
              return;
            }

            if (beforeContent < 0.85 || afterContent < 0.75) {
              reject(new Error(\`RECORDS_CONTENT_CLEARS_TOO_EARLY:\${beforeContent}->\${afterContent}\`));
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
        const sectionRect = section.getBoundingClientRect();
        const ctaRect = cta.getBoundingClientRect();
        const ctaCenter = ctaRect.left + ctaRect.width / 2;
        const sectionCenter = sectionRect.left + sectionRect.width / 2;

        window.scrollTo(0, 0);

        if (!(afterOpacity > beforeOpacity + 0.25)) {
          reject(new Error(\`RECRUITMENT_TRANSITION_STATIC:\${beforeOpacity}->\${afterOpacity}\`));
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

  const stagedVideos = stage.querySelectorAll(":scope > div:first-child video");
  if (stagedVideos.length < 1) {
    reject(new Error("MISSING_ACHIEVEMENT_VIDEO_MOUNT"));
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

  if (window.innerWidth < 768) {
    const mobileTimeline = document.querySelector("[data-achievements-mobile-timeline]");
    const mobileCards = Array.from(document.querySelectorAll("[data-mobile-achievement-card]"));

    if (!mobileTimeline || mobileCards.length < 18) {
      reject(new Error("MISSING_ACHIEVEMENTS_MOBILE_TIMELINE:" + mobileCards.length));
      return;
    }

    if (getComputedStyle(stage).display !== "none") {
      reject(new Error("ACHIEVEMENTS_DESKTOP_RAIL_VISIBLE_ON_MOBILE"));
      return;
    }

    if (scrollSection.getAttribute("style")?.includes("height")) {
      reject(new Error("ACHIEVEMENTS_MOBILE_HAS_DESKTOP_SCROLL_HEIGHT"));
      return;
    }

    const beforeYear = page.getAttribute("data-active-year");
    const targetCard = mobileCards[Math.min(5, mobileCards.length - 1)];
    targetCard.scrollIntoView({ block: "center" });

    setTimeout(() => {
      const afterYear = page.getAttribute("data-active-year");
      const rect = targetCard.getBoundingClientRect();

      window.scrollTo(0, 0);

      if (!beforeYear || !afterYear || beforeYear === afterYear) {
        reject(new Error(\`ACHIEVEMENTS_MOBILE_SCROLL_STATIC:\${beforeYear}->\${afterYear}\`));
        return;
      }

      if (rect.left < -1 || rect.right > window.innerWidth + 1) {
        reject(new Error(\`ACHIEVEMENTS_MOBILE_CARD_OVERFLOW:\${Math.round(rect.left)}:\${Math.round(rect.right)}\`));
        return;
      }

      resolve(\`ACHIEVEMENTS_MOBILE_OK:\${beforeYear}->\${afterYear}\`);
    }, 350);
    return;
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
    "Design Roles",
    "Engineering Roles",
    "Business Roles"
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

  if (document.querySelector("[data-recruitment-families], [data-available-role-families]")) {
    throw new Error("RECRUITMENT_TAGS_STILL_VISIBLE");
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
    "Design Roles",
    "Engineering Roles",
    "Business Roles"
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

  if (document.querySelector("[data-available-role-families], [data-recruitment-families]")) {
    throw new Error("AVAILABLE_ROLES_TAGS_STILL_VISIBLE");
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
    design: ["Design Roles.", "Shape how Sunswift is seen"],
    engineering: ["Engineering Roles.", "Design, build, test"],
    business: ["Business Roles.", "Run the project around the car"]
  };

  for (const phrase of expectedByStream[stream] ?? []) {
    if (!text.includes(phrase)) {
      throw new Error("MISSING_ROLE_STREAM_COPY:" + stream + ":" + phrase);
    }
  }

  if (cards.length < 1 && !document.querySelector("[data-role-stream-empty]")) {
    throw new Error("MISSING_ROLE_STREAM_CARDS:" + stream + ":" + cards.length);
  }

  if (document.querySelector("[data-available-role-families], [data-recruitment-families]")) {
    throw new Error("ROLE_STREAM_TAGS_STILL_VISIBLE:" + stream);
  }

  return "ROLE_STREAM_OK:" + stream + ":" + cards.length;
})()`

const vehiclesContract = `(() => new Promise((resolve, reject) => {
  const page = document.querySelector("[data-vehicles-page]");
  const gallery = document.querySelector("[data-vehicles-gallery]");
  const cards = document.querySelectorAll("[data-vehicle-card]");
  const text = document.body.textContent || "";

  if (document.title !== "Vehicles | Sunswift Racing") {
    reject(new Error("BAD_VEHICLES_TITLE:" + document.title));
    return;
  }

  if (!page || !gallery || cards.length < 8) {
    reject(new Error("MISSING_VEHICLES_GALLERY:" + cards.length));
    return;
  }

  const summary = document.querySelector("[data-vehicle-slug='sunswift-7'] span.text-white");
  if (!summary) {
    reject(new Error("VEHICLE_SUMMARY_NOT_HIGH_CONTRAST"));
    return;
  }

  const sr7 = document.querySelector("[data-vehicle-slug='sunswift-7']");
  if (!sr7) {
    reject(new Error("MISSING_SR7_CARD"));
    return;
  }
  sr7.click();

  setTimeout(() => {
    const detail = document.querySelector("[data-vehicle-detail][data-vehicle-slug='sunswift-7']");
    const carousel = detail?.querySelector("[data-vehicle-carousel]");
    const overview = detail?.querySelector("[data-vehicle-carousel-panel='overview']");
    const overviewTrigger = detail?.querySelector("[data-vehicle-carousel-trigger='overview']");
    const specs = detail?.querySelector("[data-vehicle-specs]");

    if (!detail || !carousel || !overview || !overviewTrigger || !specs) {
      reject(new Error("MISSING_VEHICLE_DETAIL_CONTRACT"));
      return;
    }

    if (carousel.compareDocumentPosition(specs) !== Node.DOCUMENT_POSITION_FOLLOWING) {
      reject(new Error("VEHICLE_SPECS_NOT_BELOW_CAROUSEL"));
      return;
    }

    if (!text.includes("SR-7") || text.includes("Related")) {
      reject(new Error("VEHICLES_COPY_OR_TAGS_INVALID"));
      return;
    }

    if (carousel.getAttribute("data-vehicle-carousel-mode") !== "achievements") {
      reject(new Error("VEHICLE_CAROUSEL_BAD_INITIAL_MODE"));
      return;
    }

    overviewTrigger.click();

    setTimeout(() => {
      if (carousel.getAttribute("data-vehicle-carousel-mode") !== "overview") {
        reject(new Error("VEHICLE_CAROUSEL_DID_NOT_SWITCH_ON_CLICK"));
        return;
      }
      resolve("VEHICLES_OK:" + cards.length);
    }, 650);
  }, 720);
}))()`

const partnersContract = `(() => {
  const page = document.querySelector("[data-partners-page]");
  const text = document.body.textContent || "";

  if (!page) {
    throw new Error("MISSING_PARTNERS_PAGE");
  }

  for (const phrase of [
    "Partners.",
    "Building world-class cars takes more than just engineering - it takes a community.",
    "Partners and sponsors",
    "Contact us",
    "active partners and sponsors"
  ]) {
    if (!text.includes(phrase)) {
      throw new Error("MISSING_PARTNERS_COPY:" + phrase);
    }
  }

  for (const removed of ["View grid", "Partner grid", "Powered by shared ambition"]) {
    if (text.includes(removed)) {
      throw new Error("REMOVED_PARTNERS_COPY_VISIBLE:" + removed);
    }
  }

  const grid = document.querySelector("[data-partners-grid]");
  const cards = document.querySelectorAll("[data-partner-card]");
  if (!grid || cards.length < 3) {
    throw new Error("MISSING_PARTNERS_GRID:" + cards.length);
  }

  if (document.querySelector("[data-partners-marquee]")) {
    throw new Error("REMOVED_PARTNERS_MARQUEE_VISIBLE");
  }

  return "PARTNERS_OK:" + cards.length;
})()`

const teamContract = `(() => new Promise((resolve, reject) => {
  const page = document.querySelector("[data-team-page]");
  const filter = document.querySelector("[data-team-filter]");
  const grid = document.querySelector("[data-team-grid]");
  const departmentCount = document.querySelector("[data-team-department-count]");

  if (!page || !filter || !grid || !departmentCount) {
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
      if (businessCards.length < 1 || businessCards.length >= initialCards.length) {
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

      const visibleCountLabel = document.body.textContent || "";
      if (visibleCountLabel.includes("In view") || visibleCountLabel.includes("profiles")) {
        reject(new Error("TEAM_OLD_COUNT_COPY_VISIBLE"));
        return;
      }

      const count = Number((departmentCount.textContent || "").trim());
      if (!Number.isFinite(count) || count < 7) {
        reject(new Error("TEAM_DEPARTMENT_COUNT_INVALID:" + count));
        return;
      }

      resolve("TEAM_CONTRACT_OK:" + businessCards.length);
    });
  });
}))()`

const mediaHighlightsContract = `(() => {
  const page = document.querySelector("[data-media-highlights-page]");
  const spotlight = document.querySelector("[data-media-spotlight]");
  const journey = document.querySelector("[data-media-journey]");
  const partnerships = document.querySelectorAll("[data-media-partnership]");
  const teamHighlights = document.querySelectorAll("[data-media-team-highlight]");
  const partnerVideos = document.querySelectorAll("[data-media-partner-video]");
  const juicer = document.querySelector("[data-juicer-sidebar]");
  const scrollRows = document.querySelectorAll("[data-media-highlight-row]");
  const cards = document.querySelectorAll("[data-media-highlight-card]");
  const spotlightEmbed = document.querySelector("[data-media-spotlight-embed] iframe");

  if (!page || !spotlight || !journey || !juicer) {
    throw new Error("MISSING_MEDIA_HIGHLIGHTS_PAGE");
  }

  if (!spotlightEmbed || !(spotlightEmbed.getAttribute("src") || "").includes("youtube-nocookie.com/embed")) {
    throw new Error("MISSING_MEDIA_SPOTLIGHT_YOUTUBE_EMBED");
  }

  const text = document.body.textContent || "";
  for (const phrase of [
    "Highlights.",
    "Amazon Web Services & Sunswift Racing: Solar powered journey across the Australian Outback",
    "Sunswift 7's Journey to a World Record",
    "Part 1: New Beginnings",
    "Part 2: Silver Linings",
    "Part 3: Test. Break. Fix. Repeat.",
    "Part 4: World Record Attempt",
    "Partnership Spotlights",
    "Auto-UX Partners with UNSW Sunswift Racing",
    "Optiver partners with UNSW Sunswift Racing to drive innovation for a better future",
    "Team Highlights",
    "Sunswift at AWS Summit 2024",
    "Sunswift & Optus Remote Driving Initiative"
  ]) {
    if (!text.includes(phrase)) {
      throw new Error("MISSING_MEDIA_COPY:" + phrase);
    }
  }

  if (partnerships.length < 6) {
    throw new Error("MISSING_MEDIA_PARTNERSHIPS:" + partnerships.length);
  }

  if (teamHighlights.length < 3) {
    throw new Error("MISSING_MEDIA_TEAM_HIGHLIGHTS:" + teamHighlights.length);
  }

  if (partnerVideos.length !== 2) {
    throw new Error("MISSING_MEDIA_PARTNER_VIDEOS:" + partnerVideos.length);
  }

  if (scrollRows.length < 6) {
    throw new Error("MISSING_MEDIA_SCROLL_ROWS:" + scrollRows.length);
  }

  if (cards.length < 18) {
    throw new Error("MISSING_MEDIA_HIGHLIGHT_LINK_CARDS:" + cards.length);
  }

  const iframe = juicer.querySelector('iframe[src*="juicer.io"]');
  if (!iframe) {
    throw new Error("MISSING_JUICER_IFRAME");
  }

  return "MEDIA_HIGHLIGHTS_OK:" + partnerships.length + ":" + teamHighlights.length + ":" + scrollRows.length;
})()`

const contactContract = `(() => {
  const page = document.querySelector("[data-contact-page]");
  const emailLink = document.querySelector("[data-contact-email-link]");

  if (!page || !emailLink) {
    throw new Error("MISSING_CONTACT_PAGE");
  }

  const href = emailLink.getAttribute("href") || "";
  if (href !== "mailto:richard.hopkins1@unsw.edu.au") {
    throw new Error("CONTACT_EMAIL_HREF_WRONG:" + href);
  }

  const text = document.body.textContent || "";
  for (const phrase of [
    "Contact us.",
    "Email Richard Hopkins",
    "richard.hopkins1@unsw.edu.au",
    "Message us online.",
    "Social media",
    "Instagram",
    "Room G14, Blockhouse (G6), University Mall, UNSW, Kensington NSW 2052"
  ]) {
    if (!text.includes(phrase)) {
      throw new Error("MISSING_CONTACT_COPY:" + phrase);
    }
  }

  const socialLinks = document.querySelectorAll("[data-contact-social-link]");
  if (socialLinks.length !== 3) {
    throw new Error("MISSING_CONTACT_SOCIAL_LINKS:" + socialLinks.length);
  }

  if (document.querySelector("form,input,textarea")) {
    throw new Error("CONTACT_FORM_PRESENT");
  }

  return "CONTACT_OK";
})()`

const adminLoginContract = `(() => {
  const text = document.body.textContent || "";
  const url = window.location.pathname;

  if (!url.includes("/admin/login")) {
    throw new Error("ADMIN_DID_NOT_REDIRECT_TO_LOGIN:" + url);
  }

  for (const phrase of ["Sunswift CMS", "Admin login", "Continue with Google"]) {
    if (!text.includes(phrase)) {
      throw new Error("MISSING_ADMIN_LOGIN_COPY:" + phrase);
    }
  }

  return "ADMIN_LOGIN_OK";
})()`

const commands = [
  ["open", baseUrl],
  ["set", "viewport", "1440", "1000"],
  ["reload"],
  ["wait", "--load", "networkidle"],
  ["eval", pageIsHealthy],
  ["eval", siteFooterContract],
  ["eval", homepageContract],
  ["eval", heroIntroEffectWorks],
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
  ["eval", heroIntroEffectWorks],
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
  ["open", vehiclesUrl],
  ["wait", "--load", "networkidle"],
  ["eval", pageIsHealthy],
  ["eval", siteFooterContract],
  ["eval", vehiclesContract],
  ["screenshot", "--annotate"],
  ["snapshot", "-i"],
  ["open", mediaUrl],
  ["wait", "--load", "networkidle"],
  ["eval", pageIsHealthy],
  ["eval", siteFooterContract],
  ["eval", mediaHighlightsContract],
  ["screenshot", "--annotate"],
  ["snapshot", "-i"],
  ["open", contactUrl],
  ["wait", "--load", "networkidle"],
  ["eval", pageIsHealthy],
  ["eval", siteFooterContract],
  ["eval", contactContract],
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
  ["open", adminUrl],
  ["wait", "--load", "networkidle"],
  ["eval", pageIsHealthy],
  ["eval", adminLoginContract],
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
