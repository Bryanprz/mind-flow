import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["navbar"]
  
  connect() {
    this.lastScrollY = window.scrollY
    this.ticking = false
    
    // Add scroll event listener
    window.addEventListener('scroll', this.handleScroll.bind(this))
  }
  
  disconnect() {
    // Remove scroll event listener
    window.removeEventListener('scroll', this.handleScroll.bind(this))
  }
  
  handleScroll() {
    if (!this.ticking) {
      requestAnimationFrame(this.updateNavbar.bind(this))
      this.ticking = true
    }
  }
  
  updateNavbar() {
    // Apply scroll behavior on homepage and community page
    const currentPath = window.location.pathname
    const isHomePage = currentPath === '/' || currentPath === ''
    const isCommunityPage = currentPath.includes('/community')
    
    if (!isHomePage && !isCommunityPage) {
      return
    }
    
    const currentScrollY = window.scrollY
    
    // Only apply after scrolling past a certain point
    if (currentScrollY > 100) {
      if (currentScrollY > this.lastScrollY) {
        // Scrolling down - hide navbar
        this.navbarTarget.classList.add('transform', '-translate-y-full')
        this.navbarTarget.classList.remove('transform', 'translate-y-0')
      } else {
        // Scrolling up - show navbar
        this.navbarTarget.classList.remove('transform', '-translate-y-full')
        this.navbarTarget.classList.add('transform', 'translate-y-0')
      }
    } else {
      // Near top of page - always show navbar
      this.navbarTarget.classList.remove('transform', '-translate-y-full')
      this.navbarTarget.classList.add('transform', 'translate-y-0')
    }
    
    this.lastScrollY = currentScrollY
    this.ticking = false
  }
}
