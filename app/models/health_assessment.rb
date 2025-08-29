class HealthAssessment < ApplicationRecord
  enum :assessment_type, { prakruti: 0, vikruti: 1 }
  has_many :assessment_questions, dependent: :destroy
  has_many :assessment_entries, dependent: :destroy
end
