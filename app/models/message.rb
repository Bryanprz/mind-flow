class Message < ApplicationRecord
  belongs_to :room
  belongs_to :user
  
  has_rich_text :content
  has_many_attached :attachments, service: :google_message_attachments
  
  validates :content, presence: true, unless: -> { attachments.attached? }
  
  # Database optimization scopes (always first)
  scope :recent, -> { order(created_at: :desc) }
  scope :chronological, -> { order(:created_at) }
  scope :with_author, -> { includes(:user) }
  scope :with_attachments, -> { includes(attachments_attachments: :blob) }
  scope :with_author_and_attachments, -> { includes(:user, attachments_attachments: :blob) }
  scope :for_room, ->(room) { where(room: room) }
  scope :since, ->(time) { where('created_at > ?', time) }
  
  # Application cache for expensive operations
  def formatted_content
    Rails.cache.fetch("message_#{id}_formatted_content", expires_in: 1.hour) do
      content.present? ? content.to_s : "No content"
    end
  end
  
  def plain_text_content
    Rails.cache.fetch("message_#{id}_plain_text", expires_in: 1.hour) do
      content.present? ? content.to_plain_text : ""
    end
  end
  
  def processed_attachments
    Rails.cache.fetch("message_#{id}_processed_attachments", expires_in: 1.hour) do
      attachments.map do |attachment|
        {
          id: attachment.id,
          filename: attachment.filename.to_s,
          url: rails_blob_url(attachment, disposition: "inline"),
          thumbnail_url: attachment.image? ? rails_blob_url(attachment.variant(resize_to_limit: [300, 300]).processed) : nil,
          content_type: attachment.content_type,
          file_size: attachment.byte_size
        }
      end
    end
  end
  
  def user_avatar_url
    Rails.cache.fetch("user_#{user_id}_avatar_url", expires_in: 1.hour) do
      user.avatar.attached? ? rails_blob_url(user.avatar, disposition: "inline") : nil
    end
  end
  
  # Cache invalidation methods
  def invalidate_content_cache
    Rails.cache.delete("message_#{id}_formatted_content")
    Rails.cache.delete("message_#{id}_plain_text")
  end
  
  def invalidate_attachments_cache
    Rails.cache.delete("message_#{id}_processed_attachments")
  end
  
  def invalidate_user_cache
    Rails.cache.delete("user_#{user_id}_avatar_url")
  end
  
  def invalidate_room_caches
    Rails.cache.delete("room_#{room_id}_message_count")
    Rails.cache.delete("room_#{room_id}_last_message")
    # Invalidate unread counts for all room members
    room.users.each do |user|
      Rails.cache.delete("room_#{room_id}_unread_#{user.id}")
    end
  end
  
  # Class methods for room-level caching
  def self.room_message_count(room_id)
    Rails.cache.fetch("room_#{room_id}_message_count", expires_in: 5.minutes) do
      where(room_id: room_id).count
    end
  end
  
  def self.room_last_message(room_id)
    Rails.cache.fetch("room_#{room_id}_last_message", expires_in: 1.minute) do
      where(room_id: room_id).recent.first
    end
  end
  
  def self.room_unread_count(room_id, user_id, last_read_at)
    Rails.cache.fetch("room_#{room_id}_unread_#{user_id}", expires_in: 1.minute) do
      where(room_id: room_id).since(last_read_at).count
    end
  end
  
  after_create_commit :broadcast_message, :update_memberships_last_read, :invalidate_room_caches
  after_update_commit :invalidate_content_cache
  after_update_commit :invalidate_attachments_cache, if: :saved_change_to_attachments?
  
  private
  
  def broadcast_message
    # Use broadcast_append_later_to for async, non-blocking broadcasting
    # Pass the message user so each client can determine their own positioning
    # Ensure attachments and avatar are loaded before broadcasting
    message_with_author = Message.with_author_and_attachments.find(id)
    
    # Broadcast the message
    broadcast_append_later_to(
      "room_#{room.id}",
      target: "messages",
      partial: "messages/message",
      locals: { message: message_with_author, message_user: message_with_author.user }
    )
    
    # If message has attachments, process them in background and re-broadcast
    # In Rails 8, use the more reliable way to check for attachments
    if message_with_author.attachments.any?
      Rails.logger.info "🔄 Scheduling ProcessMessageAttachmentsJob for message #{id}"
      ProcessMessageAttachmentsJob.set(wait: 2.seconds).perform_later(id)
    else
      Rails.logger.info "🔄 No attachments for message #{id}, skipping processing job"
    end
  end
  
  def update_memberships_last_read
    room.memberships
        .where.not(user: user)
        .update_all(last_read_at: created_at)
  end
end
