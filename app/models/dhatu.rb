class Dhatu < ApplicationRecord
  has_many :chronic_illness_affected_dhatus, dependent: :destroy
  has_many :chronic_illnesses, through: :chronic_illness_affected_dhatus

  validates :name, presence: true, uniqueness: true
  validates :description, presence: true
end
