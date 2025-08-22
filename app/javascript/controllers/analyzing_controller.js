import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    setTimeout(() => {
      const url = `/assessment/results`;
      window.location.href = url; // Perform a standard HTML redirect
    }, 3000);
  }
}
