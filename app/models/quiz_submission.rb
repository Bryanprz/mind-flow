class QuizSubmission < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :quiz
  has_many :quiz_answers, dependent: :destroy
  has_many :quiz_options, through: :quiz_answers
  has_many :questions, through: :quiz_options

  # Store results as a serialized hash (Rails 7+ syntax)
  serialize :results, type: Hash, coder: JSON

  # Scopes
  scope :completed, -> { where.not(completed_at: nil) }
  scope :in_progress, -> { where(completed_at: nil) }

  # Instance methods
  def completed?
    completed_at.present?
  end

  # Returns the primary dosha for this submission
  def primary_dosha
    return nil unless results && results[:primary_dosha]
    Dosha.find_by(name: results[:primary_dosha])
  end
  
  # Returns the secondary dosha for this submission
  def secondary_dosha
    return nil unless results && results[:secondary_dosha]
    Dosha.find_by(name: results[:secondary_dosha])
  end
  
  # Returns the dosha scores as a hash
  def dosha_scores
    results&.dig(:scores) || { vata: 0, pitta: 0, kapha: 0 }
  end
  
  def calculate_results
    # Initialize scores with all doshas set to 0
    scores = { vata: 0, pitta: 0, kapha: 0 }
    
    # Calculate scores based on answers
    quiz_answers.includes(:quiz_option).each do |answer|
      if answer.quiz_option && answer.quiz_option.dosha.present?
        dosha = answer.quiz_option.dosha.downcase.to_sym
        scores[dosha] += 1 if scores.key?(dosha)
      end
    end
    
    # Sort scores to determine primary and secondary doshas
    sorted_scores = scores.sort_by { |_, v| -v }
    
    # Ensure we have at least one score before proceeding
    if sorted_scores.any? { |_, score| score > 0 }
      primary = sorted_scores[0][0].to_s
      secondary = sorted_scores[1][0].to_s
      
      # Update the results
      update!(
        results: {
          scores: scores,
          primary_dosha: primary,
          secondary_dosha: secondary
        },
        completed_at: Time.current
      )
    else
      # If no valid answers, set default values
      update!(
        results: {
          scores: scores,
          primary_dosha: nil,
          secondary_dosha: nil
        },
        completed_at: Time.current
      )
    end
  end
end
