class AssessmentEntry < ApplicationRecord
  # Encrypt sensitive health data
  encrypts :results
  encrypts :completed_at, deterministic: true
  
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

  has_many :assessment_chronic_illnesses, dependent: :destroy
  has_many :chronic_illnesses, through: :assessment_chronic_illnesses

  def results
    result_data = Hash.new(0)
    options.each {|option| result_data[option.dosha] += 1 }
    result_data
  end

  alias_method :dosha_scores, :results

  def primary_dosha
    dosha_highest_value = results.max_by { |_, value| value }&.first
    dosha_name_for_lookup = case dosha_highest_value&.to_sym
                            when :vata then Dosha::VATA
                            when :pitta then Dosha::PITTA
                            when :kapha then Dosha::KAPHA
                            else nil
                            end
    Dosha.find_by(name: dosha_name_for_lookup)
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

  after_save :update_user_dosha_results, if: :saved_change_to_completed_at?

  private

  def update_user_dosha_results
    # Ensure we have a user and the assessment has been marked as completed.
    return unless user.present? && completed_at.present?

    if type == 'PrakrutiEntry'
      user.update(prakruti: primary_dosha)
    elsif type == 'VikrutiEntry'
      user.update(vikruti: primary_dosha)
    end
  end
end
