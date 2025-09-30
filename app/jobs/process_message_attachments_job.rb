class ProcessMessageAttachmentsJob < ApplicationJob
  queue_as :default

  def perform(message_id)
    message = Message.find(message_id)
    
    # Process each attachment with optimized approach
    message.attachments.each do |attachment|
      if attachment.image?
        # Start analysis immediately without waiting
        blob = attachment.blob
        blob.analyze_later unless blob.analyzed?
      end
    end
    
    # Re-broadcast the message with processed attachments immediately
    # Use broadcast_replace_to for instant updates
    message.broadcast_replace_to(
      "room_#{message.room.id}",
      target: "message_#{message.id}",
      partial: "messages/message",
      locals: { message: message, message_user: message.user }
    )
  end
end
