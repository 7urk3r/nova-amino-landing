// Progressive enhancement entry
document.addEventListener('DOMContentLoaded', () => {
  // Suppress mouse/touch focus ring for nav controls (keep keyboard focus)
  const suppress = (e) => {
    const el = e.target.closest('.ev-menu__button, .nav-pill__link, .ev-menu__item, .link-plain, .btn')
    if (el) e.preventDefault()
  }
  document.addEventListener('mousedown', suppress, { capture:true })
  document.addEventListener('touchstart', suppress, { capture:true, passive:true })

  // Vanilla dropdown menu behavior
  function setupMenu(menuRoot){
    if(!menuRoot) return
    const button = menuRoot.querySelector('button.nav-pill, button.nav-link')
    const panel = menuRoot.querySelector('.nav-dropdown')
    const items = Array.from(menuRoot.querySelectorAll('.nav-item'))
    if(!button || !panel) return

    let closeTimer = null
    const clearCloseTimer = () => { if (closeTimer) { clearTimeout(closeTimer); closeTimer = null } }

    const open = () => {
      menuRoot.classList.add('is-open')
      button.setAttribute('aria-expanded','true')
    }
    const close = () => {
      menuRoot.classList.remove('is-open')
      button.setAttribute('aria-expanded','false')
    }

    // Hover intent: open on hover, close on leave
    menuRoot.addEventListener('mouseenter', () => { clearCloseTimer(); open() })
    menuRoot.addEventListener('mouseleave', () => { clearCloseTimer(); closeTimer = setTimeout(close, 160) })
    if (panel) {
      panel.addEventListener('mouseenter', () => { clearCloseTimer(); open() })
      panel.addEventListener('mouseleave', () => { clearCloseTimer(); closeTimer = setTimeout(close, 160) })
    }

    // Click toggle
    button.addEventListener('click', (e)=>{
      e.preventDefault()
      const isOpen = menuRoot.classList.contains('is-open')
      isOpen ? close() : open()
    })

    // Keyboard navigation
    button.addEventListener('keydown', (e)=>{
      if(e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' '){
        e.preventDefault(); open(); items[0]?.focus()
      }
      if(e.key === 'Escape'){ close(); button.focus() }
    })
    panel.addEventListener('keydown', (e)=>{
      const idx = items.indexOf(document.activeElement)
      if(e.key === 'ArrowDown'){ e.preventDefault(); (items[idx+1]||items[0])?.focus() }
      if(e.key === 'ArrowUp'){ e.preventDefault(); (items[idx-1]||items[items.length-1])?.focus() }
      if(e.key === 'Home'){ e.preventDefault(); items[0]?.focus() }
      if(e.key === 'End'){ e.preventDefault(); items[items.length-1]?.focus() }
      if(e.key === 'Escape'){ e.preventDefault(); close(); button.focus() }
    })

    // Click outside to close
    document.addEventListener('click', (e)=>{
      if(!menuRoot.contains(e.target)) close()
    })
  }

  // Initialize all menus in header
  document.querySelectorAll('.nav-menu').forEach(setupMenu)

  // Create sticky navbar behavior
  const header = document.querySelector('header.site-header')
  const navContainer = document.querySelector('.site-nav')
  let stickyNav = null
  
  function handleSticky() {
    if (!header || !navContainer) return
    
    const headerRect = header.getBoundingClientRect()
    
    if (headerRect.bottom <= 0) {
      // Header has scrolled out of view, show sticky nav
      if (!stickyNav) {
        stickyNav = document.createElement('div')
        stickyNav.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; z-index: 3000; display: flex; justify-content: center; padding-block: var(--space-4);'
        // Ensure original menus are closed to avoid duplicate visible panels
        document.querySelectorAll('.nav-menu').forEach(m => {
          m.classList.remove('is-open');
          const b = m.querySelector('.nav-pill[aria-expanded]'); if (b) b.setAttribute('aria-expanded','false')
        })
        // Clone the entire nav content
        stickyNav.innerHTML = navContainer.innerHTML
        document.body.appendChild(stickyNav)
        // Re-bind menu behavior for all cloned menus
        stickyNav.querySelectorAll('.nav-menu').forEach(setupMenu)
        document.documentElement.classList.add('has-sticky-nav')
      }
    } else {
      // Header is visible, remove sticky nav
      if (stickyNav) {
        stickyNav.remove()
        stickyNav = null
        document.documentElement.classList.remove('has-sticky-nav')
      }
    }
  }
  
  // Wait for React to render, then start sticky behavior
  setTimeout(() => {
    handleSticky()
    window.addEventListener('scroll', handleSticky, { passive: true })
    window.addEventListener('resize', handleSticky)
  }, 500)
  
  // Remove layout auto-alignment to keep hero vial stable across edits
  // (previous logic adjusted positions based on header elements and could
  // push the image off-canvas after small changes). Intentionally no-op now.
});
