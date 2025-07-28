class Quiz < ApplicationRecord
  enum :category, { prakruti: 0, vikruti: 1 }, prefix: true

  has_many :questions
  has_many :quiz_entries
end
