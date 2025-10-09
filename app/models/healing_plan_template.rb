class HealingPlanTemplate < ApplicationRecord
  belongs_to :healing_focus, polymorphic: true
  has_many :plan_section_templates, dependent: :destroy
  has_many :plan_item_templates, through: :plan_section_templates

  validates :name, presence: true
  validates :duration_type, presence: true
  validates :healing_focus, presence: true

  enum :duration_type, {
    daily: 'daily',
    three_month: 'three_month',
    six_month: 'six_month'
  }
end
