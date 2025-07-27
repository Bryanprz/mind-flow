FactoryBot.define do
  factory :quiz_option_vata, class: 'QuizOption' do
    text { 'Thin, light frame, agile' }
    dosha { 'vata' }
    association :question
  end

  factory :quiz_option_pitta, class: 'QuizOption' do
    text { 'Medium, muscular frame, athletic' }
    dosha { 'pitta' }
    association :question
  end

  factory :quiz_option_kapha, class: 'QuizOption' do
    text { 'Large, sturdy frame, thick-build' }
    dosha { 'kapha' }
    association :question
  end
end
