class HealingPlanTemplate < ApplicationRecord
  belongs_to :dosha
  has_many :plan_section_templates, dependent: :destroy
end
