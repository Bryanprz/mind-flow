import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["text", "carousel"]
  static values = { 
    chronicIllness: String,
    anxiety: String,
    asthma: String,
    depression: String,
    diabetes: String,
    heartDisease: String,
    highCholesterol: String,
    hypertension: String,
    obesity: String,
    stress: String
  }
  
  connect() {
    // Define carousel items with text, hex color, and image
    // Format: [text, hexColor, imagePath]
    // Cache bust: v3
    this.carouselItems = [
      ["chronic illness", "#4e4eba", this.chronicIllnessValue],
      ["anxiety", "#4b6ca3", this.anxietyValue],
      ["asthma", "#abe5e2", this.asthmaValue],
      ["depression", "#2b648b", this.depressionValue],
      ["diabetes", "#db6f68", this.diabetesValue],
      ["heart disease", "#ef7f81", this.heartDiseaseValue],
      ["high cholesterol", "#ec2129", this.highCholesterolValue],
      ["hypertension", "#fed4e2", this.hypertensionValue],
      ["obesity", "#ef605d", this.obesityValue],
      ["stress", "#cb4e55", this.stressValue]
    ]
    
    // Extract arrays for backward compatibility
    this.textOptions = this.carouselItems.map(item => item[0])
    this.images = this.carouselItems.map(item => item[2])
    
    this.currentIndex = 0
    this.isAnimating = false
    this.isPlaying = true
    
    // Initialize the carousel
    this.initializeCarousel()
    
    // Start the auto-rotation
    this.startAutoRotation()
  }
  
  disconnect() {
    this.stopAutoRotation()
  }
  
  initializeCarousel() {
    // Create image elements with absolute positioning and transitions
    this.carouselTarget.innerHTML = this.images.map((src, index) => `
      <div class="absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ease-in-out ${index === 0 ? 'opacity-100' : 'opacity-0'}">
        <img src="${src}" alt="Healing image ${index + 1}" class="max-w-full max-h-full object-contain">
      </div>
    `).join('')
    
    // Show the first slide
    this.showSlide(0)
  }
  
  showSlide(index) {
    this.currentIndex = index
    
    // Fade out all images and fade in the active one
    const imageContainers = this.carouselTarget.querySelectorAll('div')
    imageContainers.forEach((container, i) => {
      if (i === index) {
        container.classList.remove('opacity-0')
        container.classList.add('opacity-100')
      } else {
        container.classList.remove('opacity-100')
        container.classList.add('opacity-0')
      }
    })
    
    // Update text immediately to sync with image transition
    this.textTarget.textContent = this.textOptions[this.currentIndex]
    this.updateTextColor()
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
    
    // Show the previous slide
    this.showSlide(prevIndex)
    
    // Reset animation flag
    setTimeout(() => {
      this.isAnimating = false
    }, 1000)
  }
  
  nextSlide() {
    if (this.isAnimating) return
    
    this.isAnimating = true
    const nextIndex = (this.currentIndex + 1) % this.textOptions.length
    
    // Show the next slide
    this.showSlide(nextIndex)
    
    // Reset animation flag
    setTimeout(() => {
      this.isAnimating = false
    }, 1000)
  }
  
}
