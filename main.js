document.addEventListener('DOMContentLoaded', function () {
  initScrollReveal();
  initContactWidget();
  initBtnHelp();
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
  var dismissButtons = widget.querySelectorAll('[data-contact-dismiss]');
  var restore = document.querySelector('[data-contact-restore]');
  var restoreBtn = document.querySelector('[data-contact-restore-btn]');
  var storageKey = 'biz-contact-widget-dismissed';

  function setOpen(isOpen) {
    widget.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    panel.hidden = !isOpen;
    panel.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
  }

  function setDismissed(isDismissed) {
    widget.classList.toggle('is-dismissed', isDismissed);
    if (isDismissed) {
      localStorage.setItem(storageKey, '1');
      setOpen(false);
    } else {
      localStorage.removeItem(storageKey);
    }
    if (restore) {
      restore.hidden = !isDismissed;
    }
  }

  setDismissed(localStorage.getItem(storageKey) === '1');

  toggle.addEventListener('click', function () {
    setOpen(!widget.classList.contains('is-open'));
  });

  panelClose.addEventListener('click', function () {
    setOpen(false);
  });

  dismissButtons.forEach(function (dismiss) {
    dismiss.addEventListener('click', function (e) {
      e.stopPropagation();
      setDismissed(true);
      var widgetHelp = widget.querySelector('.btn-help--widget');
      if (widgetHelp) {
        widgetHelp.classList.remove('is-open');
        var trigger = widgetHelp.querySelector('.btn-help__trigger');
        if (trigger) {
          trigger.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  if (restoreBtn) {
    restoreBtn.addEventListener('click', function () {
      setDismissed(false);
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && widget.classList.contains('is-open')) {
      setOpen(false);
    }
  });
}

function initBtnHelp() {
  var helpWidgets = document.querySelectorAll('.btn-help');
  if (!helpWidgets.length) {
    return;
  }

  function setOpen(help, isOpen) {
    help.classList.toggle('is-open', isOpen);
    var trigger = help.querySelector('.btn-help__trigger');
    if (trigger) {
      trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }
    var tip = help.querySelector('.btn-help__tip');
    if (tip) {
      tip.hidden = !isOpen;
    }
  }

  function closeAll(except) {
    helpWidgets.forEach(function (help) {
      if (help !== except) {
        setOpen(help, false);
      }
    });
  }

  helpWidgets.forEach(function (help) {
    var trigger = help.querySelector('.btn-help__trigger');
    var closeBtn = help.querySelector('.btn-help__close');
    var tip = help.querySelector('.btn-help__tip');

    if (trigger) {
      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = help.classList.contains('is-open');
        closeAll(help);
        setOpen(help, !isOpen);
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        setOpen(help, false);
      });
    }

    if (tip) {
      tip.addEventListener('click', function (e) {
        e.stopPropagation();
      });
    }
  });

  document.addEventListener('click', function () {
    closeAll();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeAll();
    }
  });
}
