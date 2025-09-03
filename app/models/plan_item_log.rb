class PlanItemLog < ApplicationRecord
  belongs_to :healing_plan_log
  belongs_to :plan_item
end
