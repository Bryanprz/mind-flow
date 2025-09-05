class ChronicIllness < ApplicationRecord
  has_many :assessment_chronic_illnesses, dependent: :destroy
  has_many :assessment_entries, through: :assessment_chronic_illnesses
end
