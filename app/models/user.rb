class User < ApplicationRecord
  has_secure_password
  has_many :healing_plans, dependent: :destroy # Ayurvedic protocol
  has_many :prakruti_plans, class_name: 'PrakrutiPlan'
  has_many :vikruti_plans, class_name: 'VikrutiPlan'

  has_many :sessions, dependent: :destroy
  has_many :assessment_entries, dependent: :destroy
  has_one :prakruti_entry, class_name: 'PrakrutiEntry'
  has_one :vikruti_entry, class_name: 'VikrutiEntry'

  belongs_to :prakruti, class_name: 'Dosha', optional: true
  belongs_to :vikruti, class_name: 'Dosha', optional: true

  normalizes :email_address, with: ->(e) { e.strip.downcase }
  validates :email_address, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, presence: true, length: { minimum: 4 }, on: :create unless Rails.env.development?
  validates :name, presence: true

  def first_name
    name.to_s.split(' ').first
  end

  def active_healing_plan
    healing_plans.find_by(is_active: true)
  end
end
