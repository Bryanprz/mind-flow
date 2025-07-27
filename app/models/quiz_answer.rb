class QuizAnswer < ApplicationRecord
  belongs_to :quiz_submission
  belongs_to :question
end
