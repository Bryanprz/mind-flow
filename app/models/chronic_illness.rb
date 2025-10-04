class ChronicIllness < ApplicationRecord
  has_many :assessment_chronic_illnesses, dependent: :destroy
  has_many :assessment_entries, through: :assessment_chronic_illnesses
  has_many :healing_plan_templates, as: :healing_focus, dependent: :destroy
  
  validates :name, presence: true, uniqueness: true
  validates :color, presence: true
end
