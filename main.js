"use strict";

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");
const heroHeader = document.querySelector(".hero-header");
const supportsObserver = "IntersectionObserver" in window;

if (menuToggle && mobileMenu) {
  const closeMobileMenu = () => {
    mobileMenu.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "\u2630";
  };

  closeMobileMenu();

  menuToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("active");
    menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    menuToggle.textContent = isOpen ? "\u2715" : "\u2630";
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  document.addEventListener("click", (event) => {
    if (!mobileMenu.contains(event.target) && !menuToggle.contains(event.target)) {
      closeMobileMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1050) {
      closeMobileMenu();
    }
  });
}

const navLinks = document.querySelectorAll(".desktop-nav a, .mobile-menu a, .header-actions a[data-nav]");
const currentFile = window.location.pathname.split("/").pop() || "index.html";
const currentPageMap = {
  "index.html": "home",
  "about.html": "about",
  "services.html": "services",
  "portfolio.html": "portfolio",
  "blog.html": "blog",
  "contact.html": "contact",
  "video.html": "home",
  "technologies.html": "home",
  "stats.html": "home",
  "industries.html": "home",
  "faq.html": "home",
  "project.html": "contact",
};
const activeNav = currentPageMap[currentFile] || "home";

navLinks.forEach((link) => {
  link.classList.toggle("nav-active", link.getAttribute("data-nav") === activeNav);
});

let progressBar = document.querySelector(".scroll-progress");
if (!progressBar) {
  progressBar = document.createElement("div");
  progressBar.className = "scroll-progress";
  document.body.appendChild(progressBar);
}

const updateScrollProgress = () => {
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
  progressBar.style.width = `${Math.max(0, Math.min(100, scrolled))}%`;
};

const updateHeaderState = () => {
  if (!heroHeader) {
    return;
  }
  heroHeader.classList.toggle("is-scrolled", window.scrollY > 24);
};

let isScrollFrameQueued = false;
const handleScroll = () => {
  if (isScrollFrameQueued) {
    return;
  }
  isScrollFrameQueued = true;
  requestAnimationFrame(() => {
    updateScrollProgress();
    updateHeaderState();
    isScrollFrameQueued = false;
  });
};

window.addEventListener("scroll", handleScroll, { passive: true });
window.addEventListener("resize", updateScrollProgress);
updateScrollProgress();
updateHeaderState();

if (!prefersReducedMotion) {
  const floatingLayer = document.createElement("div");
  floatingLayer.className = "floating-elements";

  for (let index = 0; index < 11; index += 1) {
    const dot = document.createElement("span");
    dot.className = "floating-dot";

    const size = 8 + Math.random() * 22;
    const left = Math.random() * 100;
    const delay = -(Math.random() * 18);
    const duration = 14 + Math.random() * 20;
    const shift = Math.round((Math.random() - 0.5) * 120);

    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;
    dot.style.left = `${left}%`;
    dot.style.bottom = "-40px";
    dot.style.animationDelay = `${delay}s`;
    dot.style.setProperty("--dur", `${duration}s`);
    dot.style.setProperty("--x-shift", `${shift}px`);

    floatingLayer.appendChild(dot);
  }

  document.body.appendChild(floatingLayer);
}

const revealTargets = document.querySelectorAll(
  "section, .top-contact-bar, .announcement-bar, .modern-footer, .service-card, .portfolio-card, .tech-card, .industry-item, .contact-card, .who-card, .testimonial-card, .faq-item, .project-contact-form-card, .project-contact-visual, .studio-feature-card, .studio-service-card, .studio-showcase-card, .studio-process-step, .studio-tech-item, .builder-review-card"
);

if (revealTargets.length) {
  if (prefersReducedMotion || !supportsObserver) {
    revealTargets.forEach((target) => {
      target.classList.add("reveal-item", "is-visible");
    });
  } else {
    const observer = new IntersectionObserver(
      (entries, activeObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          entry.target.classList.add("is-visible");
          activeObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -48px 0px",
      }
    );

    revealTargets.forEach((target, index) => {
      target.classList.add("reveal-item");
      if (target.matches(".service-card, .portfolio-card, .testimonial-card, .who-card, .contact-card, .studio-feature-card, .studio-service-card, .studio-showcase-card, .studio-process-step, .studio-tech-item, .builder-review-card")) {
        target.style.transitionDelay = `${Math.min(220, (index % 6) * 45)}ms`;
      }
      observer.observe(target);
    });
  }
}

const sections = document.querySelectorAll("section");
if (sections.length && !prefersReducedMotion && supportsObserver) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("section-active", entry.isIntersecting);
      });
    },
    {
      threshold: 0.45,
      rootMargin: "-15% 0px -20% 0px",
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

const heroContent = document.querySelector(".hero-content");
if (heroContent) {
  requestAnimationFrame(() => heroContent.classList.add("animate-in"));
}

const heroSlides = Array.from(document.querySelectorAll(".hero-slideshow .hero-slide"));
if (heroSlides.length > 1) {
  let activeIndex = 0;
  const heroSlideDelay = 4700;
  const ensureSlideBackground = (slide) => {
    if (!slide) {
      return;
    }
    const imageSource = slide.getAttribute("data-bg");
    if (!imageSource) {
      return;
    }
    slide.style.backgroundImage = `url('${imageSource}')`;
    slide.removeAttribute("data-bg");
  };

  const showSlide = (nextIndex) => {
    ensureSlideBackground(heroSlides[nextIndex]);
    heroSlides[activeIndex].classList.remove("active");
    activeIndex = nextIndex;
    heroSlides[activeIndex].classList.add("active");
    ensureSlideBackground(heroSlides[(activeIndex + 1) % heroSlides.length]);
  };

  if (!heroSlides.some((slide) => slide.classList.contains("active"))) {
    heroSlides[0].classList.add("active");
  }
  activeIndex = Math.max(
    0,
    heroSlides.findIndex((slide) => slide.classList.contains("active"))
  );
  ensureSlideBackground(heroSlides[activeIndex]);
  ensureSlideBackground(heroSlides[(activeIndex + 1) % heroSlides.length]);

  if (!prefersReducedMotion) {
    window.setInterval(() => {
      const nextIndex = (activeIndex + 1) % heroSlides.length;
      showSlide(nextIndex);
    }, heroSlideDelay);
  }
}

const faqItems = Array.from(document.querySelectorAll(".faq-item"));
const faqAnswers = Array.from(document.querySelectorAll(".faq-answer"));

if (faqItems.length && faqAnswers.length) {
  const setActiveFaq = (targetItem) => {
    const answerId = targetItem.getAttribute("data-faq");

    faqItems.forEach((item) => {
      const isActive = item === targetItem;
      item.classList.toggle("active", isActive);
      const icon = item.querySelector(".faq-icon");
      if (icon) {
        icon.textContent = isActive ? "\u2212" : "+";
      }
    });

    faqAnswers.forEach((answer) => {
      answer.classList.toggle("active", answer.id === answerId);
    });
  };

  faqItems.forEach((item) => {
    item.addEventListener("click", () => setActiveFaq(item));
  });

  setActiveFaq(faqItems.find((item) => item.classList.contains("active")) || faqItems[0]);
}

const communityTabs = Array.from(document.querySelectorAll(".community-tab"));
const communityCopies = Array.from(document.querySelectorAll(".community-copy"));

if (communityTabs.length && communityCopies.length) {
  const setCommunityTab = (activeTab) => {
    const target = activeTab.getAttribute("data-tab");

    communityTabs.forEach((tab) => {
      tab.classList.toggle("active", tab === activeTab);
    });

    communityCopies.forEach((copy) => {
      copy.classList.toggle("active", copy.getAttribute("data-content") === target);
    });
  };

  communityTabs.forEach((tab) => {
    tab.addEventListener("click", () => setCommunityTab(tab));
  });

  setCommunityTab(communityTabs.find((tab) => tab.classList.contains("active")) || communityTabs[0]);
}

const counters = Array.from(document.querySelectorAll(".stat-main[data-target]"));
const statsSection = document.querySelector(".stats-section");

if (counters.length && statsSection) {
  let counterStarted = false;

  const animateCounter = (counter) => {
    const targetValue = Number(counter.getAttribute("data-target"));
    if (!targetValue || Number.isNaN(targetValue)) {
      return;
    }

    let startTime = null;
    const duration = 1600;

    const step = (timestamp) => {
      if (!startTime) {
        startTime = timestamp;
      }

      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentValue = Math.floor(progress * targetValue);
      counter.textContent = `${currentValue.toLocaleString()}+`;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  const startCounters = () => {
    if (counterStarted) {
      return;
    }
    counterStarted = true;
    counters.forEach((counter) => animateCounter(counter));
  };

  if (prefersReducedMotion || !supportsObserver) {
    startCounters();
  } else {
    const counterObserver = new IntersectionObserver(
      (entries, activeObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startCounters();
            activeObserver.disconnect();
          }
        });
      },
      { threshold: 0.42 }
    );
    counterObserver.observe(statsSection);
  }
}

const studioFilterTabs = Array.from(document.querySelectorAll(".studio-filter-tab"));
const studioShowcaseCards = Array.from(document.querySelectorAll(".studio-showcase-card"));

if (studioFilterTabs.length && studioShowcaseCards.length) {
  const applyStudioFilter = (filterKey) => {
    studioFilterTabs.forEach((tab) => {
      const isActive = tab.getAttribute("data-filter") === filterKey;
      tab.classList.toggle("active", isActive);
      tab.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    studioShowcaseCards.forEach((card) => {
      const types = (card.getAttribute("data-types") || "").split(/\s+/).filter(Boolean);
      const visible = filterKey === "all" || types.includes(filterKey);
      card.classList.toggle("is-hidden", !visible);
    });
  };

  studioFilterTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      applyStudioFilter(tab.getAttribute("data-filter") || "all");
    });
  });

  const activeTab = studioFilterTabs.find((tab) => tab.classList.contains("active")) || studioFilterTabs[0];
  applyStudioFilter(activeTab.getAttribute("data-filter") || "all");
}

const parallaxTargets = Array.from(document.querySelectorAll("[data-parallax]"));

if (parallaxTargets.length && !prefersReducedMotion) {
  let animationFrame = null;
  let pointerX = 0;
  let pointerY = 0;

  const renderParallax = () => {
    parallaxTargets.forEach((target) => {
      const factor = Number(target.getAttribute("data-parallax")) || 0.012;
      const moveX = pointerX * factor * 80;
      const moveY = pointerY * factor * 80;
      target.style.transform = `translate3d(${moveX.toFixed(2)}px, ${moveY.toFixed(2)}px, 0)`;
    });
    animationFrame = null;
  };

  const handlePointerMove = (event) => {
    pointerX = event.clientX / window.innerWidth - 0.5;
    pointerY = event.clientY / window.innerHeight - 0.5;

    if (!animationFrame) {
      animationFrame = requestAnimationFrame(renderParallax);
    }
  };

  const resetParallax = () => {
    pointerX = 0;
    pointerY = 0;
    if (!animationFrame) {
      animationFrame = requestAnimationFrame(renderParallax);
    }
  };

  window.addEventListener("pointermove", handlePointerMove, { passive: true });
  window.addEventListener("blur", resetParallax);
  document.addEventListener("pointerleave", resetParallax);
}
