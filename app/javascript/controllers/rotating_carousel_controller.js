import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["text", "carousel", "dot"]
  
  connect() {
    // Define the rotating text options
    this.textOptions = [
      "chronic illness",
      "digestive issues", 
      "chronic fatigue",
      "autoimmune conditions"
    ]
    
    // Define the image sources (you can replace these with your actual images)
    this.images = [
      "home-carousel/healing-1.jpg",
      "home-carousel/healing-2.jpg", 
      "home-carousel/healing-3.jpg",
      "home-carousel/healing-4.jpg"
    ]
    
    this.currentIndex = 0
    this.isAnimating = false
    
    // Initialize the carousel
    this.initializeCarousel()
    
    // Start the auto-rotation
    this.startAutoRotation()
    
    // Add click handlers for dots
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToSlide(index))
    })
  }
  
  initializeCarousel() {
    // Create image elements
    this.carouselTarget.innerHTML = this.images.map((src, index) => `
      <div class="w-full h-80 flex-shrink-0">
        <img src="${src}" alt="Healing image ${index + 1}" class="w-full h-full object-cover">
      </div>
    `).join('')
  }
  
  startAutoRotation() {
    setInterval(() => {
      if (!this.isAnimating) {
        this.nextSlide()
      }
    }, 3000) // Change every 3 seconds
  }
  
  nextSlide() {
    this.isAnimating = true
    
    // Update text
    this.currentIndex = (this.currentIndex + 1) % this.textOptions.length
    this.textTarget.textContent = this.textOptions[this.currentIndex]
    
    // Update carousel
    const translateX = -this.currentIndex * 100
    this.carouselTarget.style.transform = `translateX(${translateX}%)`
    
    // Update dots
    this.updateDots()
    
    // Reset animation flag
    setTimeout(() => {
      this.isAnimating = false
    }, 1000)
  }
  
  goToSlide(index) {
    if (this.isAnimating) return
    
    this.isAnimating = true
    this.currentIndex = index
    
    // Update text
    this.textTarget.textContent = this.textOptions[this.currentIndex]
    
    // Update carousel
    const translateX = -this.currentIndex * 100
    this.carouselTarget.style.transform = `translateX(${translateX}%)`
    
    // Update dots
    this.updateDots()
    
    // Reset animation flag
    setTimeout(() => {
      this.isAnimating = false
    }, 1000)
  }
  
  updateDots() {
    this.dots.forEach((dot, index) => {
      if (index === this.currentIndex) {
        dot.classList.remove('bg-white/50')
        dot.classList.add('bg-white')
        dot.classList.add('w-8')
      } else {
        dot.classList.remove('bg-white')
        dot.classList.add('bg-white/50')
        dot.classList.remove('w-8')
      }
    })
  }
  
  get dots() {
    return this.element.querySelectorAll('.carousel-dot')
  }
}
