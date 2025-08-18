class HealthAssessment < ApplicationRecord
  attribute :category, :integer
  enum :category, { prakruti: 0, vikruti: 1 }, prefix: true

  has_many :assessment_questions, dependent: :destroy
  has_many :assessment_entries, dependent: :destroy
  has_many :assessment_submissions, dependent: :destroy
  
  # Scopes
  scope :prakruti_assessments, -> { where(category: :prakruti) }
  scope :vikruti_assessments, -> { where(category: :vikruti) }
  
  def self.prakruti
    find_by(category: :prakruti)
  end
  
  def self.vikruti
    find_by(category: :vikruti)
  end
end
