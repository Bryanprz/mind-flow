import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["likeButton", "likesCount", "replyButton", "replyForm", "repliesList", "repliesCount", "saveButton", "savesCount", "contentContainer", "truncatedContent", "fullContent", "expandButton", "collapseButton", "postContent"]
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
        
        // Force update the hidden input with the current content
        if (textContent === '') {
          hiddenInput.value = '';
        } else {
          hiddenInput.value = content;
        }
        
      }
    }

    // Small delay to ensure Trix content is fully processed
    setTimeout(() => {
      // Create FormData after ensuring Trix content is synced
      const formData = new FormData(form);

      const statusMessages = document.getElementById('reply-status-messages');
      if (statusMessages) statusMessages.innerHTML = '';

      // Debug: Log what we're sending
      for (let [key, value] of formData.entries()) {
      }
      
      // Additional debugging for content field
      const contentValue = formData.get('social_post[content]');
      
      // Fallback: If content is empty but Trix editor has content, force it
      if ((!contentValue || contentValue.trim() === '') && trixEditor && trixEditor.editor) {
        const trixContent = trixEditor.editor.element.innerHTML;
        const trixText = trixEditor.editor.getDocument().toString().trim();
        
        if (trixText !== '') {
          formData.set('social_post[content]', trixContent);
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
        // If we have a redirect URL, navigate to it (only if we're not already on the show page)
        if (data.redirect_url && !window.location.pathname.includes('/social_posts/')) {
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
            // Add a unique ID to the new reply for better scrolling
            newReplyElement.id = `reply-${Date.now()}`;
            
            // Add a temporary success message
            const messageElement = document.createElement('div');
            messageElement.className = 'text-green-600 mb-2 text-sm';
            messageElement.textContent = 'Your reply has been posted!';
            newReplyElement.before(messageElement);
            setTimeout(() => { messageElement.remove(); }, 5000);
            
            // Auto-scroll to the new reply with a slight delay to ensure DOM is updated
            setTimeout(() => {
              newReplyElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center',
                inline: 'nearest'
              });
              
              // Add a subtle highlight effect
              newReplyElement.style.backgroundColor = '#f0f9ff';
              newReplyElement.style.transition = 'background-color 0.3s ease';
              setTimeout(() => {
                newReplyElement.style.backgroundColor = '';
              }, 2000);
            }, 200);
          }
          
          // Add a flash notice at the top of the page
          this.showFlashNotice('Reply posted successfully!');
        } else {
          // If no replies list found, reload the page to show the new reply
          window.location.reload();
          return;
        }
        
        // Update replies count for the parent post
        const repliesCount = document.querySelector(`#replies-count-for-post-${parentPostId}`);
        if (repliesCount) {
          repliesCount.textContent = data.replies_count;
        }
        
        // Update replies count for the specific reply that received a new reply (if it's a nested reply)
        if (data.reply_replies_count !== undefined) {
          // Find the reply that received the new reply (the parent of the new reply)
          const replyRepliesCount = document.querySelector(`#replies-count-for-post-${parentPostId}`);
          if (replyRepliesCount) {
            replyRepliesCount.textContent = data.reply_replies_count;
          }
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
        
        // Clear image previews
        this.clearImagePreviews(form);
        
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
  
  showFlashNotice(message) {
    // Create a flash notice element that works with the existing flash controller
    const flashContainer = document.createElement('div');
    flashContainer.setAttribute('role', 'alert');
    flashContainer.setAttribute('data-controller', 'flash');
    flashContainer.setAttribute('data-action', 'transitionend->flash#remove');
    flashContainer.className = 'fixed top-16 left-1/2 transform -translate-x-1/2 z-50 max-w-md px-5 alert alert-success shadow-lg transition-opacity transition-transform duration-1000 ease-out';
    
    flashContainer.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>${message}</span>
    `;
    
    // Add to body
    document.body.appendChild(flashContainer);
    
    // Let the flash controller handle the auto-removal
    // The flash controller will automatically add opacity-0 and -translate-y-4 after 5 seconds
    // and remove the element when the transition ends
  }

  expandContent(event) {
    event.preventDefault()
    event.stopPropagation()
    
    if (this.hasTruncatedContentTarget && this.hasFullContentTarget) {
      this.truncatedContentTarget.classList.add('hidden')
      this.fullContentTarget.classList.remove('hidden')
    }
  }

  collapseContent(event) {
    event.preventDefault()
    event.stopPropagation()
    
    if (this.hasTruncatedContentTarget && this.hasFullContentTarget) {
      this.fullContentTarget.classList.add('hidden')
      this.truncatedContentTarget.classList.remove('hidden')
    }
  }

  // Initialize content display based on length
  connect() {
    this.initializeContentDisplay()
  }

  initializeContentDisplay() {
    if (!this.hasPostContentTarget || !this.hasTruncatedContentTarget || !this.hasFullContentTarget) {
      return
    }

    // Get the full content text (stripped of HTML tags for length calculation)
    const fullContentElement = this.fullContentTarget
    const fullText = fullContentElement.textContent || fullContentElement.innerText || ''
    const cleanText = fullText.replace(/\s+/g, ' ').trim()
    
    // Check if this is an embedded post (smaller truncation threshold)
    const isEmbedded = this.hasPostContentTarget && this.postContentTarget.hasAttribute('data-embedded')
    const truncationThreshold = isEmbedded ? 150 : 200
    
    // If content is shorter than threshold, hide the truncation and show full content
    if (cleanText.length <= truncationThreshold) {
      this.truncatedContentTarget.classList.add('hidden')
      this.fullContentTarget.classList.remove('hidden')
      // Hide the "See less" button for short content
      const collapseButton = this.fullContentTarget.querySelector('[data-social-post-target="collapseButton"]')
      if (collapseButton) {
        collapseButton.classList.add('hidden')
      }
    } else {
      // Show truncated content by default for long content
      this.fullContentTarget.classList.add('hidden')
      this.truncatedContentTarget.classList.remove('hidden')
    }
  }

  clearImagePreviews(form) {
    // Find the image-preview controller associated with this form
    const imagePreviewController = this.application.getControllerForElementAndIdentifier(form, 'image-preview');
    if (imagePreviewController && imagePreviewController.clearPreviews) {
      imagePreviewController.clearPreviews();
    }
  }
}
