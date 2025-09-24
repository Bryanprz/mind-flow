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
