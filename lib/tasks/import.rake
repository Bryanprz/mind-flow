# lib/tasks/import.rake
namespace :import do
  desc "Imports Prakruti questions from data/prakruti_questions.csv"
  task prakruti_questions: :environment do
    puts "Starting Prakruti questions import..."
    PrakrutiQuestionImporter.new.call
    puts "Prakruti questions import finished."
  end

  desc "Imports Vikruti questions from data/vikruti_questions.csv"
  task vikruti_questions: :environment do
    puts "Starting Vikruti questions import..."
    VikrutiQuestionImporter.new.call
    puts "Vikruti questions import finished."
  end
end
