class CreateHealthAssessmentEntry
  def self.call(*args, **kwargs, &block)
    new(*args, **kwargs, &block).call
  end

  def initialize(health_assessment:, answers:, chronic_illness_ids: [], reason_for_visit:)
    @answers = answers
    # ChronicIllness, PrakrutiEntry, and VikrutiEntry were removed after Ayurveda models were dropped
    # chronic_illnesses = ChronicIllness.where(id: chronic_illness_ids)
    
    # Always use base AssessmentEntry class since STI types were removed
    assessment_entry_class = AssessmentEntry
    
    @assessment_entry = assessment_entry_class.find_or_initialize_by(
      user: Current.user,  # Will be nil for guests
      health_assessment: health_assessment
    )
    @assessment_entry.reason_for_visit = reason_for_visit
    # Chronic illness association was removed
    # @assessment_entry.chronic_illnesses.concat(chronic_illnesses)
    @assessment_entry.save
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
