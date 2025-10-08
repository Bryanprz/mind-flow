class PlanItemLog < ApplicationRecord
  belongs_to :habit_log
  belongs_to :plan_item
end
