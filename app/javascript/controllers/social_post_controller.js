import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["likeButton", "likesCount", "replyButton", "replyForm", "repliesList", "repliesCount", "saveButton", "savesCount"]
  static values = { postId: Number, url: String, originalPostId: Number }

  toggleLike(event) {
    event.preventDefault()
    
    const isLiked = this.likeButtonTarget.classList.contains('text-red-500')
    const url = `/likes`
    
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
      },
      body: JSON.stringify({
        likeable_type: 'SocialPost',
        likeable_id: this.postIdValue,
        action: isLiked ? 'destroy' : 'create'
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.json()
    })
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
    // Show the reply form for this specific post (whether it's a main post or reply)
    if (this.hasReplyFormTarget) {
      // For main posts, use the target
      this.replyFormTarget.classList.toggle('hidden');
    } else {
      // For replies, find the form by ID
      const replyForm = document.querySelector(`#reply-form-for-post-${this.postIdValue}`);
      if (replyForm) {
        replyForm.classList.toggle('hidden');
      }
    }
  }

  createReply(event) {
    console.log("createReply triggered");
    event.preventDefault();
    const form = event.target;
    const url = form.action;
    
    // Get the parent post ID from the form data first
    const parentPostIdInput = form.querySelector('input[name="social_post[parent_post_id]"]');
    const parentPostId = parentPostIdInput ? parentPostIdInput.value : null;

    // Ensure Trix editor content is properly synchronized before creating FormData
    const trixEditor = form.querySelector('trix-editor');
    if (trixEditor && trixEditor.editor) {
      const hiddenInput = form.querySelector('input[type="hidden"][name*="[content]"]');
      if (hiddenInput) {
        // Force Trix to sync its content to the hidden input
        trixEditor.dispatchEvent(new Event('change', { bubbles: true }));
        
        const content = trixEditor.editor.element.innerHTML;
        const textContent = trixEditor.editor.getDocument().toString().trim();
        console.log('Trix content:', content);
        console.log('Trix text:', textContent);
        console.log('Hidden input value before:', hiddenInput.value);
        
        // Force update the hidden input with the current content
        if (textContent === '') {
          hiddenInput.value = '';
        } else {
          hiddenInput.value = content;
        }
        
        console.log('Hidden input value after:', hiddenInput.value);
      }
    }

    // Small delay to ensure Trix content is fully processed
    setTimeout(() => {
      // Create FormData after ensuring Trix content is synced
      const formData = new FormData(form);

      const statusMessages = document.getElementById('reply-status-messages');
      if (statusMessages) statusMessages.innerHTML = '';

      // Debug: Log what we're sending
      console.log('Form data entries:');
      for (let [key, value] of formData.entries()) {
        console.log(key, ':', value);
      }
      
      // Additional debugging for content field
      const contentValue = formData.get('social_post[content]');
      console.log('Content field value:', contentValue);
      console.log('Content field length:', contentValue ? contentValue.length : 0);
      
      // Fallback: If content is empty but Trix editor has content, force it
      if ((!contentValue || contentValue.trim() === '') && trixEditor && trixEditor.editor) {
        const trixContent = trixEditor.editor.element.innerHTML;
        const trixText = trixEditor.editor.getDocument().toString().trim();
        console.log('Fallback: Trix content detected:', trixContent);
        console.log('Fallback: Trix text detected:', trixText);
        
        if (trixText !== '') {
          formData.set('social_post[content]', trixContent);
          console.log('Fallback: Content set to:', trixContent);
        }
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
        // If we have a redirect URL, navigate to it
        if (data.redirect_url) {
          window.location.href = data.redirect_url;
          return;
        }
        
        // Try to find the replies list for the parent post
        const repliesList = document.querySelector(`#replies-list-for-post-${parentPostId}`);
        
        if (repliesList) {
          // Remove the "No replies yet" message using the specific ID
          const noRepliesMessage = document.getElementById(`no-replies-message-${parentPostId}`);
          
          if (noRepliesMessage) {
            noRepliesMessage.remove();
          }
          
          // More aggressive fallback: Search the entire page for any "No replies yet" message
          const allNoRepliesMessages = document.querySelectorAll('*');
          allNoRepliesMessages.forEach(element => {
            if (element.textContent && element.textContent.includes('No replies yet')) {
              element.remove();
            }
          });
          
          // Also check if the replies list itself contains the message
          if (repliesList.textContent && repliesList.textContent.includes('No replies yet')) {
            Array.from(repliesList.children).forEach(child => {
              if (child.textContent && child.textContent.includes('No replies yet')) {
                child.remove();
              }
            });
          }
          
          repliesList.insertAdjacentHTML('beforeend', data.reply);
          const newReplyElement = repliesList.lastElementChild;
          if (newReplyElement) {
            const messageElement = document.createElement('div');
            messageElement.className = 'text-green-600 mb-2';
            messageElement.textContent = 'Your reply has been posted!';
            newReplyElement.before(messageElement);
            setTimeout(() => { messageElement.remove(); }, 5000);
          }
        } else {
          // If no replies list found, reload the page to show the new reply
          window.location.reload();
          return;
        }
        
        // Update replies count
        const repliesCount = document.querySelector(`#replies-count-for-post-${parentPostId}`);
        if (repliesCount) {
          repliesCount.textContent = data.replies_count;
        }
        
        // Additional cleanup: Use setTimeout to ensure DOM is fully updated
        setTimeout(() => {
          const noRepliesMessage = document.getElementById(`no-replies-message-${parentPostId}`);
          if (noRepliesMessage) {
            noRepliesMessage.remove();
          }
          
          // Final sweep for any remaining "No replies yet" messages
          const remainingMessages = document.querySelectorAll('*');
          remainingMessages.forEach(element => {
            if (element.textContent && element.textContent.includes('No replies yet')) {
              element.remove();
            }
          });
        }, 100);

        // Reset form
        form.reset();
        const trixEditor = form.querySelector('trix-editor');
        if (trixEditor) {
          trixEditor.editor.loadHTML('');
        }
        
        // Hide the reply form
        if (this.hasReplyFormTarget) {
          this.replyFormTarget.classList.add('hidden');
        } else {
          // For replies, find and hide the form by ID
          const replyForm = document.querySelector(`#reply-form-for-post-${this.postIdValue}`);
          if (replyForm) {
            replyForm.classList.add('hidden');
          }
        }
      } else {
        const errorMessages = data.errors ? data.errors.join(', ') : 'Could not post reply.';
        if (statusMessages) {
          statusMessages.innerHTML = `<p class="text-red-500">${errorMessages}</p>`;
        }
      }
    })
    .catch(error => console.error('Error:', error));
    }, 100); // End of setTimeout
  }




  updateReplyCount(count) {
    if (this.hasRepliesCountTarget) {
      this.repliesCountTarget.textContent = count
    }
  }

  toggleSave(event) {
    event.preventDefault()
    
    const isSaved = this.saveButtonTarget.classList.contains('text-blue-500')
    const url = `/social_post_bookmarks`
    
    fetch(url, {
      method: 'POST',
      headers: {
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        bookmarkable_type: 'SocialPost',
        bookmarkable_id: this.postIdValue,
        action: isSaved ? 'destroy' : 'create'
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.json()
    })
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
