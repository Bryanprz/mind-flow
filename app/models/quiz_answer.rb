class QuizAnswer < ApplicationRecord
  belongs_to :quiz_entry
  belongs_to :question
end
