class HealingPlan < ApplicationRecord
  belongs_to :user
  has_many :plan_sections
end
