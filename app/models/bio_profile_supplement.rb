class BioProfileSupplement < ApplicationRecord
  belongs_to :bio_profile

  validates :name, presence: true
  validates :description, presence: true
end



