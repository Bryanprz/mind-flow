# lib/tasks/import.rake
namespace :import do
  desc "Imports Prakruti questions from data/prakruti_questions.csv"
  task prakruti_questions: :environment do
    puts "Starting Prakruti questions import..."
    PrakrutiQuestionImporter.new.call
    puts "Prakruti questions import finished."
  end
end
