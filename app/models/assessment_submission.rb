class AssessmentSubmission < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :health_assessment
  # Original relations with aliases for convenience
  has_many :answers, class_name: 'AssessmentAnswer', foreign_key: 'assessment_submission_id', dependent: :destroy
  has_many :options, through: :answers, source: :assessment_option
  has_many :questions, through: :options, source: :assessment_question
  
  # Keep original relations for backward compatibility
  has_many :assessment_answers, dependent: :destroy
  has_many :assessment_options, through: :assessment_answers
  has_many :assessment_questions, through: :assessment_options

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
    assessment_answers.includes(:assessment_option).each do |answer|
      if answer.assessment_option && answer.assessment_option.dosha.present?
        dosha = answer.assessment_option.dosha.downcase.to_sym
        scores[dosha] += 1 if scores.key?(dosha)
      end
    end

    # Sort scores to determine primary and secondary doshas
    sorted_scores = scores.sort_by { |_, v| -v }

    # Return the results hash
    if sorted_scores.any? { |_, score| score > 0 }
      primary = sorted_scores[0][0].to_s
      secondary = sorted_scores[1][0].to_s
      {
        scores: scores,
        primary_dosha: primary,
        secondary_dosha: secondary
      }
    else
      # If no valid answers, return default values
      {
        scores: scores,
        primary_dosha: nil,
        secondary_dosha: nil
      }
    end
  end
end
