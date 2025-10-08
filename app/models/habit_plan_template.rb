class HabitPlanTemplate < ApplicationRecord
  enum :duration_type, { daily: 0, three_month: 1, six_month: 2 }

  has_rich_text :description
  has_many :plan_section_templates, dependent: :destroy
  
  accepts_nested_attributes_for :plan_section_templates, allow_destroy: true
  
  validates :name, presence: true
  validates :duration_type, presence: true
end
