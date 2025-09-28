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
end
