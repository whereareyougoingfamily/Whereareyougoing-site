// ===================================================================
// Where Are You Going — site interactions
// ===================================================================

/* ---- Stripe payment links: replace these with real Payment Links ----
   Create at https://dashboard.stripe.com/payment-links               */
const STRIPE_LINKS = {
  25: "#", // https://buy.stripe.com/xxxxxxxxxxxx25
  50: "#", // https://buy.stripe.com/xxxxxxxxxxxx50
  100: "#", // https://buy.stripe.com/xxxxxxxxxxxx100
};

/* ---- Formspree endpoint: replace with your form's endpoint ----
   Sign up at https://formspree.io, create a form, paste the URL here */
const FORM_ENDPOINT = ""; // e.g. "https://formspree.io/f/abcdwxyz"

document.addEventListener("DOMContentLoaded", () => {
  initYear();
  initMobileNav();
  initHeaderScrollState();
  initActiveNavLink();
  initScrollReveal();
  initImpactCounters();
  initHelpFlow();
  initDonateAmounts();
  initShareForm();
  initHelpForm();
  initVolunteerForm();
  initStoryVideos();
});

/* ---------------------------------------------------------------- */
function initYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
}

/* ---------------------------------------------------------------- */
function initMobileNav() {
  const menuBtn = document.getElementById("menuBtn");
  const navLinks = document.getElementById("navLinks");
  if (!menuBtn || !navLinks) return;

  menuBtn.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    menuBtn.textContent = isOpen ? "✕" : "☰";
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuBtn.textContent = "☰";
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });
}

/* ---------------------------------------------------------------- */
function initHeaderScrollState() {
  const header = document.querySelector("header");
  if (!header) return;
  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---------------------------------------------------------------- */
function initActiveNavLink() {
  const links = Array.from(document.querySelectorAll(".nav-links a[href^='#']"));
  if (!links.length) return;
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (!("IntersectionObserver" in window) || !sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = "#" + entry.target.id;
          links.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === id);
          });
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ---------------------------------------------------------------- */
function initScrollReveal() {
  const targets = document.querySelectorAll(
    ".section-head, .answer-card, .impact-item, .story, .journey-step, .involve-card, .photo-block, .about-copy, .help-flow, .share-box, .trust-box"
  );
  targets.forEach((el) => el.setAttribute("data-reveal", ""));

  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("in-view"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((el) => observer.observe(el));
}

/* ---------------------------------------------------------------- */
function initImpactCounters() {
  const nums = document.querySelectorAll(".impact-num[data-target]");
  if (!nums.length) return;

  const animate = (el) => {
    const target = parseInt(el.getAttribute("data-target"), 10) || 0;
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if (!("IntersectionObserver" in window)) {
    nums.forEach(animate);
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  nums.forEach((el) => observer.observe(el));
}

/* ---------------------------------------------------------------- */
function initHelpFlow() {
  const step1 = document.getElementById("helpStep1");
  const step2 = document.getElementById("helpStep2");
  const backBtn = document.getElementById("helpBack");
  const catLabel = document.getElementById("helpSelectedCat");
  const catInput = document.getElementById("hCategory");
  const urgentLabel = document.getElementById("hUrgentLabel");

  if (!step1 || !step2) return;

  document.querySelectorAll(".category-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const cat = btn.getAttribute("data-cat");
      catLabel.textContent = cat;
      catInput.value = cat;
      if (urgentLabel) {
        urgentLabel.textContent =
          cat === "Emergency support"
            ? "What's the emergency? Please be specific."
            : "Anything urgent we should know right away?";
      }
      step1.style.display = "none";
      step2.style.display = "block";
    });
  });

  if (backBtn) {
    backBtn.addEventListener("click", () => {
      step2.style.display = "none";
      step1.style.display = "block";
    });
  }
}

/* ---------------------------------------------------------------- */
function initDonateAmounts() {
  const wrap = document.getElementById("donateAmounts");
  const donateBtn = document.getElementById("donateBtn");
  if (!wrap || !donateBtn) return;

  let currentAmount = 50;

  wrap.querySelectorAll(".amount-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      wrap.querySelectorAll(".amount-btn").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");

      const raw = btn.getAttribute("data-amount");
      if (raw === "custom") {
        const entered = window.prompt("Enter a custom donation amount (USD):", "");
        const parsed = parseInt(entered, 10);
        if (!parsed || parsed <= 0) {
          btn.classList.remove("selected");
          return;
        }
        currentAmount = parsed;
        donateBtn.textContent = `Give $${parsed}`;
        donateBtn.href = "#"; // no preset Stripe link for custom amounts
        return;
      }

      currentAmount = parseInt(raw, 10);
      donateBtn.textContent = `Give $${currentAmount}`;
      donateBtn.href = STRIPE_LINKS[currentAmount] || "#";
    });
  });
}

/* ---------------------------------------------------------------- */
function handleFormSubmit(form, statusEl, successMessage) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector("button[type='submit']");
    if (submitBtn) submitBtn.disabled = true;
    statusEl.textContent = "Sending…";

    const data = Object.fromEntries(new FormData(form).entries());

    if (FORM_ENDPOINT) {
      try {
        const res = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form),
        });
        if (res.ok) {
          statusEl.textContent = successMessage;
          form.reset();
        } else {
          statusEl.textContent = "Something went wrong — please try again.";
        }
      } catch (err) {
        statusEl.textContent = "Something went wrong — please try again.";
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
      return;
    }

    // Local-only placeholder — remove once FORM_ENDPOINT is set above.
    console.log("Form submission (not yet sent anywhere):", data);
    setTimeout(() => {
      statusEl.textContent = successMessage;
      form.reset();
      if (submitBtn) submitBtn.disabled = false;
    }, 500);
  });
}

/* ---------------------------------------------------------------- */
function initStoryVideos() {
  document.querySelectorAll("[data-video-wrap]").forEach((wrap) => {
    const video = wrap.querySelector("video");
    const overlay = wrap.querySelector(".play-overlay");
    if (!video || !overlay) return;

    overlay.addEventListener("click", () => {
      video.setAttribute("controls", "");
      video.play();
      overlay.classList.add("hidden");
    });
    video.addEventListener("pause", () => {
      if (video.currentTime > 0 && !video.ended) return;
      overlay.classList.remove("hidden");
    });
    video.addEventListener("ended", () => {
      overlay.classList.remove("hidden");
      video.removeAttribute("controls");
    });
  });
}

function initShareForm() {
  const form = document.getElementById("shareForm");
  const status = document.getElementById("shareStatus");
  if (form && status) {
    handleFormSubmit(form, status, "Thank you for sharing — we hear you.");
  }
}

function initHelpForm() {
  const form = document.getElementById("helpForm");
  const status = document.getElementById("helpStatus");
  if (form && status) {
    handleFormSubmit(form, status, "Got it — someone from our team will reach out soon.");
  }
}

function initVolunteerForm() {
  const form = document.getElementById("volunteerForm");
  const status = document.getElementById("volunteerStatus");
  if (form && status) {
    handleFormSubmit(form, status, "Thanks for signing up — welcome to the team!");
  }
}
