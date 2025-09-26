import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["text", "carousel", "prevBtn", "nextBtn", "playPauseBtn", "playIcon", "pauseIcon"]
  
  connect() {
    // Define carousel items with text, hex color, and image
    // Format: [text, hexColor, imagePath]
    // Cache bust: v2
    this.carouselItems = [
      ["chronic illness", "#4e4eba", "/home-carousel-optimized/chronic-illness.png"],
      ["anxiety", "#4b6ca3", "/home-carousel-optimized/anxiety.png"],
      ["asthma", "#abe5e2", "/home-carousel-optimized/asthma.png"],
      ["depression", "#2b648b", "/home-carousel-optimized/depression.png"],
      ["diabetes", "#db6f68", "/home-carousel-optimized/diabetes.png"],
      ["heart disease", "#ef7f81", "/home-carousel-optimized/heart-disease.png"],
      ["high cholesterol", "#ec2129", "/home-carousel-optimized/high-cholesterol.png"],
      ["hypertension", "#fed4e2", "/home-carousel-optimized/hypertension.png"],
      ["obesity", "#ef605d", "/home-carousel-optimized/obesity.png"],
      ["stress", "#cb4e55", "/home-carousel-optimized/stress.png"]
    ]
    
    // Extract arrays for backward compatibility
    this.textOptions = this.carouselItems.map(item => item[0])
    this.images = this.carouselItems.map(item => item[2])
    
    this.currentIndex = 0
    this.isAnimating = false
    this.isPlaying = true
    
    // Initialize the carousel
    this.initializeCarousel()
    
    // Initialize play/pause button state
    this.updatePlayPauseButton()
    
    // Start the auto-rotation
    this.startAutoRotation()
  }
  
  disconnect() {
    this.stopAutoRotation()
  }
  
  initializeCarousel() {
    // Create image elements with appropriate sizing
    this.carouselTarget.innerHTML = this.images.map((src, index) => `
      <div class="w-full h-64 flex-shrink-0 flex items-center justify-center">
        <img src="${src}" alt="Healing image ${index + 1}" class="max-w-full max-h-full object-contain">
      </div>
    `).join('')
    
    // Set initial position to show first image
    this.carouselTarget.style.transform = 'translateX(0%)'
    
    // Show the first slide
    this.showSlide(0)
  }
  
  showSlide(index) {
    this.currentIndex = index
    
    // Update text with alternating colors
    this.textTarget.textContent = this.textOptions[this.currentIndex]
    this.updateTextColor()
    
    // Update carousel position - each slide is 10% of the total width
    const translateX = -this.currentIndex * 10
    this.carouselTarget.style.transform = `translateX(${translateX}%)`
  }
  
  updateTextColor(index = null) {
    // Use provided index or current index
    const targetIndex = index !== null ? index : this.currentIndex
    const hexColor = this.carouselItems[targetIndex][1]
    
    // Remove all color classes
    this.textTarget.classList.remove(
      'text-primary', 'text-secondary', 'text-accent', 'text-neutral',
      'text-info', 'text-success', 'text-warning', 'text-error'
    )
    
    // Apply the hex color directly as inline style
    this.textTarget.style.color = hexColor
    this.textTarget.classList.add('font-black')
  }
  
  startAutoRotation() {
    this.autoRotateInterval = setInterval(() => {
      if (!this.isAnimating && this.isPlaying) {
        this.nextSlide()
      }
    }, 3000) // Change every 3 seconds
  }
  
  stopAutoRotation() {
    if (this.autoRotateInterval) {
      clearInterval(this.autoRotateInterval)
      this.autoRotateInterval = null
    }
  }
  
  // Navigation methods
  previousSlide() {
    if (this.isAnimating) return
    
    this.isAnimating = true
    const prevIndex = this.currentIndex === 0 ? this.textOptions.length - 1 : this.currentIndex - 1
    
    // Update text and color
    this.textTarget.textContent = this.textOptions[prevIndex]
    this.updateTextColor(prevIndex)
    
    // Update carousel position
    const translateX = -prevIndex * 10
    this.carouselTarget.style.transform = `translateX(${translateX}%)`
    
    // Update current index
    this.currentIndex = prevIndex
    
    // Reset animation flag
    setTimeout(() => {
      this.isAnimating = false
    }, 1000)
  }
  
  nextSlide() {
    if (this.isAnimating) return
    
    this.isAnimating = true
    const nextIndex = (this.currentIndex + 1) % this.textOptions.length
    
    // Update text and color
    this.textTarget.textContent = this.textOptions[nextIndex]
    this.updateTextColor(nextIndex)
    
    // Update carousel position - each slide is 10% of the total width
    const translateX = -nextIndex * 10
    this.carouselTarget.style.transform = `translateX(${translateX}%)`
    
    // Update current index
    this.currentIndex = nextIndex
    
    // Reset animation flag
    setTimeout(() => {
      this.isAnimating = false
    }, 1000)
  }
  
  togglePlayPause() {
    this.isPlaying = !this.isPlaying
    this.updatePlayPauseButton()
  }
  
  updatePlayPauseButton() {
    if (this.isPlaying) {
      this.playIconTarget.classList.add('hidden')
      this.pauseIconTarget.classList.remove('hidden')
    } else {
      this.playIconTarget.classList.remove('hidden')
      this.pauseIconTarget.classList.add('hidden')
    }
  }
}
