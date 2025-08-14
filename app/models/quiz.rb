class Quiz < ApplicationRecord
  attribute :category, :integer
  enum :category, { prakruti: 0, vikruti: 1 }, prefix: true

  has_many :questions, dependent: :destroy
  has_many :quiz_entries, dependent: :destroy
  has_many :quiz_submissions, dependent: :destroy
  
  # Scopes
  scope :prakruti_quizzes, -> { where(category: :prakruti) }
  scope :vikruti_quizzes, -> { where(category: :vikruti) }
  
  def self.prakruti
    find_by(category: :prakruti)
  end
  
  def self.vikruti
    find_by(category: :vikruti)
  end
end
