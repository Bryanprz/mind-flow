class PlanItem < ApplicationRecord
  acts_as_list scope: :plan_section,
               column: :position,
               top_of_list: 1,
               sequential_updates: true

  belongs_to :plan_section
  has_many :plan_item_logs, dependent: :destroy
end
