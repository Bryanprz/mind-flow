class User < ApplicationRecord
  has_secure_password
  has_one :healing_plan # Ayurvedic protocol

  has_many :sessions, dependent: :destroy
  has_many :assessment_entries, dependent: :destroy
  belongs_to :prakruti, class_name: 'Dosha', optional: true
  belongs_to :vikruti, class_name: 'Dosha', optional: true
  normalizes :email_address, with: ->(e) { e.strip.downcase }

  validates :email_address, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, presence: true, length: { minimum: 4 }, on: :create unless Rails.env.development?
  validates :name, presence: true

end
