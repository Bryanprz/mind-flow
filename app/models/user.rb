class User < ApplicationRecord
  # Encrypt sensitive PII fields
  encrypts :email_address, deterministic: true
  encrypts :date_of_birth
  encrypts :time_of_birth
  encrypts :authentication_token, deterministic: true
  
  def self.avatar_service
    Rails.env.development? ? :local : :google_avatars
  end
  
  has_one_attached :avatar, service: avatar_service
  has_one_attached :cover_image, service: avatar_service
  has_secure_password
  has_many :habit_plans, dependent: :destroy

  has_many :sessions, dependent: :destroy
  has_many :assessment_entries, dependent: :destroy

  normalizes :email_address, with: ->(e) { e.strip.downcase }
  normalizes :handle, with: ->(h) { h&.strip&.downcase }
  validates :email_address, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, presence: true, length: { minimum: 4 }, on: :create unless Rails.env.development?
  validates :name, presence: true
  validates :handle, uniqueness: true, allow_blank: true, format: { with: /\A[a-z0-9_]+\z/, message: "can only contain lowercase letters, numbers, and underscores" }

  def first_name
    name.to_s.split(' ').first
  end

  def active_habit_plan
    habit_plans.find_by(is_active: true)
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

  def habit_plan_progress_percentage
    83
  end

  def has_checked_in_today?
    return false unless active_habit_plan
    
    # Check if user has completed a habit log for today
    active_habit_plan.logs
      .where(date: Date.current)
      .where.not(completed_at: nil)
      .exists?
  end

  # Gamification methods
  def assessment_count
    assessment_entries.count
  end

  def habit_plans_count
    habit_plans.count
  end

  def current_streak
    active_habit_plan&.current_streak || 0
  end

  def longest_streak
    return 0 if habit_plans.none?
    
    habit_plans.map(&:current_streak).max || 0
  end

  def wellness_score
    assessment_score = assessment_entries.count * 10
    streak_bonus = current_streak * 2
    plan_score = habit_plans.count * 15
    (assessment_score + streak_bonus + plan_score).clamp(0, 1000)
  end

  def wellness_mastery_level
    case wellness_score
    when 0..50 then "Beginner"
    when 51..150 then "Apprentice"
    when 151..300 then "Practitioner"
    when 301..500 then "Wellness Enthusiast"
    else "Wellness Master"
    end
  end

  def has_completed_assessments?
    assessment_count > 0
  end

  def has_habit_plans?
    habit_plans_count > 0
  end

  def has_streak?
    current_streak > 0
  end


  def slug
    name.downcase.gsub(/\s+/, '-').gsub(/[^a-z0-9\-]/, '')
  end

  def to_param
    slug
  end
end
