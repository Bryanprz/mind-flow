class Dosha < ApplicationRecord
  TYPES = ["Vata", "Pitta", "Kapha"]

  validates :color, presence: true
end
