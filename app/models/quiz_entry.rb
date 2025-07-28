class QuizEntry < ApplicationRecord
  belongs_to :quiz
  belongs_to :user, optional: true
  has_many :quiz_answers
end
