class ProcessMessageAttachmentsJob < ApplicationJob
  queue_as :default

  def perform(message_id, retry_count = 0)
    message = Message.find(message_id)
    
    # Check if any images need analysis
    needs_analysis = false
    message.attachments.each do |attachment|
      if attachment.image?
        blob = attachment.blob
        unless blob.analyzed?
          needs_analysis = true
          # Try both approaches for better reliability
          blob.analyze_later
          # Also try immediate analysis as fallback (with timeout)
          begin
            blob.analyze if retry_count > 2
          rescue => e
            Rails.logger.error "Immediate analysis failed: #{e.message}"
          end
        end
      end
    end
    
    # Always re-broadcast immediately for instant text display
    # If analysis is needed, it will update the image later via turbo
    message.broadcast_replace_to(
      "room_#{message.room.id}",
      target: "message_#{message.id}",
      partial: "messages/message",
      locals: { message: message, message_user: message.user }
    )
    
    # If analysis was needed, schedule follow-up broadcasts with exponential backoff
    if needs_analysis && retry_count < 5
      wait_time = [2, 4, 8, 16, 32][retry_count] || 32
      ProcessMessageAttachmentsJob.set(wait: wait_time.seconds).perform_later(message_id, retry_count + 1)
    end
  end
end
