class AssessmentChronicIllness < ApplicationRecord
  belongs_to :assessment_entry
  belongs_to :chronic_illness
end
