class PlanSection < ApplicationRecord
  acts_as_list scope: :habit_plan, 
               column: :position, 
               top_of_list: 1, 
               sequential_updates: true

  belongs_to :habit_plan
  has_many :plan_items, -> { order(position: :asc) }, dependent: :destroy
  accepts_nested_attributes_for :plan_items, allow_destroy: true

  alias_method :items, :plan_items
end
