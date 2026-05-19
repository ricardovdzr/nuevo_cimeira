/* shared.js — CIMEIRA v3 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    /* ── Sticky header shadow ── */
    var header = document.querySelector('.site-header');
    if (header) {
      window.addEventListener('scroll', function () {
        header.classList.toggle('scrolled', window.scrollY > 20);
      }, { passive: true });
    }

    /* ── Hamburger ── */
    var ham = document.getElementById('hamburger');
    var mobileNav = document.getElementById('mobile-nav');
    if (ham && mobileNav) {
      ham.addEventListener('click', function () {
        var isOpen = ham.getAttribute('aria-expanded') === 'true';
        ham.setAttribute('aria-expanded', String(!isOpen));
        mobileNav.classList.toggle('open', !isOpen);
        document.body.style.overflow = isOpen ? '' : 'hidden';
      });
    }

    /* ── Desktop dropdown ── */
    var dds = document.querySelectorAll('.nav-dd');
    dds.forEach(function (dd) {
      var btn = dd.querySelector('button');
      if (!btn) return;
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var wasOpen = dd.classList.contains('open');
        dds.forEach(function (d) {
          d.classList.remove('open');
          var b = d.querySelector('button');
          if (b) b.setAttribute('aria-expanded', 'false');
        });
        if (!wasOpen) {
          dd.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
    document.addEventListener('click', function () {
      dds.forEach(function (d) {
        d.classList.remove('open');
        var b = d.querySelector('button');
        if (b) b.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        dds.forEach(function (d) {
          d.classList.remove('open');
          var b = d.querySelector('button');
          if (b) b.setAttribute('aria-expanded', 'false');
        });
        if (mobileNav && mobileNav.classList.contains('open')) {
          mobileNav.classList.remove('open');
          if (ham) ham.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      }
    });

    /* ── FAQ accordion ── */
    document.querySelectorAll('.faq-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.faq-item');
        var wasOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(function (i) {
          i.classList.remove('open');
          i.querySelector('.faq-btn').setAttribute('aria-expanded', 'false');
        });
        if (!wasOpen) {
          item.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });

    /* ── Scroll reveal ── */
    if ('IntersectionObserver' in window) {
      var revObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
      document.querySelectorAll('.reveal, .reveal-l, .reveal-r').forEach(function (el) {
        revObs.observe(el);
      });
    } else {
      document.querySelectorAll('.reveal, .reveal-l, .reveal-r').forEach(function (el) {
        el.classList.add('visible');
      });
    }

    /* ── Animated counters ── */
    if ('IntersectionObserver' in window) {
      var cntObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            cntObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      document.querySelectorAll('.counter').forEach(function (el) {
        cntObs.observe(el);
      });
    } else {
      document.querySelectorAll('.counter').forEach(function (el) {
        var t = parseInt(el.dataset.target, 10);
        el.textContent = (el.dataset.prefix || '') + t.toLocaleString('es-MX') + (el.dataset.suffix || '');
      });
    }

    function animateCounter(el) {
      var target = parseInt(el.dataset.target, 10);
      var prefix = el.dataset.prefix || '';
      var suffix = el.dataset.suffix || '';
      var duration = 1800;
      var step = 16;
      var steps = Math.ceil(duration / step);
      var current = 0;
      var inc = target / steps;
      var timer = setInterval(function () {
        current += inc;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = prefix + Math.floor(current).toLocaleString('es-MX') + suffix;
      }, step);
    }

    /* ── Active nav link ── */
    var page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('a[href]').forEach(function (a) {
      if (a.getAttribute('href') === page) {
        a.setAttribute('aria-current', 'page');
      }
    });

  });
}());
