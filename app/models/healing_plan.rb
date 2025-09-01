class HealingPlan < ApplicationRecord
  belongs_to :user
  belongs_to :healing_plan_template, optional: true # Made optional because existing records might not have a template
  has_many :plan_sections
end
