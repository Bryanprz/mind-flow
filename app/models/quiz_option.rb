class QuizOption < ApplicationRecord
  belongs_to :question

  # This enum maps the dosha names to integers in the 'dosha' column.
  # vata: 1, pitta: 2, kapha: 3
  enum :dosha, { vata: 1, pitta: 2, kapha: 3 }
end
