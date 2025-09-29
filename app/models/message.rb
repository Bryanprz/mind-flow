class Message < ApplicationRecord
  belongs_to :room
  belongs_to :user
  
  has_rich_text :content
  has_many_attached :attachments
  
  validates :content, presence: true, unless: -> { attachments.attached? }
  
  after_create_commit :broadcast_message, :update_memberships_last_read
  after_update_commit :broadcast_message_update, if: :saved_change_to_attachments?
  
  private
  
  def broadcast_message
    # Use broadcast_append_later_to for async, non-blocking broadcasting
    # Pass the message user so each client can determine their own positioning
    # Ensure attachments are loaded before broadcasting
    broadcast_append_later_to(
      "room_#{room.id}",
      target: "messages",
      partial: "messages/message",
      locals: { message: self.reload, message_user: user }
    )
  end
  
  def broadcast_message_update
    # Re-broadcast the message when attachments are updated/processed
    broadcast_replace_later_to(
      "room_#{room.id}",
      target: "message_#{id}",
      partial: "messages/message",
      locals: { message: self.reload, message_user: user }
    )
  end
  
  def update_memberships_last_read
    room.memberships
        .where.not(user: user)
        .update_all(last_read_at: created_at)
  end
end
