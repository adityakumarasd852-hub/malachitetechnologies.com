document.documentElement.style.overflowY = "auto";
document.documentElement.style.overflowX = "hidden";
document.body.style.overflowY = "hidden";
document.body.style.overflowX = "hidden";

const enforceSingleScrollbar = () => {
  document.documentElement.style.overflowY = "auto";
  document.documentElement.style.overflowX = "hidden";

  document.body.style.overflowY = "hidden";
  document.body.style.overflowX = "hidden";
};

enforceSingleScrollbar();

window.addEventListener("load", () => {
  enforceSingleScrollbar();

  document.body.classList.remove("no-scroll");
  document.documentElement.classList.remove("no-scroll");
});

const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");

if (menuToggle && mobileMenu) {
  const closeMobileMenu = () => {
    mobileMenu.classList.remove("active");
    menuToggle.textContent = "\u2630";
  };

  menuToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");
    menuToggle.textContent = mobileMenu.classList.contains("active") ? "\u2715" : "\u2630";
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1100) {
      closeMobileMenu();
    }
  });
}

const companyDropdown = document.querySelector(".company-dropdown");
const companyTrigger = companyDropdown?.querySelector(".company-trigger");

if (companyDropdown && companyTrigger) {
  const closeCompanyMenu = () => {
    companyDropdown.classList.remove("open");
    companyTrigger.setAttribute("aria-expanded", "false");
  };

  companyTrigger.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    const isOpen = companyDropdown.classList.toggle("open");
    companyTrigger.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  document.addEventListener("click", (event) => {
    if (!companyDropdown.contains(event.target)) {
      closeCompanyMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeCompanyMenu();
    }
  });

  companyDropdown.querySelectorAll(".company-mega-menu a").forEach((link) => {
    link.addEventListener("click", closeCompanyMenu);
  });
}

const faqItems = document.querySelectorAll(".faq-item");
const faqAnswers = document.querySelectorAll(".faq-answer");

faqItems.forEach((item) => {
  item.addEventListener("click", () => {
    const target = item.getAttribute("data-faq");

    faqItems.forEach((btn) => {
      btn.classList.remove("active");
      const icon = btn.querySelector(".faq-icon");
      if (icon) {
        icon.textContent = "+";
      }
    });

    faqAnswers.forEach((answer) => {
      answer.classList.remove("active");
    });

    item.classList.add("active");
    const itemIcon = item.querySelector(".faq-icon");
    if (itemIcon) {
      itemIcon.textContent = "\u2212";
    }

    const activeAnswer = document.getElementById(target);
    if (activeAnswer) {
      activeAnswer.classList.add("active");
    }
  });
});

const heroContent = document.querySelector(".hero-content");
if (heroContent) {
  requestAnimationFrame(() => {
    heroContent.classList.add("animate-in");
  });
}

const progressBar = document.createElement("div");
progressBar.className = "scroll-progress";
document.body.appendChild(progressBar);

const updateScrollProgress = () => {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
  progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
};

window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateScrollProgress);
updateScrollProgress();

const revealTargets = document.querySelectorAll(
  ".top-contact-bar, .announcement-bar, .brand-video-section, .brand-video-card, .tech-section, .about-section, .services-section, .portfolio-section, .stats-section, .industries-section, .community-section, .contact-modern, .faq-section, .project-contact-section, .modern-footer, .service-card, .portfolio-card, .contact-card, .faq-layout, .community-panel, .project-contact-layout"
);

if (revealTargets.length) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -60px 0px",
    }
  );

  revealTargets.forEach((target) => {
    target.classList.add("reveal-item");
    revealObserver.observe(target);
  });
}

const aboutSections = document.querySelectorAll(".about-section");

if (aboutSections.length) {
  aboutSections.forEach((section) => {
    section.classList.add("about-anim-ready");
  });

  const aboutObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("about-animate-in");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  aboutSections.forEach((section) => {
    aboutObserver.observe(section);
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

const communityTabs = document.querySelectorAll(".community-tab");
const communityCopies = document.querySelectorAll(".community-copy");

if (communityTabs.length && communityCopies.length) {
  const initialTab = document.querySelector(".community-tab.active") || communityTabs[0];
  const initialTarget = initialTab?.getAttribute("data-tab");
  if (initialTarget) {
    communityCopies.forEach((content) => {
      content.classList.toggle("active", content.getAttribute("data-content") === initialTarget);
    });
  }

  communityTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.getAttribute("data-tab");

      communityTabs.forEach((item) => item.classList.remove("active"));
      tab.classList.add("active");

      communityCopies.forEach((content) => {
        content.classList.remove("active");
        if (content.getAttribute("data-content") === target) {
          content.classList.add("active");
        }
      });
    });
  });
}

const counters = document.querySelectorAll(".stat-main[data-target]");
const statsSection = document.querySelector(".stats-section");
let counterStarted = false;

const animateCounter = (counter) => {
  const target = Number(counter.getAttribute("data-target"));
  if (!target || Number.isNaN(target)) {
    return;
  }
  let count = 0;
  const speed = target / 120;

  const updateCount = () => {
    if (count < target) {
      count += speed;
      counter.innerText = `${Math.floor(count).toLocaleString()}+`;
      requestAnimationFrame(updateCount);
    } else {
      counter.innerText = `${target.toLocaleString()}+`;
    }
  };

  updateCount();
};

if (statsSection && counters.length) {
  const tryStartCounters = () => {
    const sectionTop = statsSection.offsetTop;
    const screenHeight = window.innerHeight;
    if (!counterStarted && window.scrollY > sectionTop - screenHeight + 100) {
      counters.forEach((counter) => animateCounter(counter));
      counterStarted = true;
    }
  };

  window.addEventListener("scroll", tryStartCounters, { passive: true });
  tryStartCounters();
}
