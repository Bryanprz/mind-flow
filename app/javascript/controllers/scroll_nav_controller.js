import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["navbar"]
  
  connect() {
    this.lastScrollY = window.scrollY
    this.ticking = false
    this.isHidden = false
    
    // Add padding to body to account for fixed navbar
    const navbar = this.hasNavbarTarget ? this.navbarTarget : 
                   document.querySelector('nav') ||
                   document.querySelector('.navbar') ||
                   document.querySelector('[data-controller*="scroll-nav"]')
    
    if (navbar) {
      const navbarHeight = navbar.offsetHeight
      // Only add padding to body if we're not on the dashboard page
      // Dashboard has its own layout structure and doesn't need body padding
      if (!window.location.pathname.includes('/dashboard')) {
        document.body.style.paddingTop = `${navbarHeight}px`
      }
    }
    
    this.bindScroll()
  }
  
  disconnect() {
    this.unbindScroll()
  }
  
  bindScroll() {
    window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true })
  }
  
  unbindScroll() {
    window.removeEventListener('scroll', this.handleScroll.bind(this))
  }
  
  handleScroll() {
    if (!this.ticking) {
      requestAnimationFrame(() => {
        this.updateNavbar()
        this.ticking = false
      })
      this.ticking = true
    }
  }
  
  updateNavbar() {
    const currentScrollY = window.scrollY
    // Try multiple selectors to find the navbar
    const navbar = this.hasNavbarTarget ? this.navbarTarget : 
                   document.querySelector('nav') ||
                   document.querySelector('.navbar') ||
                   document.querySelector('[data-controller*="scroll-nav"]')
    
    if (!navbar) return
    
    const navbarHeight = navbar.offsetHeight
    const scrollDirection = currentScrollY > this.lastScrollY ? 'down' : 'up'
    
    // Hide navbar when scrolling down, show when scrolling up
    if (scrollDirection === 'down' && currentScrollY > 100 && !this.isHidden) {
      // Scrolling down and past 100px - hide navbar
      navbar.style.position = 'fixed'
      navbar.style.width = '100%'
      navbar.style.left = '0'
      navbar.style.top = `-${navbarHeight}px`
      navbar.style.transition = 'top 0.3s ease-in-out'
      this.isHidden = true
    } else if ((scrollDirection === 'up' || currentScrollY <= 100) && this.isHidden) {
      // Scrolling up or at top - show navbar
      navbar.style.position = 'fixed'
      navbar.style.width = '100%'
      navbar.style.left = '0'
      navbar.style.top = '0'
      navbar.style.transition = 'top 0.3s ease-in-out'
      this.isHidden = false
    }
    
    this.lastScrollY = currentScrollY
  }
}
