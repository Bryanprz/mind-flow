class PlanSection < ApplicationRecord
  acts_as_list scope: :healing_plan

  belongs_to :healing_plan
  has_many :plan_items, -> { order(position: :asc) }, dependent: :destroy
  accepts_nested_attributes_for :plan_items, allow_destroy: true

  alias_method :items, :plan_items
end
