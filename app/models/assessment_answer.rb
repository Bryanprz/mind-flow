class AssessmentAnswer < ApplicationRecord
  belongs_to :assessment_entry
  belongs_to :assessment_option
  has_one :assessment_question, through: :assessment_option
end
