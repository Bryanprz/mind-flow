class User < ApplicationRecord
  has_one_attached :avatar, service: :google_avatars
  has_one_attached :cover_image, service: :google_avatars
  has_secure_password
  has_many :healing_plans, dependent: :destroy # Ayurvedic protocol
  has_many :prakruti_plans, class_name: 'PrakrutiPlan'
  has_many :vikruti_plans, class_name: 'VikrutiPlan'

  has_many :sessions, dependent: :destroy
  has_many :assessment_entries, dependent: :destroy
  has_many :social_posts, dependent: :destroy
  has_many :likes, dependent: :destroy
  has_many :social_post_bookmarks, dependent: :destroy
  has_many :messages, dependent: :destroy
  has_many :memberships, dependent: :destroy
  has_many :rooms, through: :memberships
  has_one :prakruti_entry, class_name: 'PrakrutiEntry'
  has_one :vikruti_entry, class_name: 'VikrutiEntry'

  belongs_to :prakruti, class_name: 'Dosha', optional: true
  belongs_to :vikruti, class_name: 'Dosha', optional: true

  normalizes :email_address, with: ->(e) { e.strip.downcase }
  normalizes :handle, with: ->(h) { h&.strip&.downcase }
  validates :email_address, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, presence: true, length: { minimum: 4 }, on: :create unless Rails.env.development?
  validates :name, presence: true
  validates :handle, uniqueness: true, allow_blank: true, format: { with: /\A[a-z0-9_]+\z/, message: "can only contain lowercase letters, numbers, and underscores" }

  def first_name
    name.to_s.split(' ').first
  end

  def active_healing_plan
    healing_plans.find_by(is_active: true)
  end

  def daily_check_in_streak
    "30 days"
  end

  def completed_healing_plan_logs_count
    25
  end

  def total_healing_plan_logs_count
    30
  end

  def healing_plan_progress_percentage
    83
  end

  def has_checked_in_today?
    return false unless active_healing_plan
    
    # Check if user has completed a healing plan log for today
    active_healing_plan.logs
      .where(date: Date.current)
      .where.not(completed_at: nil)
      .exists?
  end

  # Gamification methods
  def social_posts_count
    social_posts.count
  end

  def assessment_count
    assessment_entries.count
  end

  def healing_plans_count
    healing_plans.count
  end

  def current_streak
    active_healing_plan&.current_streak || 0
  end

  def longest_streak
    return 0 if healing_plans.none?
    
    healing_plans.map(&:current_streak).max || 0
  end

  def wellness_score
    assessment_score = assessment_entries.count * 10
    streak_bonus = current_streak * 2
    community_score = social_posts.count * 5
    plan_score = healing_plans.count * 15
    (assessment_score + streak_bonus + community_score + plan_score).clamp(0, 1000)
  end

  def healing_mastery_level
    case wellness_score
    when 0..50 then "Beginner"
    when 51..150 then "Apprentice"
    when 151..300 then "Practitioner"
    when 301..500 then "Healer"
    else "Master"
    end
  end

  def has_social_posts?
    social_posts_count > 0
  end

  def has_completed_assessments?
    assessment_count > 0
  end

  def has_healing_plans?
    healing_plans_count > 0
  end

  def has_streak?
    current_streak > 0
  end

  def private_rooms_with(user)
    # Find private rooms where both current user and other user are members
    # Get all private rooms for current user
    my_private_rooms = rooms.where(room_type: 'private')
    
    # Get all private rooms for the other user
    their_private_rooms = user.rooms.where(room_type: 'private')
    
    # Find intersection (rooms that both users are members of)
    my_private_rooms.where(id: their_private_rooms.select(:id))
  end
end
