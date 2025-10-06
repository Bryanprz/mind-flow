class ChronicIllness < ApplicationRecord
  has_many :assessment_chronic_illnesses, dependent: :destroy
  has_many :assessment_entries, through: :assessment_chronic_illnesses
  has_many :healing_plan_templates, as: :healing_focus, dependent: :destroy
  
  # Food associations
  has_many :chronic_illness_healing_foods, dependent: :destroy
  has_many :healing_foods, through: :chronic_illness_healing_foods, source: :food
  has_many :chronic_illness_aggravating_foods, dependent: :destroy
  has_many :aggravating_foods, through: :chronic_illness_aggravating_foods, source: :food
  
  # Channel system associations
  has_many :chronic_illness_channel_systems, dependent: :destroy
  has_many :channel_systems, through: :chronic_illness_channel_systems
  
  # Dhatu associations
  has_many :chronic_illness_affected_dhatus, dependent: :destroy
  has_many :affected_dhatus, through: :chronic_illness_affected_dhatus, source: :dhatu
  
  # Rich text fields for detailed descriptions
  has_rich_text :allo_description
  has_rich_text :ayu_description
  has_rich_text :disease_evolution
  has_rich_text :effects
  has_rich_text :causes
  has_rich_text :manifestation
  
  validates :name, presence: true, uniqueness: true
  validates :color, presence: true
end
