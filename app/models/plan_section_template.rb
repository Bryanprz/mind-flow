class PlanSectionTemplate < ApplicationRecord
  belongs_to :healing_plan_template
  has_many :plan_item_templates, dependent: :destroy
  
  accepts_nested_attributes_for :plan_item_templates, allow_destroy: true
end
