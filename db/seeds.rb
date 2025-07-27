Quiz.find_or_create_by!(category: 'vikruti') do |quiz|
  quiz.title = 'Vikruti Quiz'
  quiz.description = 'Vikruti (current elemental imbalance) self-assessment quiz'
end

prakruti_quiz = Quiz.find_or_create_by!(category: 'prakruti') do |quiz|
  quiz.title = 'Prakruti Quiz'
  quiz.description = 'Prakruti (original elemental nature) self-assessment quiz'
end

if prakruti_quiz.questions.none?
  question1 = Question.create!(
    quiz: prakruti_quiz,
    text: 'How would you describe your body frame?',
    disturbed_doshas: ['vata', 'pitta', 'kapha']
  )

  QuizOption.create!(
    question: question1,
    text: 'Thin, light frame, agile',
    dosha: 'vata'
  )

  QuizOption.create!(
    question: question1,
    text: 'Medium, muscular frame, athletic',
    dosha: 'pitta'
  )

  QuizOption.create!(
    question: question1,
    text: 'Large, sturdy frame, thick-build',
    dosha: 'kapha'
  )
end

puts "Seeds file has been run."
