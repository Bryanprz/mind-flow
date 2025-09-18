class PlanSection < ApplicationRecord
  belongs_to :healing_plan
  has_many :plan_items, dependent: :destroy
  accepts_nested_attributes_for :plan_items, allow_destroy: true

  alias_method :items, :plan_items
end
