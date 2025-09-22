class PlanItem < ApplicationRecord
  acts_as_list scope: :plan_section

  belongs_to :plan_section
  has_many :plan_item_logs, dependent: :destroy
end
