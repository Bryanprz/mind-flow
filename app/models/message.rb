class Message < ApplicationRecord
  belongs_to :room
  belongs_to :user
  
  has_rich_text :content
  has_many_attached :attachments
  
  validates :content, presence: true
  
  after_create_commit :broadcast_message, :update_memberships_last_read
  
  private
  
  def broadcast_message
    # Use broadcast_append_later_to for async, non-blocking broadcasting
    broadcast_append_later_to(
      "room_#{room.id}",
      target: "messages",
      partial: "messages/message",
      locals: { message: self }
    )
  end
  
  def update_memberships_last_read
    room.memberships
        .where.not(user: user)
        .update_all(last_read_at: created_at)
  end
end
