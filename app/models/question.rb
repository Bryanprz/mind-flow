class Question < ApplicationRecord
  belongs_to :quiz
  has_many :quiz_options
  has_many :quiz_answers

  
end