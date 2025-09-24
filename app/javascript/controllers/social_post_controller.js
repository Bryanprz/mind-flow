import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["likeButton", "likesCount", "replyButton", "replyForm", "repliesList", "repliesCount", "saveButton", "savesCount"]
  static values = { postId: Number, url: String }

  toggleLike(event) {
    event.preventDefault()
    
    const isLiked = this.likeButtonTarget.classList.contains('text-red-500')
    const url = `/social_posts/${this.postIdValue}/social_post_likes`
    const method = isLiked ? 'DELETE' : 'POST'
    
    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        this.updateLikeButton(data.liked, data.likes_count)
      }
    })
    .catch(error => console.error('Error:', error))
  }

  updateLikeButton(liked, count) {
    if (liked) {
      this.likeButtonTarget.classList.add('text-red-500')
      this.likeButtonTarget.querySelector('svg').setAttribute('fill', 'currentColor')
    } else {
      this.likeButtonTarget.classList.remove('text-red-500')
      this.likeButtonTarget.querySelector('svg').setAttribute('fill', 'none')
    }
    this.likesCountTarget.textContent = count
  }

  toggleReplyForm() {
    if (this.hasReplyFormTarget) {
      this.replyFormTarget.classList.toggle('hidden')
    }
  }

  createReply(event) {
    console.log("createReply triggered");
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const url = form.action;

    const trixEditor = form.querySelector('trix-editor');
    if (trixEditor && trixEditor.editor) {
      const hiddenInput = form.querySelector('input[type="hidden"][name="social_post_reply[content]"]');
      if (hiddenInput) {
        const content = trixEditor.editor.element.innerHTML;
        if (trixEditor.editor.getDocument().toString().trim() === '') {
          formData.set(hiddenInput.name, '');
        } else {
          formData.set(hiddenInput.name, content);
        }
      }
    }

    // Clear previous errors
    const existingError = form.querySelector('.form-errors');
    if (existingError) {
      existingError.remove();
    }

    fetch(url, {
      method: 'POST',
      headers: {
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content,
        'Accept': 'application/json'
      },
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        const mainRepliesList = document.querySelector(`#replies-list-for-post-${this.postIdValue}`);
        if (mainRepliesList) {
          mainRepliesList.insertAdjacentHTML('beforeend', data.reply);
        }
        
        const mainRepliesCount = document.querySelector(`#replies-count-for-post-${this.postIdValue}`);
        if (mainRepliesCount) {
          mainRepliesCount.textContent = data.replies_count;
        }

        form.reset();
        // Also reset the Trix editor
        const trixEditor = form.querySelector('trix-editor');
        if (trixEditor) {
          trixEditor.editor.loadHTML('');
        }
        
        this.replyFormTarget.classList.add('hidden');
      } else {
        const errorMessages = data.errors ? data.errors.join(', ') : 'Could not post reply.';
        const errorElement = document.createElement('div');
        errorElement.className = 'form-errors text-red-500 text-sm mt-2';
        errorElement.textContent = errorMessages;
        form.prepend(errorElement);
      }
    })
    .catch(error => console.error('Error:', error));
  }




  updateReplyCount(count) {
    if (this.hasRepliesCountTarget) {
      this.repliesCountTarget.textContent = count
    }
  }

  toggleSave(event) {
    event.preventDefault()
    
    const isSaved = this.saveButtonTarget.classList.contains('text-blue-500')
    const url = isSaved 
      ? `/social_posts/${this.postIdValue}/saved_posts`
      : `/social_posts/${this.postIdValue}/saved_posts`
    
    const method = isSaved ? 'DELETE' : 'POST'
    
    fetch(url, {
      method: method,
      headers: {
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content,
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        this.updateSaveButton(data.saved)
        this.updateSaveCount(data.saves_count)
      }
    })
    .catch(error => console.error('Error:', error))
  }

  updateSaveButton(saved) {
    if (saved) {
      this.saveButtonTarget.classList.add('text-blue-500')
      this.saveButtonTarget.querySelector('svg').setAttribute('fill', 'currentColor')
    } else {
      this.saveButtonTarget.classList.remove('text-blue-500')
      this.saveButtonTarget.querySelector('svg').setAttribute('fill', 'none')
    }
  }

  updateSaveCount(count) {
    this.savesCountTarget.textContent = count
  }

  openPost(event) {
    event.preventDefault()
    window.location.href = this.urlValue
  }

  stopPropagation(event) {
    event.stopPropagation()
  }
}
