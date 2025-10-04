class HealingPlanTemplate < ApplicationRecord
  enum :duration_type, { daily: 0, three_month: 1, six_month: 2 }

  belongs_to :healing_focus, polymorphic: true
  has_rich_text :description
  has_many :plan_section_templates, dependent: :destroy
  
  validates :name, presence: true
  validates :duration_type, presence: true
  validates :healing_focus, presence: true
  
  scope :for_dosha, ->(dosha) { where(healing_focus: dosha) }
  scope :for_chronic_illness, ->(chronic_illness) { where(healing_focus: chronic_illness) }
end
