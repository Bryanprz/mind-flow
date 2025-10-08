class HealthAssessment < ApplicationRecord
  enum :assessment_type, { wellness_profile: 0, stress_assessment: 1, sleep_quality: 2 }
  has_many :assessment_questions, dependent: :destroy
  has_many :assessment_entries, dependent: :destroy
end
