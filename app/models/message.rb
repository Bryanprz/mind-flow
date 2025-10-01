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
  
  def invalidate_room_caches_later
    # Run cache invalidation asynchronously to avoid blocking message creation
    InvalidateRoomCachesJob.perform_later(room_id)
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
  
  after_create_commit :broadcast_message, :update_memberships_last_read
  after_create_commit :invalidate_room_caches_later
  after_update_commit :invalidate_content_cache
  after_update_commit :invalidate_attachments_cache, if: :saved_change_to_attachments?
  
  private
  
  def broadcast_message
    Rails.logger.info "📡 Broadcasting message #{id} to room #{room.id}"
    
    # DEBUG: Log all message attributes
    Rails.logger.info "🔍 DEBUG - Message attributes:"
    Rails.logger.info "  - ID: #{id}"
    Rails.logger.info "  - Room ID: #{room.id}"
    Rails.logger.info "  - User ID: #{user.id}"
    Rails.logger.info "  - User name: #{user.name}"
    Rails.logger.info "  - Created at: #{created_at}"
    Rails.logger.info "  - Content present: #{content.present?}"
    Rails.logger.info "  - Attachments count: #{attachments.count}"
    
    # Extract content safely to avoid serialization issues
    content_text = begin
      if content.present?
        content.to_plain_text
      else
        ""
      end
    rescue => e
      Rails.logger.error "Error extracting content for message #{id}: #{e.message}"
      ""
    end
    
    Rails.logger.info "🔍 DEBUG - Extracted content: '#{content_text}'"
    
    # Prepare broadcast data
    broadcast_data = {
      type: "new_message",
      message_id: id,
      user_name: user.name,
      user_id: user.id,
      content: content_text,
      created_at: created_at.iso8601,
      has_attachments: attachments.any?
    }
    
    Rails.logger.info "🔍 DEBUG - Broadcast data: #{broadcast_data.inspect}"
    
    # DEBUG: ActionCable Configuration
    Rails.logger.info "🔍 DEBUG - ActionCable server class: #{ActionCable.server.class}"
    Rails.logger.info "🔍 DEBUG - ActionCable pubsub adapter: #{ActionCable.server.pubsub.class}"
    Rails.logger.info "🔍 DEBUG - ActionCable pubsub adapter name: #{ActionCable.server.pubsub.class.name}"
    
    # DEBUG: Database Connections
    Rails.logger.info "🔍 DEBUG - Primary database connection: #{ActiveRecord::Base.connection.class}"
    Rails.logger.info "🔍 DEBUG - Primary database config: #{ActiveRecord::Base.connection_db_config.inspect}"
    
    # DEBUG: Cable Database Connection
    begin
      cable_connection = ActiveRecord::Base.connected_to(database: :cable) do
        ActiveRecord::Base.connection
      end
      Rails.logger.info "🔍 DEBUG - Cable database connection: #{cable_connection.class}"
      Rails.logger.info "🔍 DEBUG - Cable database config: #{cable_connection.db_config.inspect}"
    rescue => e
      Rails.logger.error "❌ DEBUG - Failed to get cable database connection: #{e.message}"
    end
    
    # DEBUG: SolidCable Model
    begin
      solid_cable_model = SolidCable::Message
      Rails.logger.info "🔍 DEBUG - SolidCable::Message class: #{solid_cable_model.class}"
      Rails.logger.info "🔍 DEBUG - SolidCable::Message table name: #{solid_cable_model.table_name}"
      Rails.logger.info "🔍 DEBUG - SolidCable::Message connection: #{solid_cable_model.connection.class}"
    rescue => e
      Rails.logger.error "❌ DEBUG - Failed to access SolidCable::Message: #{e.message}"
    end
    
    # DEBUG: Index Information
    begin
      ActiveRecord::Base.connected_to(database: :cable) do
        indexes = ActiveRecord::Base.connection.indexes('solid_cable_broadcasts')
        Rails.logger.info "🔍 DEBUG - solid_cable_broadcasts indexes: #{indexes.map(&:name)}"
        indexes.each do |index|
          Rails.logger.info "🔍 DEBUG - Index '#{index.name}': columns=#{index.columns}, unique=#{index.unique}"
        end
      end
    rescue => e
      Rails.logger.error "❌ DEBUG - Failed to get index information: #{e.message}"
    end
    
    # Broadcast the message
    begin
      Rails.logger.info "🔍 DEBUG - Attempting full broadcast..."
      ActionCable.server.broadcast("room_#{room.id}", broadcast_data)
      Rails.logger.info "✅ Full broadcast successful for message #{id}"
    rescue => e
      Rails.logger.error "❌ Full broadcast failed for message #{id}: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      
      # Try with minimal data
      begin
        Rails.logger.info "🔍 DEBUG - Trying minimal broadcast..."
        minimal_data = {
          type: "new_message",
          message_id: id,
          content: content_text
        }
        ActionCable.server.broadcast("room_#{room.id}", minimal_data)
        Rails.logger.info "✅ Minimal broadcast successful"
      rescue => e2
        Rails.logger.error "❌ Even minimal broadcast failed: #{e2.message}"
      end
    end
    
    Rails.logger.info "📡 Broadcast process completed for message #{id}"
    
    # If message has attachments, process them in background
    if attachments.any?
      Rails.logger.info "📡 Message #{id} has attachments, scheduling background processing"
      ProcessMessageAttachmentsJob.perform_later(id)
    end
  end
  
  def update_memberships_last_read
    room.memberships
        .where.not(user: user)
        .update_all(last_read_at: created_at)
  end
end