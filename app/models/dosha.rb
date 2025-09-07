class Dosha < ApplicationRecord
  VATA = "Vata"
  PITTA = "Pitta"
  KAPHA = "Kapha"

  TYPES = [VATA, PITTA, KAPHA] # Update TYPES to use constants

  validates :color, presence: true

  has_many :healing_foods, class_name: "DoshaHealingFood"
  has_many :aggravating_foods, class_name: "DoshaAggravatingFood"

  has_many :healing_herbs, class_name: "DoshaHealingHerb"

  before_save :normalize_name

  private

  def normalize_name
    self.name = self.name.titleize if self.name.present?
  end
end
