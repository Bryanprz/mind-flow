class QuizAnswer < ApplicationRecord
  belongs_to :quiz_submission
  belongs_to :quiz_option
  has_one :question, through: :quiz_option
  
  # Optional: Keep this for backward compatibility if needed
  def quiz_entry
    quiz_submission
  end
end
