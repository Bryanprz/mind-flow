import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "questionContainer",
    "questionText",
    "optionsContainer",
    "progressBar",
    "progressText",
    "backButton",
    "nextButton",
    "answers"
  ]

  static values = {
    questions: { type: Array, default: [] },
    answers: { type: Array, default: [] }
  }

  connect() {
    this.currentIndex = 0
    
    // Initialize answers if not already set
    if (!Array.isArray(this.answersValue)) {
      this.answersValue = []
    }
    
    // Scroll to top when assessment loads
    window.scrollTo({ top: 0, behavior: 'smooth' })
    
    // Render the first question
    this.renderQuestion()
  }

  next() {
    try {
      if (!this.questionsValue || this.questionsValue.length === 0) {
        return
      }
      
      if (this.currentIndex < this.questionsValue.length - 1) {
        this.currentIndex++
        this.renderQuestion()
      } else {
        this.submit()
      }
    } catch (error) {
      // Silently handle error
    }
  }

  back() {
    if (this.currentIndex > 0) {
      this.currentIndex--
      this.renderQuestion()
    }
  }

  selectOption(event) {
    try {
      event.preventDefault()
      
      const { questionId, optionId } = event.currentTarget.dataset
      if (!questionId || !optionId) {
        return
      }
      
      // Update answers array, removing existing answer for this question if it exists
      const newAnswers = [
        ...this.answersValue.filter(a => a && a.question_id !== questionId),
        { question_id: questionId, option_id: optionId }
      ]
      
      this.answersValue = newAnswers
      
      // Update the hidden field with the latest answers
      if (this.hasAnswersTarget) {
        this.answersTarget.value = JSON.stringify(newAnswers)
      }
      
      // Update UI
      this.updateButtonVisibility()
      
      // If this is the last question, submit the form
      // Otherwise, move to the next question
      if (this.currentIndex === this.questionsValue.length - 1) {
        setTimeout(() => this.submit(), 300) // Small delay for better UX
      } else {
        this.next()
      }
    } catch (error) {
      // Silently handle error
    }
  }

  renderQuestion() {
    if (!this.questionsValue || this.questionsValue.length === 0) {
      console.error('No questions available')
      return
    }

    const question = this.questionsValue[this.currentIndex]
    if (!question) {
      console.error(`No question found at index ${this.currentIndex}`)
      return
    }

    // Safely set question text
    if (this.hasQuestionTextTarget) {
      this.questionTextTarget.textContent = question.text || ''
    }

    // Clear options container
    if (this.hasOptionsContainerTarget) {
      this.optionsContainerTarget.innerHTML = ''

      // Safely handle options
      const options = question.assessment_options || []
      options.forEach(option => {
        const isChecked = this.answersValue.some(a => 
          a && 
          a.question_id && 
          a.option_id &&
          a.question_id.toString() === question.id.toString() && 
          a.option_id.toString() === option.id.toString()
        )
        
        this.optionsContainerTarget.insertAdjacentHTML('beforeend', `
          <button type="button"
                  class="w-full p-4 border-2 border-gray-200 rounded-lg text-left transition-all duration-200 ease-in-out
                        hover:border-primary hover:bg-primary hover:text-white text-start
                        ${isChecked ? 'border-primary bg-primary text-white shadow-md' : ''}"
                  data-action="click->assessment#selectOption"
                  data-question-id="${question.id}"
                  data-option-id="${option.id}">
            <div class="flex justify-between items-center">
              <span class="text-md md:text-lg font-medium">${option.text || ''}</span>
              ${isChecked ? `
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              ` : ''}
            </div>
          </button>
        `)
      })
    }

    this.updateProgress()
    this.updateButtonVisibility()
  }

  updateProgress() {
    if (!this.questionsValue || this.questionsValue.length === 0) {
      return
    }

    try {
      const progress = ((this.currentIndex + 1) / this.questionsValue.length) * 100
      const roundedProgress = Math.round(progress)
      
      if (this.hasProgressBarTarget) {
        this.progressBarTarget.style.width = `${progress}%`
      }
      
      if (this.hasProgressTextTarget) {
        this.progressTextTarget.textContent = `${roundedProgress}% Complete`
      }
    } catch (error) {
      // Silently handle error
    }
  }

  updateButtonVisibility() {
    if (!this.hasBackButtonTarget || !this.hasNextButtonTarget) return
    
    const currentQuestion = this.questionsValue[this.currentIndex]
    if (!currentQuestion) return
    
    const currentQuestionId = currentQuestion.id?.toString()
    const hasAnswer = this.answersValue.some(a => 
      a && 
      a.question_id && 
      a.question_id.toString() === currentQuestionId
    )
    
    // Update back button visibility
    this.backButtonTarget.classList.toggle('hidden', this.currentIndex === 0)
    
    // Update next button state and text
    this.nextButtonTarget.disabled = !hasAnswer
    this.nextButtonTarget.textContent = this.currentIndex === this.questionsValue.length - 1 ? "Finish" : "Next"
  }

  submit() {
    try {
      // Use the form's submit method which is more widely supported
      const form = this.element.querySelector('form')
      if (form) {
        form.requestSubmit()
      } else {
        console.error('No form found to submit')
        // Fallback to the element's submit method if available
        if (typeof this.element.submit === 'function') {
          this.element.submit()
        } else {
          console.error('No submit method available on element')
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      // As a last resort, try to manually submit the form
      try {
        const form = this.element.querySelector('form')
        if (form) {
          const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
          form.dispatchEvent(submitEvent)
        }
      } catch (e) {
        console.error('Fallback form submission also failed:', e)
      }
    }
  }
}
