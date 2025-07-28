class QuizOption < ApplicationRecord
  belongs_to :question

  # This method tells us what this option contributes to the dosha scores.
  def dosha_contribution
    { dosha: self.dosha }
  end
end
