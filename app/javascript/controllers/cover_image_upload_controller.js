import { Controller } from "@hotwired/stimulus"
import { DirectUpload } from "@rails/activestorage"

export default class extends Controller {
  static targets = ["fileInput", "progress"]
  static values = { userId: Number }

  connect() {
    this.fileInputTarget.value = null;
  }

  selectFile(event) {
    console.log("selectFile called");
    this.fileInputTarget.click();
  }

  dragOver(event) {
    event.preventDefault();
    event.currentTarget.classList.add('border-blue-500'); // Add visual feedback
  }

  dragLeave(event) {
    event.preventDefault();
    event.currentTarget.classList.remove('border-blue-500'); // Remove visual feedback
  }

  drop(event) {
    event.preventDefault();
    event.currentTarget.classList.remove('border-blue-500'); // Remove visual feedback
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      this.uploadFile(files[0]);
    }
  }

  uploadFile(fileOrEvent) {
    let file;
    if (fileOrEvent instanceof File) {
      file = fileOrEvent;
    } else if (fileOrEvent.target && fileOrEvent.target.files && fileOrEvent.target.files.length > 0) {
      file = fileOrEvent.target.files[0];
    } else {
      return;
    }

    if (!file) return;

    this.progressTarget.classList.remove('opacity-0');
    this.progressTarget.classList.add('opacity-100');

    const upload = new DirectUpload(file, this.url);

    upload.create((error, blob) => {
      if (error) {
        console.error("Direct upload failed:", error);
        this.progressTarget.classList.remove('opacity-100');
        this.progressTarget.classList.add('opacity-0');
        alert('Failed to upload cover image. Please try again.');
      } else {
        // Attach the blob to the user's cover image
        this.attachCoverImage(blob.signed_id);
      }
    });
  }

  attachCoverImage(signedId) {
    fetch(`/users/${this.userIdValue}/attach_cover_image`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
      },
      body: JSON.stringify({ cover_image: signedId })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        window.location.reload(); // Reload page to show new cover image
      } else {
        console.error("Failed to attach cover image:", data.errors);
        alert('Failed to attach cover image. Please try again.');
      }
    })
    .catch(error => {
      console.error("Error attaching cover image:", error);
      alert('An error occurred while attaching cover image.');
    })
    .finally(() => {
      this.progressTarget.classList.remove('opacity-100');
      this.progressTarget.classList.add('opacity-0');
    });
  }

  // DirectUpload callbacks
  directUploadWillStoreFileWithXHR(xhr) {
    xhr.upload.addEventListener("progress", event => this.directUploadDidProgress(event));
  }

  directUploadDidProgress(event) {
    const progress = (event.loaded / event.total) * 100;
    this.progressTarget.textContent = `${Math.round(progress)}%`;
  }

  get url() {
    return `/rails/active_storage/direct_uploads`;
  }
}
