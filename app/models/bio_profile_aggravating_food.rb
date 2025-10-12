class BioProfileAggravatingFood < ApplicationRecord
  belongs_to :bio_profile

  validates :name, presence: true
  validates :description, presence: true
  validates :recommendations, presence: true
end

