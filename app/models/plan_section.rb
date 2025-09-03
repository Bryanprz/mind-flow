class PlanSection < ApplicationRecord
  belongs_to :healing_plan
  has_many :plan_items
  alias_method :items, :plan_items
end
