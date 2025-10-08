class AssessmentEntry < ApplicationRecord
  # Disable Single Table Inheritance since we removed PrakrutiEntry/VikrutiEntry
  self.inheritance_column = nil
  
  # Encrypt sensitive health data
  encrypts :results
  encrypts :completed_at, deterministic: true
  
  belongs_to :user, optional: true
  belongs_to :health_assessment

  # Original relations with aliases for convenience
  has_many :answers, class_name: 'AssessmentAnswer', foreign_key: 'assessment_entry_id', dependent: :destroy
  has_many :options, through: :answers, source: :assessment_option
  has_many :questions, through: :health_assessment, source: :assessment_questions
  
  # Keep original relations for backward compatibility
  has_many :assessment_answers, dependent: :destroy
  has_many :assessment_options, through: :assessment_answers
  has_many :assessment_questions, through: :assessment_options

  # Chronic illness associations removed after Ayurveda models were dropped
  # has_many :assessment_chronic_illnesses, dependent: :destroy
  # has_many :chronic_illnesses, through: :assessment_chronic_illnesses

  def results
    # Dosha-related functionality has been removed after Ayurveda models were dropped
    # This method is kept for backwards compatibility but returns empty hash
    {}
  end

  alias_method :dosha_scores, :results

  def primary_dosha
    # Dosha model was removed, returning nil
    nil
  end

  def get_elements
    # Dosha-related functionality has been removed
    nil
  end

  # Removed after_save callback for dosha results since prakruti/vikruti no longer exist
end
