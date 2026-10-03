/* =============================================
   SITEFLOW — script.js
   All interactivity, animations, language toggle
   ============================================= */

(function () {
  'use strict';

  /* ─── STATE ─── */
  let lang = 'en';

  /* ════════════════════════════════════════════
     LOADING SCREEN
  ═══════════════════════════════════════════ */
  const loader = document.getElementById('loader');
  const loaderTagline = document.getElementById('loader-tagline');

  const taglines = {
    en: ['Loading experience...', 'Crafting your view...', 'Almost ready...'],
    ka: ['იტვირთება...', 'ვამზადებთ...', 'თითქმის მზადაა...'],
  };

  let tlIdx = 0;
  const tl = setInterval(function () {
    tlIdx++;
    if (loaderTagline && tlIdx < taglines.en.length) {
      loaderTagline.textContent = taglines.en[tlIdx];
    }
  }, 600);

  var loadStartTime = Date.now();
  var MIN_LOADER_MS = 2400;

  function hideLoader() {
    clearInterval(tl);
    var elapsed = Date.now() - loadStartTime;
    var remaining = Math.max(0, MIN_LOADER_MS - elapsed);
    setTimeout(function () {
      if (loader) {
        loader.classList.add('loader--hidden');
        document.body.classList.remove('loading');
        setTimeout(function () {
          loader.style.display = 'none';
          initReveal();
        }, 800);
      }
    }, remaining);
  }

  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader);
  }

  document.body.classList.add('loading');

  /* ════════════════════════════════════════════
     CUSTOM CURSOR
  ═══════════════════════════════════════════ */
  var cursor = document.getElementById('cursor');
  var follower = document.getElementById('cursor-follower');
  var mx = 0, my = 0;
  var fx = 0, fy = 0;

  document.addEventListener('mousemove', function (e) {
    mx = e.clientX;
    my = e.clientY;
    if (cursor) {
      cursor.style.left = mx + 'px';
      cursor.style.top = my + 'px';
    }
  });

  function animateCursor() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    if (follower) {
      follower.style.left = fx + 'px';
      follower.style.top = fy + 'px';
    }
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Scale cursor on hover
  var interactables = document.querySelectorAll('a, button, .service-card, .portfolio__item, .contact__phone');
  interactables.forEach(function (el) {
    el.addEventListener('mouseenter', function () {
      if (cursor) cursor.style.transform = 'translate(-50%, -50%) scale(2.5)';
      if (follower) {
        follower.style.width = '56px';
        follower.style.height = '56px';
        follower.style.borderColor = 'rgba(255,255,255,0.7)';
      }
    });
    el.addEventListener('mouseleave', function () {
      if (cursor) cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      if (follower) {
        follower.style.width = '36px';
        follower.style.height = '36px';
        follower.style.borderColor = 'rgba(255,255,255,0.5)';
      }
    });
  });

  /* ════════════════════════════════════════════
     NAVBAR SCROLL EFFECT
  ═══════════════════════════════════════════ */
  var navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function () {
    if (!navbar) return;
    if (window.scrollY > 60) {
      navbar.classList.add('nav--scrolled');
    } else {
      navbar.classList.remove('nav--scrolled');
    }
  }, { passive: true });

  /* ════════════════════════════════════════════
     HAMBURGER / MOBILE MENU
  ═══════════════════════════════════════════ */
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');
  var mobileLinks = document.querySelectorAll('.mobile-menu__link');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ════════════════════════════════════════════
     LANGUAGE TOGGLE
  ═══════════════════════════════════════════ */
  var langToggle = document.getElementById('langToggle');
  var langEn = document.getElementById('langEn');
  var langKa = document.getElementById('langKa');

  function applyLanguage(newLang) {
    lang = newLang;
    var attr = 'data-' + lang;

    // Update all translatable elements
    document.querySelectorAll('[data-en][data-ka]').forEach(function (el) {
      var val = el.getAttribute(attr);
      if (val !== null) {
        el.textContent = val;
      }
    });

    // Toggle active indicator on button
    if (lang === 'ka') {
      document.body.classList.add('lang-ka');
      if (langEn) langEn.style.color = 'var(--mid)';
      if (langKa) langKa.style.color = 'var(--white)';
      document.documentElement.lang = 'ka';
    } else {
      document.body.classList.remove('lang-ka');
      if (langEn) langEn.style.color = 'var(--white)';
      if (langKa) langKa.style.color = 'var(--mid)';
      document.documentElement.lang = 'en';
    }

    // Update loader tagline language
    if (loaderTagline) {
      loaderTagline.textContent = taglines[lang][0];
    }

    // Update page title and meta description
    if (lang === 'ka') {
      document.title = 'SiteFlow – პროფესიონალური ვებსაიტების შექმნა';
      var metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', 'SiteFlow – პროფესიონალური ვებსაიტების შექმნა 500 ₾-დან. ვქმნით სუფთა, თანამედროვე ვებსაიტებს ქართული ბიზნესებისთვის.');
    } else {
      document.title = 'SiteFlow – Professional Website Creation';
      var metaDesc2 = document.querySelector('meta[name="description"]');
      if (metaDesc2) metaDesc2.setAttribute('content', 'SiteFlow – Professional website creation starting at 500 GEL. We craft clean, modern websites for your business.');
    }

    // Save preference
    try { localStorage.setItem('siteflow_lang', lang); } catch (e) {}

    // Re-apply animations on language change
    animateLangSwitch();
  }

  function animateLangSwitch() {
    // Quick fade on all translatable text elements
    var els = document.querySelectorAll('[data-en][data-ka]');
    els.forEach(function (el) {
      el.style.transition = 'opacity 0.15s ease';
      el.style.opacity = '0';
      setTimeout(function () {
        el.style.opacity = '1';
      }, 150);
    });
  }

  if (langToggle) {
    langToggle.addEventListener('click', function () {
      applyLanguage(lang === 'en' ? 'ka' : 'en');
    });
  }

  // Restore saved lang
  try {
    var savedLang = localStorage.getItem('siteflow_lang');
    if (savedLang && (savedLang === 'en' || savedLang === 'ka')) {
      // Defer to after DOM is ready
      setTimeout(function () { applyLanguage(savedLang); }, 100);
    }
  } catch (e) {}

  /* ════════════════════════════════════════════
     INTERSECTION OBSERVER — REVEAL ANIMATIONS
  ═══════════════════════════════════════════ */
  function initReveal() {
    var revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Use CSS custom property delay if set
          var delay = getComputedStyle(entry.target).getPropertyValue('--delay') || '0s';
          entry.target.style.transitionDelay = delay;
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { observer.observe(el); });
  }

  // Start reveal immediately if loader already done (e.g. cached page)
  if (loader && loader.style.display === 'none') {
    initReveal();
  }

  /* ════════════════════════════════════════════
     STATS COUNTER ANIMATION
  ═══════════════════════════════════════════ */
  var statNums = document.querySelectorAll('.stat__num[data-target]');

  function animateCounter(el, target, duration) {
    var start = 0;
    var startTime = null;
    target = parseInt(target, 10);

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out quad
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(eased * target);
      el.textContent = current;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }
    requestAnimationFrame(step);
  }

  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var target = entry.target.getAttribute('data-target');
        animateCounter(entry.target, target, 1800);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(function (el) { counterObserver.observe(el); });

  /* ════════════════════════════════════════════
     SMOOTH SCROLL FOR NAV LINKS
  ═══════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      var navHeight = navbar ? navbar.offsetHeight : 80;
      var top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ════════════════════════════════════════════
     CONTACT FORM — powered by Web3Forms
     Submissions are emailed to siteflow365@gmail.com
  ═══════════════════════════════════════════ */
  var WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
  var WEB3FORMS_ACCESS_KEY = '8f9b532c-4ee7-4a70-a923-89c0e6659d10';

  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var btn = contactForm.querySelector('button[type="submit"]');
      var spinnerHTML = '<svg style="animation:spin 0.8s linear infinite;width:18px;height:18px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>';

      // Add spin keyframe once
      if (!document.getElementById('spinStyle')) {
        var st = document.createElement('style');
        st.id = 'spinStyle';
        st.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
        document.head.appendChild(st);
      }

      btn.disabled = true;
      btn.innerHTML = spinnerHTML;

      // Collect form data
      var formData = {
        access_key: WEB3FORMS_ACCESS_KEY,
        name:    contactForm.querySelector('#name').value.trim(),
        email:   contactForm.querySelector('#email').value.trim(),
        phone:   contactForm.querySelector('#phone').value.trim(),
        message: contactForm.querySelector('#message').value.trim(),
        subject: "New SiteFlow Inquiry from " + contactForm.querySelector('#name').value.trim()
      };

      // Submit to Web3Forms via fetch
      fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      .then(function (response) {
        if (response.ok) {
          // ✅ Success
          var successMsg = lang === 'ka'
            ? '<div class="form-success"><div class="form-success__icon">&#10003;</div><h3>გამოგზავნილია!</h3><p>24 საათის განმავლობაში დაგიკავშირდებით.</p></div>'
            : '<div class="form-success"><div class="form-success__icon">&#10003;</div><h3>Message Sent!</h3><p>We\'ll get back to you within 24 hours.</p></div>';
          contactForm.innerHTML = successMsg;
        } else {
          // Server returned an error
          return response.json().then(function (data) { throw data; });
        }
      })
      .catch(function (err) {
        // ❌ Error — re-enable the button and show message
        btn.disabled = false;
        btn.innerHTML = lang === 'ka'
          ? '<span>შეტყობინების გაგზავნა</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>'
          : '<span>Send Message</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';

        var errMsg = lang === 'ka'
          ? 'შეცდომა მოხდა. სცადეთ ხელახლა ან დაგვირეკეთ.'
          : 'Something went wrong. Please try again or call us directly.';

        var existing = contactForm.querySelector('.form-error');
        if (!existing) {
          var errEl = document.createElement('p');
          errEl.className = 'form-error';
          errEl.style.cssText = 'color:#ff6b6b;font-size:0.8rem;text-align:center;margin-top:-0.5rem;';
          errEl.textContent = errMsg;
          contactForm.appendChild(errEl);
        }
        console.error('Formspree error:', err);
      });
    });
  }

  /* ════════════════════════════════════════════
     PARALLAX — subtle hero grid lines
  ═══════════════════════════════════════════ */
  var gridLines = document.querySelector('.hero__grid-lines');
  window.addEventListener('scroll', function () {
    if (!gridLines) return;
    var scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      gridLines.style.transform = 'translateY(' + scrollY * 0.15 + 'px)';
    }
  }, { passive: true });

  /* ════════════════════════════════════════════
     HERO TILT ON MOUSE MOVE
  ═══════════════════════════════════════════ */
  var heroSection = document.querySelector('.hero');
  var heroContent = document.querySelector('.hero__content');
  if (heroSection && heroContent) {
    heroSection.addEventListener('mousemove', function (e) {
      var rect = heroSection.getBoundingClientRect();
      var cx = rect.width / 2;
      var cy = rect.height / 2;
      var dx = (e.clientX - rect.left - cx) / cx;
      var dy = (e.clientY - rect.top - cy) / cy;
      heroContent.style.transform = 'translate(' + dx * 6 + 'px, ' + dy * 4 + 'px)';
    });
    heroSection.addEventListener('mouseleave', function () {
      heroContent.style.transform = 'translate(0, 0)';
    });
  }

  /* ════════════════════════════════════════════
     SERVICE CARDS — magnetic hover effect
  ═══════════════════════════════════════════ */
  document.querySelectorAll('.service-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left - rect.width / 2;
      var y = e.clientY - rect.top - rect.height / 2;
      card.style.transform = 'translate(' + x * 0.03 + 'px, ' + y * 0.03 + 'px)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform = 'translate(0,0)';
    });
  });

  /* ════════════════════════════════════════════
     FLOAT CARDS — parallax on scroll
  ═══════════════════════════════════════════ */
  var float1 = document.querySelector('.hero__float--1');
  var float2 = document.querySelector('.hero__float--2');
  window.addEventListener('scroll', function () {
    var s = window.scrollY;
    if (float1) float1.style.transform = 'translateY(' + s * -0.08 + 'px)';
    if (float2) float2.style.transform = 'translateY(' + s * -0.12 + 'px)';
  }, { passive: true });

})();
