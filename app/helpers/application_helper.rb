module ApplicationHelper
  # def nav_link_class(path)
  #   if current_page?(path)
  #     # Active → subtle fill using primary color, but text stays black
  #     "bg-primary/20 text-black hover:bg-primary/30 rounded-md px-3 py-2 text-sm font-medium"
  #   else
  #     # Inactive → light secondary border, fills primary on hover
  #     "text-black hover:bg-primary hover:text-black rounded-md px-3 py-2 text-sm font-medium"
  #   end
  # end
  def nav_link_class(path)
    if current_page?(path)
      # active tab → filled primary color
      "bg-primary text-primary-content hover:bg-primary-focus rounded-md px-3 py-2 text-sm font-medium"
    else
      # inactive tab → neutral text, becomes primary on hover
      "text-primary hover:bg-primary hover:text-primary-content rounded-md px-3 py-2 text-sm font-medium"
    end
  end

  def quiz_progress_percentage(question, quiz_entry)
    quiz_questions = quiz_entry.quiz.questions.order(:id)
    current_index = quiz_questions.index(question)
    total_questions = quiz_questions.count

    if total_questions > 0
      ((current_index + 1).to_f / total_questions * 100).to_i
    else
      0
    end
  end
end
