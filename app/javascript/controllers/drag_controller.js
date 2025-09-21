
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["dragContainer", "dragItem"]

  connect() {
    this.dragItemTargets.forEach(item => {
      item.addEventListener("mousedown", this.dragStart)
      item.addEventListener("touchstart", this.dragStart)
    })

    this.dragEnd = this.dragEnd.bind(this)
    this.dragMove = this.dragMove.bind(this)
  }

  disconnect() {
    this.dragItemTargets.forEach(item => {
      item.removeEventListener("mousedown", this.dragStart)
      item.removeEventListener("touchstart", this.dragStart)
    })
  }

  dragStart(event) {
    this.activeItem = event.target

    this.longPressTimeout = setTimeout(() => {
      this.activeItem.classList.add("dragging")

      document.addEventListener("mouseup", this.dragEnd)
      document.addEventListener("touchend", this.dragEnd)
      document.addEventListener("mousemove", this.dragMove)
      document.addEventListener("touchmove", this.dragMove)

      this.dragMove(event)
    }, 300)
  }

  dragMove(event) {
    if (!this.activeItem) return

    event.preventDefault()

    let x, y
    if (event.type.startsWith("touch")) {
      x = event.touches[0].clientX
      y = event.touches[0].clientY
    } else {
      x = event.clientX
      y = event.clientY
    }

    const containerRect = this.dragContainerTarget.getBoundingClientRect()

    let newX = x - containerRect.left - this.activeItem.offsetWidth / 2
    let newY = y - containerRect.top - this.activeItem.offsetHeight / 2

    newX = Math.max(0, Math.min(newX, containerRect.width - this.activeItem.offsetWidth))
    newY = Math.max(0, Math.min(newY, containerRect.height - this.activeItem.offsetHeight))

    this.activeItem.style.left = `${newX}px`
    this.activeItem.style.top = `${newY}px`
  }

  dragEnd() {
    clearTimeout(this.longPressTimeout)
    if (this.activeItem) {
      this.activeItem.classList.remove("dragging")
      this.activeItem = null
    }

    document.removeEventListener("mouseup", this.dragEnd)
    document.removeEventListener("touchend", this.dragEnd)
    document.removeEventListener("mousemove", this.dragMove)
    document.removeEventListener("touchmove", this.dragMove)
  }
}
