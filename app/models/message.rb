class Message < ApplicationRecord
  belongs_to :room
  belongs_to :user
  
  has_rich_text :content
  has_many_attached :attachments
  
  validates :content, presence: true, unless: -> { attachments.attached? }
  
  after_create_commit :broadcast_message, :update_memberships_last_read
  
  private
  
  def broadcast_message
    # Use broadcast_append_later_to for async, non-blocking broadcasting
    # Pass the message user so each client can determine their own positioning
    # Ensure attachments and avatar are loaded before broadcasting
    message_with_avatar = Message.includes(user: [avatar_attachment: :blob]).find(id)
    
    # Broadcast the message
    broadcast_append_later_to(
      "room_#{room.id}",
      target: "messages",
      partial: "messages/message",
      locals: { message: message_with_avatar, message_user: message_with_avatar.user }
    )
    
    # If message has attachments, also schedule a delayed broadcast to ensure images show
    if attachments.attached?
      Rails.logger.info "🔄 Scheduling MessageAttachmentBroadcastJob for message #{id}"
      MessageAttachmentBroadcastJob.set(wait: 1.second).perform_later(id)
    else
      Rails.logger.info "🔄 No attachments for message #{id}, skipping broadcast job"
    end
  end
  
  def update_memberships_last_read
    room.memberships
        .where.not(user: user)
        .update_all(last_read_at: created_at)
  end
end
