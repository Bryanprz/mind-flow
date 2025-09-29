class Room < ApplicationRecord
  has_many :messages, dependent: :destroy
  has_many :memberships, dependent: :destroy
  has_many :users, through: :memberships
  
  validates :name, presence: true
  validates :room_type, presence: true, inclusion: { in: %w[public private] }
  
  scope :public_rooms, -> { where(room_type: 'public') }
  scope :private_rooms, -> { where(room_type: 'private') }
  
  def last_message
    # Use the included messages if available, otherwise query the database
    if messages.loaded?
      messages.max_by(&:created_at)
    else
      messages.order(created_at: :desc).first
    end
  end
  
  def unread_count_for(user)
    membership = memberships.find_by(user: user)
    return 0 unless membership
    messages.where('created_at > ?', membership.last_read_at || Time.at(0)).count
  end
  
  def private_between?(user1, user2)
    return false unless room_type == 'private'
    users.include?(user1) && users.include?(user2) && users.count == 2
  end
  
  def other_user(current_user)
    return nil unless room_type == 'private' && users.count == 2
    users.find { |user| user != current_user }
  end
end
