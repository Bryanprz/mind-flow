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

  def quiz_progress_percentage(question, quiz_submission)
    quiz_questions = quiz_submission.quiz.questions.order(:id)
    current_index = quiz_questions.index(question)
    total_questions = quiz_questions.count

    if total_questions > 0
      ((current_index + 1).to_f / total_questions * 100).to_i
    else
      0
    end
  end
end
