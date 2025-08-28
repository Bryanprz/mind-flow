class HealingPlanFood < ApplicationRecord
  belongs_to :healing_plan
  belongs_to :food
end
