class PlanItem < ApplicationRecord
  belongs_to :plan_section
  has_many :plan_item_logs, dependent: :destroy
end
