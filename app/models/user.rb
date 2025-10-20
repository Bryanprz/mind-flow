class User < ApplicationRecord
  # Encrypt sensitive PII fields
  encrypts :email_address, deterministic: true
  encrypts :date_of_birth
  encrypts :time_of_birth
  encrypts :authentication_token, deterministic: true
  
  has_one_attached :avatar, service: :local
  has_one_attached :cover_image, service: :local
  has_secure_password
  has_many :sessions, dependent: :destroy
  has_many :goals, dependent: :destroy

  normalizes :email_address, with: ->(e) { e.strip.downcase }
  normalizes :handle, with: ->(h) { h&.strip&.downcase }
  validates :email_address, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, presence: true, length: { minimum: 4 }, on: :create unless Rails.env.development?
  validates :name, presence: true
  validates :handle, uniqueness: true, allow_blank: true, format: { with: /\A[a-z0-9_]+\z/, message: "can only contain lowercase letters, numbers, and underscores" }

  def first_name
    name.to_s.split(' ').first
  end


  def daily_check_in_streak
    "30 days"
  end

  def completed_habit_logs_count
    25
  end

  def total_habit_logs_count
    30
  end

  def has_checked_in_today?
    false
  end

  # Gamification methods
  def current_streak
    0
  end

  def longest_streak
    0
  end

  def wellness_score
    0
  end

  def wellness_mastery_level
    "Beginner"
  end

  def has_streak?
    false
  end


  def slug
    name.downcase.gsub(/\s+/, '-').gsub(/[^a-z0-9\-]/, '')
  end

  def to_param
    slug
  end
end
