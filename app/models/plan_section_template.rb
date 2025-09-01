class PlanSectionTemplate < ApplicationRecord
  belongs_to :healing_plan_template
  has_many :plan_item_templates, dependent: :destroy
end
