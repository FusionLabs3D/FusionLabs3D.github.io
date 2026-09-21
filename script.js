/**
 * FusionLabs3D — Cinematic Saffron Gradient Interactive Engine
 * 1. Zero-Flicker Light/Dark Mode Switcher
 * 2. Siemens-Style Hero Multi-Slide Carousel & Controls
 * 3. Sector Solutions 3-Column Switcher
 * 4. Autodesk Material Catalog Filter & Dropdown Parameter Sync
 * 5. Header Elevation on Scroll
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. THEME SWITCHER (DARK / LIGHT MODE)
  // ==========================================================================
  const themeToggle = document.getElementById('themeToggle');

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    try {
      localStorage.setItem('fusionlabs3d_theme_v2', newTheme);
    } catch (e) {}
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  // ==========================================================================
  // 2. SIEMENS-STYLE HERO MULTI-SLIDE CAROUSEL (Unified Single-Swap & 7s/25s Timer)
  // ==========================================================================
  const unifiedTrack = document.getElementById('heroUnifiedTrack');
  const unifiedSlides = document.querySelectorAll('.hero-unified-slide');
  const prevBtn = document.getElementById('heroPrevBtn');
  const nextBtn = document.getElementById('heroNextBtn');
  const pauseBtn = document.getElementById('heroPauseBtn');
  const pauseIcon = document.getElementById('pauseIcon');
  const playIcon = document.getElementById('playIcon');
  const indicatorsContainer = document.getElementById('heroIndicators');

  let currentSlide = 0;
  const totalSlides = unifiedSlides.length || 3;
  let isPaused = false;
  let carouselTimer = null;
  const AUTO_DURATION = 7000;         // 7 seconds auto-advance
  const MANUAL_HOLD_DURATION = 25000; // 25 seconds hold after user clicks/selects manually

  function updateSlidePosition(index) {
    currentSlide = (index + totalSlides) % totalSlides;
    const offsetPercent = currentSlide * (100 / totalSlides);

    // Single unified swap: entire slide (text + image) translates together in complete lockstep
    if (unifiedTrack) {
      unifiedTrack.style.transform = `translateX(-${offsetPercent}%)`;
    }

    // Toggle active state for smooth opacity transition
    unifiedSlides.forEach((s, idx) => {
      if (idx === currentSlide) {
        s.classList.add('active');
      } else {
        s.classList.remove('active');
      }
    });

    // Update Indicators (pill for active, dot for others)
    if (indicatorsContainer) {
      const btns = indicatorsContainer.querySelectorAll('button');
      btns.forEach((btn, idx) => {
        if (idx === currentSlide) {
          btn.className = 'hero-ind-pill active';
        } else {
          btn.className = 'hero-ind-dot';
        }
      });
    }
  }

  function scheduleNext(delay) {
    if (carouselTimer) {
      clearTimeout(carouselTimer);
      carouselTimer = null;
    }
    if (!isPaused) {
      carouselTimer = setTimeout(() => {
        updateSlidePosition(currentSlide + 1);
        scheduleNext(AUTO_DURATION);
      }, delay);
    }
  }

  function handleManualChange(targetIndex) {
    updateSlidePosition(targetIndex);
    // User interacted manually: hold on this slide for 25 seconds before resuming auto-advance
    scheduleNext(MANUAL_HOLD_DURATION);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      handleManualChange(currentSlide - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      handleManualChange(currentSlide + 1);
    });
  }

  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      isPaused = !isPaused;
      if (isPaused) {
        if (carouselTimer) {
          clearTimeout(carouselTimer);
          carouselTimer = null;
        }
        if (pauseIcon) pauseIcon.style.display = 'none';
        if (playIcon) playIcon.style.display = 'block';
        pauseBtn.setAttribute('aria-label', 'Play Carousel');
      } else {
        if (pauseIcon) pauseIcon.style.display = 'block';
        if (playIcon) playIcon.style.display = 'none';
        pauseBtn.setAttribute('aria-label', 'Pause Carousel');
        scheduleNext(AUTO_DURATION);
      }
    });
  }

  if (indicatorsContainer) {
    indicatorsContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-slide-to]');
      if (btn) {
        const targetIdx = parseInt(btn.getAttribute('data-slide-to'), 10);
        handleManualChange(targetIdx);
      }
    });
  }

  // Initialize first slide and start auto-advance with 7s timer
  updateSlidePosition(0);
  scheduleNext(AUTO_DURATION);

  // ==========================================================================
  // 3. SECTOR SOLUTIONS 3-COLUMN INTERACTIVE SWITCHER
  // ==========================================================================
  const solutionsData = {
    aerospace: {
      tag: "DRONES & UAV AIRFRAMES",
      title: "High-strength, lightweight drone airframes & mounts in PA-CF.",
      desc: "High-stiffness carbon fiber composites engineered to resist torsional stresses and vibration while delivering significant weight savings over machined aluminum.",
      image: "assets/images/parts/pa6cf-bracket.jpg",
      linkText: "Submit CAD for Drone / UAV parts",
      linkUrl: "quote.html?material=pa-cf"
    },
    robotics: {
      tag: "ROBOTICS & AUTOMATION",
      title: "Low-friction end-effectors, guide blocks & structural arms.",
      desc: "Wear-resistant PA-GF and PA-CF components with integrated heat-set brass threaded inserts. Withstands cyclic friction and delivers reliable structural rigidity.",
      image: "assets/images/parts/pa6gf-block.jpg",
      linkText: "Submit CAD for Robotics parts",
      linkUrl: "quote.html?material=pa-gf"
    },
    automotive: {
      tag: "MOTORSPORT & FORMULA SAE",
      title: "Air intake runners, fluid reservoirs & brake cooling ducts in PPA-CF.",
      desc: "Thermal endurance up to 215°C HDT with zero creep or warping. Built to withstand race environments, heat cycles, fuels, and engine bay temperatures.",
      image: "assets/images/parts/ppa-cf.jpg",
      linkText: "Submit CAD for Motorsport parts",
      linkUrl: "quote.html?material=ppa-cf"
    },
    enclosures: {
      tag: "ELECTRONICS & IoT ENCLOSURES",
      title: "Weatherproof field housings & snap-fit electronics cases.",
      desc: "UV-stable ASA for outdoor field deployments and impact-resistant PETG housings with integrated gasket grooves for custom IoT hardware prototypes.",
      image: "assets/images/parts/asa-weatherproof.jpg",
      linkText: "Submit CAD for Enclosures",
      linkUrl: "quote.html?material=asa"
    },
    tooling: {
      tag: "RAPID TOOLING & FIXTURES",
      title: "Assembly jigs, alignment guides & inspection holding fixtures.",
      desc: "Rigid composite fixtures printed on-demand with tight dimensional repeatability to assist workshop assembly, drilling, and mechanical testing.",
      image: "assets/images/parts/pa6gf-fixture.jpg",
      linkText: "Submit CAD for Tooling & Jigs",
      linkUrl: "quote.html?material=pa-gf"
    }
  };

  const vTabs = document.querySelectorAll('.v-tab-btn');
  const featuredCaseCard = document.getElementById('featuredCaseCard');
  const featuredCaseImg = document.getElementById('featuredCaseImg');
  const featuredCaseBadge = document.getElementById('featuredCaseBadge');
  const featuredCaseTitle = document.getElementById('featuredCaseTitle');
  const featuredCaseDesc = document.getElementById('featuredCaseDesc');
  const featuredCaseLink = document.getElementById('featuredCaseLink');

  vTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      vTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const solKey = tab.getAttribute('data-solution');
      const data = solutionsData[solKey];

      if (data && featuredCaseCard) {
        featuredCaseCard.style.opacity = '0.5';
        featuredCaseCard.style.transform = 'translateY(4px)';

        setTimeout(() => {
          if (featuredCaseImg) featuredCaseImg.src = data.image;
          if (featuredCaseBadge) featuredCaseBadge.textContent = data.tag;
          if (featuredCaseTitle) featuredCaseTitle.textContent = data.title;
          if (featuredCaseDesc) featuredCaseDesc.textContent = data.desc;
          if (featuredCaseLink) {
            featuredCaseLink.href = data.linkUrl;
            featuredCaseLink.innerHTML = `<span>${data.linkText}</span> <span>&rarr;</span>`;
          }
          featuredCaseCard.style.opacity = '1';
          featuredCaseCard.style.transform = 'translateY(0)';
        }, 120);
      }
    });
  });

  // ==========================================================================
  // 4. MATERIAL CATALOG FILTERING & LIVE COUNTER
  // ==========================================================================
  const autodeskPillBtns = document.querySelectorAll('.autodesk-pill-btn');
  const autodeskCards = document.querySelectorAll('.autodesk-card');
  const materialsCounter = document.getElementById('materialsCounter');

  autodeskPillBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      autodeskPillBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-category') || 'all';
      let visibleCount = 0;

      autodeskCards.forEach((card, idx) => {
        const cardCat = card.getAttribute('data-category') || '';
        const isMatch = category === 'all' || cardCat === category;

        if (isMatch) {
          visibleCount++;
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20 + idx * 25);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(8px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 180);
        }
      });

      if (materialsCounter) {
        materialsCounter.textContent = `Showing ${visibleCount} calibrated engineering material${visibleCount === 1 ? '' : 's'}`;
      }
    });
  });

  // ==========================================================================
  // 5. HEADER ELEVATION ON SCROLL
  // ==========================================================================
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (header) {
      if (window.scrollY > 20) {
        header.style.boxShadow = '0 4px 24px rgba(0, 0, 0, 0.45)';
      } else {
        header.style.boxShadow = 'none';
      }
    }
  }, { passive: true });

  // ==========================================================================
  // 6. MOBILE NAVIGATION DRAWER
  // ==========================================================================
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileDrawerClose = document.getElementById('mobileDrawerClose');
  const mobileDrawerBackdrop = document.getElementById('mobileDrawerBackdrop');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function openMobileDrawer() {
    if (mobileDrawer && mobileDrawerBackdrop) {
      mobileDrawer.classList.add('open');
      mobileDrawerBackdrop.classList.add('open');
      mobileDrawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMobileDrawer() {
    if (mobileDrawer && mobileDrawerBackdrop) {
      mobileDrawer.classList.remove('open');
      mobileDrawerBackdrop.classList.remove('open');
      mobileDrawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', openMobileDrawer);
  }
  if (mobileDrawerClose) {
    mobileDrawerClose.addEventListener('click', closeMobileDrawer);
  }
  if (mobileDrawerBackdrop) {
    mobileDrawerBackdrop.addEventListener('click', closeMobileDrawer);
  }
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileDrawer);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('open')) {
      closeMobileDrawer();
    }
  });

});


