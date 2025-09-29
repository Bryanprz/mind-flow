class ProcessMessageAttachmentsJob < ApplicationJob
  queue_as :default

  def perform(message_id)
    Rails.logger.info "🔄 ProcessMessageAttachmentsJob: Processing attachments for message #{message_id}"
    
    message = Message.find(message_id)
    
    # Process each attachment
    message.attachments.each do |attachment|
      if attachment.image?
        Rails.logger.info "🔄 Processing image attachment: #{attachment.filename}"
        
        # Force analysis of the blob to ensure it's ready
        begin
          blob = attachment.blob
          blob.analyze_later unless blob.analyzed?
          Rails.logger.info "🔄 Image blob analysis scheduled"
        rescue => e
          Rails.logger.error "🔄 Error analyzing image blob: #{e.message}"
        end
      end
    end
    
    # Wait a moment for processing, then re-broadcast
    sleep(1)
    
    # Re-broadcast the message with processed attachments
    message.broadcast_replace_later_to(
      "room_#{message.room.id}",
      target: "message_#{message.id}",
      partial: "messages/message",
      locals: { message: message, message_user: message.user }
    )
    
    Rails.logger.info "🔄 ProcessMessageAttachmentsJob: Completed processing for message #{message_id}"
  end
end
