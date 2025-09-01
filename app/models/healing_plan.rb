class HealingPlan < ApplicationRecord
  belongs_to :user
  belongs_to :healing_plan_template
  has_many :plan_sections
end
