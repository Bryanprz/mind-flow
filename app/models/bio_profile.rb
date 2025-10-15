class BioProfile < ApplicationRecord
  NERVOUS_SYSTEM = 'Nervous System'.freeze
  METABOLIC = 'Metabolic'.freeze
  STRUCTURAL = 'Structural'.freeze

  has_many :bio_profile_healing_foods, dependent: :destroy
  has_many :bio_profile_aggravating_foods, dependent: :destroy
  has_many :bio_profile_supplements, dependent: :destroy
  has_many :healing_plan_templates, as: :healing_focus, dependent: :destroy

  validates :name, presence: true, uniqueness: true
  validates :color, presence: true

  # Store complex data as JSON
  store_accessor :archetype_info, :archetype, :elements, :primary_traits
  store_accessor :people_manifestation, :body_type, :emotions, :energy, :careers

  def self.nervous_system
    find_by(name: NERVOUS_SYSTEM)
  end

  def self.metabolic
    find_by(name: METABOLIC)
  end

  def self.structural
    find_by(name: STRUCTURAL)
  end

  def nervous_system?
    name == NERVOUS_SYSTEM
  end

  def metabolic?
    name == METABOLIC
  end

  def structural?
    name == STRUCTURAL
  end
end



