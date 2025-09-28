import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["navbar"]
  
  connect() {
    this.lastScrollY = window.scrollY
    this.ticking = false
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
    const navbar = this.hasNavbarTarget ? this.navbarTarget : document.querySelector('nav')
    
    if (!navbar) return
    
    // Hide navbar when scrolling down, show when scrolling up
    if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
      // Scrolling down and past 100px - hide navbar
      navbar.style.transform = 'translateY(-100%)'
      navbar.style.transition = 'transform 0.3s ease-in-out'
    } else {
      // Scrolling up or at top - show navbar
      navbar.style.transform = 'translateY(0)'
      navbar.style.transition = 'transform 0.3s ease-in-out'
    }
    
    this.lastScrollY = currentScrollY
  }
}