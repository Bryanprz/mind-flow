class QuizEntry < ApplicationRecord
  belongs_to :quiz
  belongs_to :user, optional: true
  has_many :quiz_answers
  
  # Scopes
  scope :completed, -> { where.not(completed_at: nil) }
  scope :incomplete, -> { where(completed_at: nil) }
  scope :with_dosha_scores, -> { includes(quiz_answers: { quiz_option: :question }) }
  
  # Returns a hash of dosha scores for this quiz entry
  def calculate_dosha_scores
    quiz_answers.each_with_object(Hash.new(0)) do |answer, scores|
      scores[answer.quiz_option.dosha] += answer.question.points
    end
  end
  
  # Returns the primary and secondary doshas with their scores
  def calculate_primary_doshas
    scores = calculate_dosha_scores
    sorted_doshas = scores.sort_by { |_dosha, score| -score }
    
    primary = sorted_doshas[0] if sorted_doshas[0].present?
    secondary = sorted_doshas[1] if sorted_doshas[1].present?
    
    {
      primary_dosha: primary&.first,
      primary_score: primary&.last,
      secondary_dosha: secondary&.first,
      secondary_score: secondary&.last,
      all_scores: scores
    }
  end
  
  # Returns the primary dosha name
  def primary_dosha
    calculate_primary_doshas[:primary_dosha]
  end
  
  # Returns the secondary dosha name
  def secondary_dosha
    calculate_primary_doshas[:secondary_dosha]
  end
  
  # Returns all dosha scores
  def dosha_scores
    calculate_dosha_scores
  end
  
  # Updates the user's prakruti if not already set
  def update_user_prakruti!
    return unless user && primary_dosha.present? && user.prakruti.blank?
    user.update(prakruti: primary_dosha)
  end
end
