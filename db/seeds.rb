require_relative 'seeds_data.rb'

Quiz.find_or_create_by!(category: 'vikruti') do |quiz|
  quiz.title = 'Vikruti Quiz'
  quiz.description = 'Vikruti (current elemental imbalance) self-assessment quiz'
end

prakruti_quiz = Quiz.find_or_create_by!(category: 'prakruti') do |quiz|
  quiz.title = 'Prakruti Quiz'
  quiz.description = 'Prakruti (original elemental nature) self-assessment quiz'
end

if prakruti_quiz.questions.none?
  PRAKRUTI_QUESTIONS_DATA.each do |question_data|
    question = Question.create!(quiz: prakruti_quiz, text: question_data[:text], points: question_data[:points])
    question_data[:options].each do |option_data|
      QuizOption.create!(question: question, text: option_data[:text], dosha: option_data[:dosha])
    end
  end
end

puts "Seeds file has been run."