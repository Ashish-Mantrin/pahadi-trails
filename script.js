(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Reveal animations
  const observer =
    'IntersectionObserver' in window
      ? new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.12 },
        )
      : null;

  $$('.reveal').forEach((el) => {
    if (reduced.matches || !observer) {
      el.classList.add('is-visible');
    } else {
      observer.observe(el);
    }
  });

  // Subtle 3D card effects
  if (!reduced.matches && window.matchMedia('(pointer: fine)').matches) {
    $$('.tilt-card').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        if (!rect.width || !rect.height) return;

        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        card.style.transform =
          `perspective(800px) rotateY(${x * 5}deg) ` +
          `rotateX(${-y * 4}deg) translateY(-3px)`;
      });

      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
      });
    });
  }

  // Hero slider
  const hero = $('.hero');
  const heroImage = $('#heroImage');
  const heroTitle = $('#heroTitle');
  const heroDescription = $('#heroDescription');

  if (hero && heroImage && heroTitle && heroDescription) {
    const mediaHero = window.PAHADI_MEDIA?.hero || [];

    const slides = [
      {
        image:
          mediaHero[0] ||
          'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=2200&q=85',
        kicker: 'THE HIMALAYAN HIGHLANDS',
        title: 'Where the <em>Himalayas</em> touch the sky.',
        description:
          'Follow dramatic mountain ridgelines, quiet valleys and unforgettable Himalayan horizons.',
        location: 'THE HIMALAYAS, INDIA',
        primary: 'Plan your mountain escape',
        url: 'contact.html',
        secondary: 'Explore destinations',
        secondaryUrl: 'destinations.html',
      },
      {
        image:
          mediaHero[1] ||
          'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=2200&q=85',
        kicker: 'SACRED HIMALAYAN JOURNEYS',
        title: 'Find your way to <em>Kedarnath.</em>',
        description:
          'Discover the mountain pilgrimage, travel preparations and local guidance for a meaningful journey.',
        location: 'KEDARNATH · GARHWAL',
        primary: 'Plan a pilgrimage',
        url: 'char-dham.html',
        secondary: 'Kedarnath travel guide',
        secondaryUrl: 'destination-kedarnath.html',
      },
      {
        image:
          mediaHero[2] ||
          'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=2200&q=85',
        kicker: 'TIMELESS TEMPLE TOWNS',
        title: 'A journey to <em>Badrinath.</em>',
        description:
          'Explore a revered Himalayan shrine surrounded by high peaks, river valleys and living traditions.',
        location: 'BADRINATH · GARHWAL',
        primary: 'Plan a Char Dham trip',
        url: 'char-dham.html',
        secondary: 'Read destination guide',
        secondaryUrl: 'destination-badrinath.html',
      },
      {
        image:
          mediaHero[3] ||
          'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=2200&q=85',
        kicker: 'LAKESIDE DAYS & SLOW ESCAPES',
        title: 'Let the mountains <em>slow you down.</em>',
        description:
          'Spend unhurried days around lakes, forest trails and welcoming hill towns across Uttarakhand.',
        location: 'NAINITAL · KUMAON',
        primary: 'Plan a hill escape',
        url: 'contact.html',
        secondary: 'Explore Nainital',
        secondaryUrl: 'destination-nainital.html',
      },
    ];

    const copy = $('.hero-copy', hero);
    const kicker = $('#heroKicker');
    const location = $('#heroLocation');
    const number = $('#heroNumber');
    const primary = $('#heroPrimary');
    const secondary = $('#heroSecondary');
    const slideButtons = $$('[data-slide]', hero);

    let current = 0;
    let timer = null;
    let transitionTimer = null;
    let copyTimer = null;
    let busy = false;
    let paused = false;
    let touchStartX = null;

    const intervalMs = 5000;
    const transitionMs = reduced.matches ? 0 : 900;

    // Preload upcoming images before they are displayed.
    slides.forEach((slide, index) => {
      const image = new Image();
      image.decoding = 'async';
      image.src = slide.image;

      if (index === 0) {
        image.fetchPriority = 'high';
      }
    });

    function updateControls() {
      slideButtons.forEach((button, index) => {
        const active = index === current;
        button.classList.toggle('active', active);

        if (active) {
          button.setAttribute('aria-current', 'true');
        } else {
          button.removeAttribute('aria-current');
        }
      });

      if (number) {
        number.textContent = String(current + 1).padStart(2, '0');
      }
    }

    function applySlide(index) {
      const slide = slides[index];

      // Clear old animation classes and timers.
      clearTimeout(transitionTimer);
      clearTimeout(copyTimer);

      heroImage.classList.remove('is-changing', 'hero-image-enter');
      copy?.classList.remove('slide-out', 'hero-copy-enter');

      // Use a CSS custom property for the image transition.
      heroImage.style.setProperty('--hero-next-image', `url("${slide.image}")`);

      heroImage.style.backgroundImage =
        `linear-gradient(90deg, #092d29 0%, #092d2960 60%, #092d2910 100%), ` +
        `url("${slide.image}")`;

      if (kicker) kicker.textContent = slide.kicker;

      // The slide titles are trusted, static HTML defined above.
      heroTitle.innerHTML = slide.title;
      heroDescription.textContent = slide.description;

      if (location) location.textContent = slide.location;

      if (primary) {
        primary.href = slide.url;
        primary.innerHTML = `${slide.primary} <i class="bi bi-send ms-2" aria-hidden="true"></i>`;
      }

      if (secondary) {
        secondary.href = slide.secondaryUrl;
        secondary.innerHTML = `<i class="bi bi-compass me-2" aria-hidden="true"></i>${slide.secondary}`;
      }

      updateControls();

      if (reduced.matches) return;

      // Force a clean animation restart.
      void heroImage.offsetWidth;

      heroImage.classList.add('hero-image-enter');
      copy?.classList.add('hero-copy-enter');

      copyTimer = setTimeout(() => {
        copy?.classList.remove('hero-copy-enter');
      }, 900);

      transitionTimer = setTimeout(() => {
        heroImage.classList.remove('hero-image-enter');
        busy = false;
        restartAutoplay();
      }, 1000);
    }

    function showSlide(index, animate = true) {
      if (busy && animate) return;

      current = (index + slides.length) % slides.length;

      if (!animate || reduced.matches) {
        clearTimeout(transitionTimer);
        clearTimeout(copyTimer);

        heroImage.classList.remove('is-changing', 'hero-image-enter');
        copy?.classList.remove('slide-out', 'hero-copy-enter');

        busy = false;
        applySlide(current);
        return;
      }

      busy = true;
      stopAutoplay();

      heroImage.classList.add('is-changing');
      copy?.classList.add('slide-out');

      transitionTimer = setTimeout(() => {
        applySlide(current);
      }, 180);
    }

    function stopAutoplay() {
      if (timer !== null) {
        clearInterval(timer);
        timer = null;
      }
    }

    function restartAutoplay() {
      stopAutoplay();

      if (
        reduced.matches ||
        paused ||
        document.hidden ||
        slides.length < 2 ||
        busy
      ) {
        return;
      }

      timer = setInterval(() => {
        showSlide(current + 1);
      }, intervalMs);
    }

    function navigate(index) {
      showSlide(index);
      restartAutoplay();
    }

    $('#heroPrev')?.addEventListener('click', () => {
      navigate(current - 1);
    });

    $('#heroNext')?.addEventListener('click', () => {
      navigate(current + 1);
    });

    slideButtons.forEach((button) => {
      button.addEventListener('click', () => {
        navigate(Number(button.dataset.slide));
      });
    });

    // Pause on hover and keyboard focus.
    hero.addEventListener('mouseenter', () => {
      paused = true;
      stopAutoplay();
    });

    hero.addEventListener('mouseleave', () => {
      paused = false;
      restartAutoplay();
    });

    hero.addEventListener('focusin', () => {
      paused = true;
      stopAutoplay();
    });

    hero.addEventListener('focusout', () => {
      requestAnimationFrame(() => {
        if (!hero.contains(document.activeElement)) {
          paused = false;
          restartAutoplay();
        }
      });
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopAutoplay();
      } else {
        restartAutoplay();
      }
    });

    // Swipe support for mobile.
    hero.addEventListener(
      'touchstart',
      (event) => {
        touchStartX = event.changedTouches[0].clientX;
      },
      { passive: true },
    );

    hero.addEventListener(
      'touchend',
      (event) => {
        if (touchStartX === null) return;

        const deltaX = event.changedTouches[0].clientX - touchStartX;

        if (Math.abs(deltaX) > 50) {
          navigate(current + (deltaX < 0 ? 1 : -1));
        }

        touchStartX = null;
      },
      { passive: true },
    );

    // Respect reduced-motion changes made while the page is open.
    reduced.addEventListener?.('change', (event) => {
      if (event.matches) {
        stopAutoplay();
        clearTimeout(transitionTimer);
        clearTimeout(copyTimer);
        heroImage.classList.remove('is-changing', 'hero-image-enter');
        copy?.classList.remove('slide-out', 'hero-copy-enter');
        busy = false;
      } else {
        restartAutoplay();
      }
    });

    showSlide(0, false);
    restartAutoplay();
  }

  // Gallery filters
  $$('[data-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      $$('[data-filter]').forEach((item) => {
        item.classList.toggle('active', item === button);
      });

      $$('[data-category]').forEach((item) => {
        item.hidden =
          button.dataset.filter !== 'all' &&
          item.dataset.category !== button.dataset.filter;
      });
    });
  });

  // Accessible lightbox
  const lightbox = $('.lightbox');

  if (lightbox) {
    const lightboxImage = $('img', lightbox);
    const closeButton = $('button', lightbox);
    let previousFocus = null;

    $$('[data-full-image]').forEach((button) => {
      button.addEventListener('click', () => {
        const image = $('img', button);
        if (!image || !lightboxImage) return;

        previousFocus = button;
        lightboxImage.src = button.dataset.fullImage || image.src;
        lightboxImage.alt = image.alt;

        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
        closeButton?.focus();
      });
    });

    function closeLightbox() {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      previousFocus?.focus();
    }

    closeButton?.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && lightbox.classList.contains('open')) {
        closeLightbox();
      }
    });
  }
})();
