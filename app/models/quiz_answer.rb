class QuizAnswer < ApplicationRecord
  belongs_to :quiz_entry
  belongs_to :quiz_option

  delegate :question, to: :quiz_option
end
