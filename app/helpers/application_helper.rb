module ApplicationHelper
    def nav_link_class(path)
    # Add text-neutral-content for home page, otherwise use default colors
    text_color = current_page?(root_path) ? "text-neutral-content" : "text-gray-600"
    
    if current_page?(path)
      # Active → primary text color
      "text-primary px-3 py-2 text-sm font-medium"
    else
      # Inactive → conditional text color, no background
      "#{text_color} px-3 py-2 text-sm font-medium"
    end
  end

  def assessment_progress_percentage(question, assessment_entry)
    assessment_questions = assessment_entry.health_assessment.assessment_questions.order(:id)
    current_index = assessment_questions.index(question)
    total_questions = assessment_questions.count

    if total_questions > 0
      ((current_index + 1).to_f / total_questions * 100).to_i
    else
      0
    end
  end

  def dosha_color_class(dosha)
    case dosha.name.to_s.downcase
    when 'vata'
      'text-blue-500'
    when 'pitta'
      'text-red-500'
    when 'kapha'
      'text-green-500'
    else
      'text-gray-500'
    end
  end

  def safe_attachment_status(attachment)
    Rails.logger.info "🔍 Checking attachment status for: #{attachment.inspect}"
    return { status: :error, message: 'Attachment not found' } unless attachment.present?
    
    begin
      # Rails 8 approach: Check if attachment exists and is processable
      if attachment.respond_to?(:image?) && attachment.image?
        Rails.logger.info "🔍 Attachment is image - checking if ready"
        
        # Check if the image is ready to display
        begin
          # Try to access the blob to see if it's ready
          blob = attachment.blob
          if blob.present? && blob.analyzed?
            Rails.logger.info "🔍 Image blob is ready and analyzed"
            { status: :image, message: 'Image ready' }
          else
            Rails.logger.info "🔍 Image blob not ready yet (not analyzed)"
            { status: :processing, message: 'Processing image...' }
          end
        rescue => e
          Rails.logger.info "🔍 Image not ready yet: #{e.message}"
          { status: :processing, message: 'Processing image...' }
        end
      else
        Rails.logger.info "🔍 Attachment is file"
        { status: :file, message: 'File ready' }
      end
    rescue => e
      Rails.logger.error "🔍 Attachment error: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      { status: :error, message: 'Loading attachment...' }
    end
  end
end
