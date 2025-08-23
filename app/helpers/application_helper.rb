module ApplicationHelper
    def nav_link_class(path)
    if current_page?(path)
      # Active → soft, opaque accent background, black text
      "bg-secondary/70 text-black rounded-md px-3 py-2 text-sm font-medium"
    else
      # Inactive → black text, no background
      "text-black px-3 py-2 text-sm font-medium"
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

  def dosha_classes(dosha_name)
    case dosha_name.to_s.downcase
    when 'vata'
      'text-blue-500'
    when 'pitta'
      'text-red-500'
    when 'kapha'
      'text-primary'
    else
      'text-gray-500'
    end
  end
end
