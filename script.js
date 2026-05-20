/* =========================================================
   THE THATCH EXPERT — Scripts
   ========================================================= */
(function () {
  'use strict';

  /* ---- Mobile nav ---- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');

  function closeNav() {
    nav.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });
  }

  /* ---- Header scroll state ---- */
  var header = document.getElementById('header');
  function onScroll() {
    if (window.scrollY > 30) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Scroll reveal ---- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---- Animated counters ---- */
  var counters = document.querySelectorAll('.stat__num');
  function runCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var dur = 1600;
    var start = null;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(tick);
  }
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          co.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { co.observe(el); });
  } else {
    counters.forEach(function (el) {
      el.textContent = el.getAttribute('data-count') + (el.getAttribute('data-suffix') || '');
    });
  }

  /* ---- Active nav link on scroll ---- */
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav__link');
  function setActive() {
    var pos = window.scrollY + 140;
    var current = '';
    sections.forEach(function (sec) {
      if (pos >= sec.offsetTop) current = sec.id;
    });
    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', setActive, { passive: true });
  setActive();

  /* ---- Footer year ---- */
  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---- Contact form (Netlify AJAX) ---- */
  var form = document.getElementById('enquiryForm');
  var status = document.getElementById('formStatus');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var data = new URLSearchParams(new FormData(form)).toString();
      status.textContent = 'Sending your enquiry...';
      status.className = 'form__status';
      if (btn) { btn.disabled = true; }

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: data
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Network');
          form.reset();
          status.textContent = 'Thank you! Frank will be in touch shortly. For an instant response, WhatsApp us on 073 732 2227.';
          status.className = 'form__status ok';
        })
        .catch(function () {
          status.innerHTML = 'Something went wrong. Please WhatsApp Frank directly on ' +
            '<a href="https://wa.me/27737322227" target="_blank" rel="noopener" style="color:#1da851;font-weight:700;">073 732 2227</a>.';
          status.className = 'form__status err';
        })
        .finally(function () {
          if (btn) { btn.disabled = false; }
        });
    });
  }

  /* ---- Subtle hero parallax (desktop only) ---- */
  var hero = document.querySelector('.hero');
  if (hero && window.matchMedia('(min-width:861px)').matches &&
      !window.matchMedia('(prefers-reduced-motion:reduce)').matches) {
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      if (y < window.innerHeight) {
        hero.style.backgroundPositionY = (y * 0.25) + 'px';
      }
    }, { passive: true });
  }
})();
