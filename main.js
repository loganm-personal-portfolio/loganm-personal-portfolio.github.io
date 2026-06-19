document.addEventListener('DOMContentLoaded', function () {
  initScrollReveal();
  initContactWidget();
});

function initScrollReveal() {
  var revealNodes = document.querySelectorAll('[data-scroll-reveal], [data-scroll-reveal-scope]');
  if (!revealNodes.length) {
    return;
  }

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    revealNodes.forEach(function (el) {
      el.classList.add('is-revealed');
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) {
          return;
        }
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      });
    },
    { root: null, rootMargin: '0px 0px -6% 0px', threshold: 0.06 }
  );

  revealNodes.forEach(function (el) {
    observer.observe(el);
  });
}

function initContactWidget() {
  var widget = document.querySelector('[data-contact-widget]');
  if (!widget) {
    return;
  }

  var panel = document.getElementById('contact-widget-panel');
  var toggle = widget.querySelector('[data-contact-toggle]');
  var panelClose = widget.querySelector('[data-contact-panel-close]');
  var dismiss = widget.querySelector('[data-contact-dismiss]');
  var storageKey = 'biz-contact-widget-dismissed';

  if (localStorage.getItem(storageKey) === '1') {
    widget.classList.add('is-dismissed');
    return;
  }

  function setOpen(isOpen) {
    widget.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    panel.hidden = !isOpen;
    panel.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
  }

  toggle.addEventListener('click', function () {
    setOpen(!widget.classList.contains('is-open'));
  });

  panelClose.addEventListener('click', function () {
    setOpen(false);
  });

  dismiss.addEventListener('click', function () {
    setOpen(false);
    widget.classList.add('is-dismissed');
    localStorage.setItem(storageKey, '1');
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && widget.classList.contains('is-open')) {
      setOpen(false);
    }
  });
}
