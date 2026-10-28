// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Theme toggle. The saved or system theme is already applied by the small script in the <head>.
(function () {
  var root = document.documentElement;
  var button = document.querySelector('.theme-toggle');
  var meta = document.querySelector('meta[name="theme-color"]');
  var barColor = { light: '#ECEFE6', dark: '#0A1C14' };

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    if (button) button.setAttribute('aria-pressed', String(theme === 'dark'));
    if (meta) meta.setAttribute('content', barColor[theme]);
  }

  apply(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');

  if (button) {
    button.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      apply(next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }
})();

// Project previews open a native <dialog>. Escape closes it, and focus returns to the preview.
(function () {
  var openers = document.querySelectorAll('[data-open]');
  var dialogs = document.querySelectorAll('dialog');

  openers.forEach(function (opener) {
    opener.addEventListener('click', function () {
      var dialog = document.getElementById(opener.getAttribute('data-open'));
      if (dialog && typeof dialog.showModal === 'function') dialog.showModal();
    });
  });

  dialogs.forEach(function (dialog) {
    // A click on the dimmed area outside the panel lands on the dialog element itself.
    dialog.addEventListener('click', function (event) {
      if (event.target === dialog) dialog.close();
    });
    dialog.querySelectorAll('[data-close]').forEach(function (close) {
      close.addEventListener('click', function () { dialog.close(); });
    });
  });
})();

// Tool icon strip. Each row is copied once so it can loop without a gap.
// With reduced motion on, or without JavaScript, the icons stay as a still wrapped grid.
(function () {
  var wall = document.querySelector('.marquee-wall');
  if (!wall) return;

  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (still) return;

  wall.querySelectorAll('.marquee').forEach(function (row) {
    var track = row.querySelector('.marquee-track');
    var copy = track.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    copy.removeAttribute('aria-label');
    row.appendChild(copy);
    row.classList.add('is-ready');
  });

  // WCAG asks for a way to stop moving content, so there is a button as well as pause-on-hover.
  var button = document.querySelector('[data-marquee-pause]');
  if (!button) return;
  button.hidden = false;
  button.addEventListener('click', function () {
    var paused = wall.classList.toggle('is-paused');
    button.textContent = paused ? 'Play' : 'Pause';
    button.setAttribute('aria-label', paused ? 'Play the tool icons animation' : 'Pause the tool icons animation');
  });
})();

// Mobile menu. Without JavaScript the links simply stay visible in the top bar.
(function () {
  var button = document.querySelector('.menu-toggle');
  var nav = document.getElementById('site-nav');
  if (!button || !nav) return;
  button.hidden = false;
  var narrow = window.matchMedia('(max-width: 639px)');

  function setOpen(open) {
    nav.classList.toggle('is-open', open);
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Close menu' : 'Menu');
  }

  button.addEventListener('click', function () { setOpen(button.getAttribute('aria-expanded') !== 'true'); });
  nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setOpen(false); }); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { setOpen(false); button.focus(); }
  });
  document.addEventListener('click', function (e) {
    if (nav.classList.contains('is-open') && !nav.contains(e.target) && !button.contains(e.target)) setOpen(false);
  });
  (narrow.addEventListener ? narrow.addEventListener.bind(narrow, 'change') : narrow.addListener.bind(narrow))(function () { setOpen(false); });
})();
