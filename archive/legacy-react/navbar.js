// Vanilla JS implementation matching Headless UI Menu behavior
class VanillaNavbar {
  constructor() {
    this.openMenus = new Set()
    this.init()
  }

  init() {
    const navCenter = document.getElementById('nav-center-mount')
    if (!navCenter) return

    // Create the navbar HTML exactly like the React version
    navCenter.innerHTML = this.getNavHTML()
    
    // Initialize dropdown functionality
    this.initDropdowns()
  }

  getNavHTML() {
    return `
      <div class="nav-pill nav-pill--sticky">
        <a href="/" class="nav-pill__link">Home</a>
        ${this.createDropdown('Catalog', [
          {label: 'All Products', href: '/products'},
          {label: 'New', href: '/products#new'},
          {label: 'Popular', href: '/products#popular'}
        ])}
        <a href="/faq" class="nav-pill__link">FAQ</a>
        ${this.createDropdown('Announcements', [
          {label: 'Changelog', href: '/announcements#changelog'},
          {label: 'Blog', href: '/announcements#blog'},
          {label: 'Press', href: '/announcements#press'}
        ])}
      </div>
    `
  }

  createDropdown(label, items) {
    const itemsHTML = items.map(item => 
      `<a href="${item.href}" class="ev-menu__item">${item.label}</a>`
    ).join('')

    return `
      <div class="ev-menu" data-headlessui-state="">
        <div>
          <button class="nav-pill__link ev-menu__button" type="button" aria-expanded="false" data-headlessui-state="" aria-label="${label} menu">
            ${label}
          </button>
          <div class="ev-menu__items ev-transition-enter-from" style="margin-top: 12px;" data-headlessui-state="">
            <div class="ev-menu__section">
              ${itemsHTML}
            </div>
          </div>
        </div>
      </div>
    `
  }

  initDropdowns() {
    const dropdowns = document.querySelectorAll('.ev-menu')
    
    dropdowns.forEach((dropdown, index) => {
      const button = dropdown.querySelector('.ev-menu__button')
      const menu = dropdown.querySelector('.ev-menu__items')
      const wrapper = dropdown.querySelector('div')
      
      if (!button || !menu || !wrapper) return

      const menuId = `menu-${index}`
      
      // Initially hidden
      menu.style.display = 'none'
      
      // Mouse events on the wrapper div (like React version)
      wrapper.addEventListener('mouseenter', () => {
        this.openMenu(dropdown, button, menu, menuId)
      })
      
      wrapper.addEventListener('mouseleave', () => {
        this.closeMenu(dropdown, button, menu, menuId)
      })

      // Handle menu item hover states
      const menuItems = menu.querySelectorAll('.ev-menu__item')
      menuItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
          menuItems.forEach(i => i.classList.remove('is-active'))
          item.classList.add('is-active')
        })
        
        item.addEventListener('mouseleave', () => {
          item.classList.remove('is-active')
        })
      })
    })
  }

  openMenu(dropdown, button, menu, menuId) {
    if (this.openMenus.has(menuId)) return
    
    this.openMenus.add(menuId)
    
    // Update states like Headless UI
    button.setAttribute('aria-expanded', 'true')
    button.setAttribute('data-headlessui-state', 'open')
    dropdown.setAttribute('data-headlessui-state', 'open')
    menu.setAttribute('data-headlessui-state', 'open')
    
    // Show and animate
    menu.style.display = 'block'
    menu.classList.remove('ev-transition-leave', 'ev-transition-leave-from', 'ev-transition-leave-to')
    menu.classList.add('ev-transition-enter', 'ev-transition-enter-from')
    
    requestAnimationFrame(() => {
      menu.classList.remove('ev-transition-enter-from')
      menu.classList.add('ev-transition-enter-to')
    })
  }

  closeMenu(dropdown, button, menu, menuId) {
    if (!this.openMenus.has(menuId)) return
    
    this.openMenus.delete(menuId)
    
    // Update states
    button.setAttribute('aria-expanded', 'false')
    button.setAttribute('data-headlessui-state', '')
    dropdown.setAttribute('data-headlessui-state', '')
    menu.setAttribute('data-headlessui-state', '')
    
    // Hide with animation
    menu.classList.remove('ev-transition-enter', 'ev-transition-enter-from', 'ev-transition-enter-to')
    menu.classList.add('ev-transition-leave', 'ev-transition-leave-from')
    
    requestAnimationFrame(() => {
      menu.classList.remove('ev-transition-leave-from')
      menu.classList.add('ev-transition-leave-to')
      
      setTimeout(() => {
        menu.style.display = 'none'
        menu.classList.remove('ev-transition-leave', 'ev-transition-leave-to')
      }, 80)
    })
  }
}

// Initialize the navbar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new VanillaNavbar()
})