// Language toggle behavior
(function () {
  const options = Array.from(document.querySelectorAll('.lang-option'));
  if (!options.length) return;

  function setActive(target) {
    options.forEach(o => {
      const active = o === target;
      o.classList.toggle('active', active);
      o.setAttribute('aria-selected', String(active));
      o.tabIndex = active ? 0 : -1;
    });
    const lang = target.getAttribute('data-lang') || 'en';
    try { document.documentElement.setAttribute('lang', lang); } catch {}
  }

  options.forEach(o => {
    o.addEventListener('click', () => setActive(o));
    o.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActive(o); }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        const idx = options.indexOf(o);
        const next = e.key === 'ArrowRight' ? (idx + 1) % options.length : (idx - 1 + options.length) % options.length;
        setActive(options[next]);
        options[next].focus();
      }
    });
  });
})();

// Vertically align the language switch with the logo and mirror left padding on the right
(function () {
  const content = document.querySelector('.age-gate-content');
  const measure = document.querySelector('.logo-measure');
  const header = document.querySelector('.age-gate-header');
  const switchEl = document.querySelector('.lang-switch');
  if (!content || !measure || !header || !switchEl) return;

  function align() {
    const c = content.getBoundingClientRect();
    const m = measure.getBoundingClientRect();
    const swH = switchEl.offsetHeight || parseFloat(getComputedStyle(switchEl).height) || 48;
    const top = (m.top - c.top) + (m.height - swH) / 2;
    const verticalNudge = -5; // move up 5px
    header.style.top = Math.max(0, Math.round(top) + verticalNudge) + 'px';
    const rightPad = Math.round(m.left - c.left); // mirror logo's left gap
    const bleedComp = 10; // compensate for switch drop shadow visual bleed
    const userNudge = 70; // final nudge
    header.style.right = Math.max(0, rightPad + bleedComp + userNudge) + 'px';
  }

  const ro = new ResizeObserver(() => align());
  try { ro.observe(content); ro.observe(measure); } catch {}
  window.addEventListener('resize', align);
  window.addEventListener('orientationchange', align);
  if (document.readyState === 'complete') {
    requestAnimationFrame(align);
  } else {
    window.addEventListener('load', () => requestAnimationFrame(align), { once: true });
  }
})();

// Make the scroll box width match the white card exactly
(function () {
  const main = document.querySelector('.age-gate-main');
  const cardRectEl = document.querySelector('.card-background');
  const scrollBox = document.querySelector('.age-gate-text');
  if (!main || !cardRectEl || !scrollBox) return;

  function applyMatch() {
    const c = main.getBoundingClientRect();
    const r = cardRectEl.getBoundingClientRect();
    const leftOffset = Math.round(r.left - c.left);
    const rightOffset = Math.round(c.right - r.right);
    scrollBox.style.marginLeft = leftOffset + 'px';
    scrollBox.style.marginRight = rightOffset + 'px';
    scrollBox.style.width = 'auto';
  }

  const ro = new ResizeObserver(() => applyMatch());
  try { ro.observe(main); } catch {}
  window.addEventListener('resize', applyMatch);
  window.addEventListener('orientationchange', applyMatch);
  if (document.readyState === 'complete') {
    requestAnimationFrame(applyMatch);
  } else {
    window.addEventListener('load', () => requestAnimationFrame(applyMatch), { once: true });
  }
})();

// Buttons
function acceptTerms(){
  localStorage.setItem('novaAminoAgeVerified','true');
  localStorage.setItem('novaAminoAgeVerifiedDate', new Date().toISOString());
  alert('Thank you. You will now be redirected to the main site.');
}
function exitSite(){ if (window.history.length>1){ window.history.back(); } else { window.location.href='https://www.google.com'; } }

