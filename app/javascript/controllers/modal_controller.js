import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="modal"
export default class ModalController extends Controller {
  static targets = ["modal"]

  connect() {
    console.log("Modal controller connected")
  }

  open() {
    this.modalTarget.showModal()
  }

  close() {
    this.modalTarget.close()
  }
}