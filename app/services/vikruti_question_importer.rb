require 'csv'

class VikrutiQuestionImporter
  def initialize
    @file_path = Rails.root.join('data', 'vikruti_questions.csv')
  end

  def call
    vikruti_assessment = HealthAssessment.find_by(category: "vikruti")

    # Ensure all operations are atomic: if one fails, all are rolled back.
    ActiveRecord::Base.transaction do
      CSV.foreach(@file_path, headers: true) do |row|
        assessment_question = AssessmentQuestion.create!(
          health_assessment: vikruti_assessment,
          text: row['question'],
          points: 1,
          question_group: row['question_group']
        )

        %i[vata pitta kapha].each do |dosha|
          AssessmentOption.create!(
            dosha: dosha,
            text: row["#{dosha}_option"],
            assessment_question: assessment_question
          )
        end
      end
      puts "Successfully imported all data from #{@file_path}."
    end
  rescue ActiveRecord::RecordInvalid => e
    puts "Import failed due to validation error: #{e.message}. All changes rolled back."
    puts "Please check your CSV data for invalid entries."
  rescue StandardError => e
    puts "Import failed due to an unexpected error: #{e.message}. All changes rolled back."
    puts "Please check the CSV file format or the import logic."
  end
end
