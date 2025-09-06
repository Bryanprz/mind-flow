class CreateHealthAssessmentEntry
  def self.call(*args, **kwargs, &block)
    new(*args, **kwargs, &block).call
  end

  def initialize(health_assessment:, answers:, chronic_illness_ids: [])
    @answers = answers

    assessment_entry_class = case health_assessment.assessment_type.to_sym
                             when :prakruti
                               PrakrutiEntry
                             when :vikruti
                               VikrutiEntry
                             else
                               AssessmentEntry # Fallback or raise an error if unexpected
                             end
    @assessment_entry = assessment_entry_class.find_or_initialize_by(
      user: Current.user,  # Will be nil for guests
      health_assessment: health_assessment
    )

    if chronic_illness_ids.present?
      chronic_illnesses = ChronicIllness.where(id: chronic_illness_ids)
      @assessment_entry.chronic_illnesses = chronic_illnesses
    else
      @assessment_entry.chronic_illnesses.clear
    end
  end

  # main logic goes here
  def call
    # If updating an existing entry, delete the old answers before creating new ones.
    assessment_entry.answers.delete_all if assessment_entry.persisted?

    # Save the entry to ensure it has an ID before we add answers.
    assessment_entry.save!

    # Prepare all answers for a single bulk insert
    answers_to_insert = answers.map do |answer|
      {
        assessment_entry_id: assessment_entry.id,
        assessment_option_id: answer[:option_id],
        created_at: Time.current,
        updated_at: Time.current
      }
    end
    AssessmentAnswer.insert_all(answers_to_insert) if answers_to_insert.any?

    # Mark the entry as completed
    assessment_entry.update!(completed_at: Time.current)
    assessment_entry.reload
    assessment_entry
  end

  private

  attr_reader :answers, :assessment_entry
end
