class AssessmentEntry < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :health_assessment

  # Original relations with aliases for convenience
  has_many :answers, class_name: 'AssessmentAnswer', foreign_key: 'assessment_entry_id', dependent: :destroy
  has_many :options, through: :answers, source: :assessment_option
  has_many :questions, through: :health_assessment, source: :assessment_questions
  
  # Keep original relations for backward compatibility
  has_many :assessment_answers, dependent: :destroy
  has_many :assessment_options, through: :assessment_answers
  has_many :assessment_questions, through: :assessment_options

  def results
    result_data = Hash.new(0)
    options.each {|option| result_data[option.dosha] += 1 }
    result_data
  end

  def primary_dosha
    dosha_highest_value = results.max_by { |_, value| value }.first
    Dosha.find_by(name: dosha_highest_value)
  end
  
  def secondary_dosha
    second_highest_dosha = results.sort_by { |_, value| value }[-2]&.first
    Dosha.find_by(name: second_highest_dosha)
  end

  def get_elements
    case primary_dosha.name
    when 'vata'
      return 'Space & Air'
    when 'pitta'
      return 'Fire & Water'
    when 'kapha'
      return 'Earth & Water'
    end
  end
end
