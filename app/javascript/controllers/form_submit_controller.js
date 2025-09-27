import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  handleClick(event) {
    console.log("Submit button clicked!")
    console.log("Form element:", this.element)
    console.log("Form action:", this.element.action)
    console.log("Form method:", this.element.method)
    
    // Check if form is valid
    const isValid = this.element.checkValidity()
    console.log("Form is valid:", isValid)
    
    if (!isValid) {
      console.log("Form validation failed!")
      this.element.reportValidity()
    }
    
    // Let the form submit normally
    return true
  }
}
