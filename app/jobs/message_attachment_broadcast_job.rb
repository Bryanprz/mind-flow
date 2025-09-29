class MessageAttachmentBroadcastJob < ApplicationJob
  queue_as :default

  def perform(message_id)
    Rails.logger.info "🔄 MessageAttachmentBroadcastJob: Re-broadcasting message #{message_id}"
    message = Message.includes(:user).find(message_id)
    
    Rails.logger.info "🔄 Message attachments: #{message.attachments.attached? ? 'attached' : 'not attached'}"
    
    # Re-broadcast the message to update the display with processed attachments
    message.broadcast_replace_later_to(
      "room_#{message.room.id}",
      target: "message_#{message.id}",
      partial: "messages/message",
      locals: { message: message.reload, message_user: message.user }
    )
    
    Rails.logger.info "🔄 MessageAttachmentBroadcastJob: Broadcast completed for message #{message_id}"
  end
end
