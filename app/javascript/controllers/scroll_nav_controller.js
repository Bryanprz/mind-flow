import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["navbar"]
  
  connect() {
    this.lastScrollY = window.scrollY
    this.ticking = false
    this.isHidden = false
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
    
    // Clear any existing transforms and transitions first
    navbar.style.transform = ''
    navbar.style.transition = ''
    
    // Small delay to ensure clean state
    setTimeout(() => {
      // Hide navbar when scrolling down, show when scrolling up
      if (scrollDirection === 'down' && currentScrollY > 100) {
        // Scrolling down and past 100px - hide navbar
        navbar.style.transform = `translateY(-${navbarHeight}px)`
        navbar.style.transition = 'transform 0.3s ease-in-out'
        
        // Adjust sidebar if it exists to fill the space
        const sidebar = document.querySelector('[data-sidebar]') || 
                       document.querySelector('.sidebar') ||
                       document.querySelector('#sidebar')
        if (sidebar) {
          sidebar.style.top = '0px'
          sidebar.style.transition = 'top 0.3s ease-in-out'
        }
      } else {
        // Scrolling up or at top - show navbar
        navbar.style.transform = 'translateY(0)'
        navbar.style.transition = 'transform 0.3s ease-in-out'
        
        // Adjust sidebar if it exists to make room for navbar
        const sidebar = document.querySelector('[data-sidebar]') || 
                       document.querySelector('.sidebar') ||
                       document.querySelector('#sidebar')
        if (sidebar) {
          sidebar.style.top = `${navbarHeight}px`
          sidebar.style.transition = 'top 0.3s ease-in-out'
        }
      }
    }, 10)
    
    this.lastScrollY = currentScrollY
  }
}