class AssessmentQuestion < ApplicationRecord
  belongs_to :health_assessment
  has_many :assessment_options
  has_many :assessment_answers
end
