class Question < ApplicationRecord
  belongs_to :quiz
  has_many :quiz_options
  has_many :quiz_answers

  ALLOWED_DOSHAS = ['vata', 'pitta', 'kapha']

  validate :disturbed_doshas_are_allowed

  private

  def disturbed_doshas_are_allowed
    if disturbed_doshas.present? && (disturbed_doshas - ALLOWED_DOSHAS).any?
      errors.add(:disturbed_doshas, "contains unallowed values")
    end
  end
end