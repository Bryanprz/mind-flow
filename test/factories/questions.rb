FactoryBot.define do
  factory :question do
    text { 'How would you describe your body frame?' }
    disturbed_doshas { ['vata', 'pitta', 'kapha'] }
    association :quiz
  end
end
