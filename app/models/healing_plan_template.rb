class HealingPlanTemplate < ApplicationRecord
  enum :duration_type, { daily: 0, three_month: 1, six_month: 2 }

  belongs_to :dosha
  has_rich_text :description
  has_many :plan_section_templates, dependent: :destroy
end
