# Module to include in Dosha model for test environment
module TestDoshaMethods
  def core_qualities
    {
      "description" => "Balanced #{name} description",
      "characteristics" => ["Characteristic 1", "Characteristic 2"]
    }
  end
  
  def strengths
    ["#{name} Strength 1", "#{name} Strength 2"]
  end
  
  def growth_areas
    ["#{name} Growth Area 1", "#{name} Growth Area 2"]
  end
end

# Include the test methods in the Dosha class for test environment
if Rails.env.test?
  Dosha.include(TestDoshaMethods)
end

FactoryBot.define do
  factory :dosha do
    sequence(:name) { |n| ["Vata", "Pitta", "Kapha"][n % 3] }
    color { "##{rand(0..255).to_s(16).rjust(2, '0') * 3}" }
    
    # Define traits for each dosha type with appropriate colors
    trait :vata do
      name { 'Vata' }
      color { '#80B3FF' }  # Light blue
    end
    
    trait :pitta do
      name { 'Pitta' }
      color { '#FF8080' }  # Light red
    end
    
    trait :kapha do
      name { 'Kapha' }
      color { '#80FF80' }  # Light green
    end
  end
end
