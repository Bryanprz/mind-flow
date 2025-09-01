class Dosha < ApplicationRecord
  VATA = "Vata"
  PITTA = "Pitta"
  KAPHA = "Kapha"

  TYPES = [VATA, PITTA, KAPHA] # Update TYPES to use constants

  validates :color, presence: true

  before_save :normalize_name

  private

  def normalize_name
    self.name = self.name.titleize if self.name.present?
  end
end
