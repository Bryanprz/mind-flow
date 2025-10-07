# frozen_string_literal: true

puts "Seeding dosha foods..."

# Define foods for each dosha
dosha_foods_data = {
  "Vata" => {
    healing_foods: [
      "Warm soups",
      "Root vegetables",
      "Ghee",
      "Dates",
      "Sweet fruits",
      "Cooked grains",
      "Warm milk",
      "Nuts (soaked)",
      "Seeds (ground)",
      "Olive oil",
      "Sesame oil",
      "Sweet potatoes",
      "Carrots",
      "Beets",
      "Quinoa",
      "Rice",
      "Oats",
      "Bananas",
      "Mangoes",
      "Avocados"
    ],
    aggravating_foods: [
      "Cold salads",
      "Raw nuts",
      "Excess coffee",
      "Raw vegetables",
      "Cold drinks",
      "Ice cream",
      "Dry crackers",
      "Popcorn",
      "Chips",
      "Frozen foods",
      "Carbonated drinks",
      "Raw foods",
      "Light, airy foods",
      "Excess beans",
      "Cruciferous vegetables (raw)"
    ]
  },
  "Pitta" => {
    healing_foods: [
      "Sweet fruits",
      "Coconut",
      "Cooling vegetables",
      "Mint",
      "Cilantro",
      "Cucumber",
      "Melons",
      "Sweet berries",
      "Milk",
      "Ghee",
      "Coconut oil",
      "Sweet potatoes",
      "Leafy greens",
      "Cabbage",
      "Broccoli",
      "Cauliflower",
      "Asparagus",
      "Green beans",
      "Peas",
      "Rice",
      "Wheat",
      "Barley"
    ],
    aggravating_foods: [
      "Spicy foods",
      "Hot peppers",
      "Sour foods",
      "Fermented foods",
      "Alcohol",
      "Coffee",
      "Tea",
      "Vinegar",
      "Tomatoes",
      "Eggplant",
      "Garlic",
      "Onions",
      "Mustard",
      "Horseradish",
      "Pickles",
      "Olives",
      "Excess salt",
      "Fried foods",
      "Red meat",
      "Shellfish"
    ]
  },
  "Kapha" => {
    healing_foods: [
      "Light, warm foods",
      "Bitter vegetables",
      "Astringent foods",
      "Spicy foods",
      "Honey",
      "Light grains",
      "Legumes",
      "Leafy greens",
      "Apples",
      "Pears",
      "Pomegranates",
      "Berries",
      "Ginger",
      "Turmeric",
      "Black pepper",
      "Mustard seeds",
      "Cumin",
      "Coriander",
      "Fennel",
      "Mint",
      "Basil"
    ],
    aggravating_foods: [
      "Heavy foods",
      "Sweet foods",
      "Dairy products",
      "Wheat",
      "Bananas",
      "Oranges",
      "Grapes",
      "Pineapple",
      "Melons",
      "Coconut",
      "Nuts",
      "Seeds",
      "Oils (excess)",
      "Salt",
      "Sugar",
      "Bread",
      "Pasta",
      "Rice (excess)",
      "Cold foods",
      "Frozen foods",
      "Ice cream",
      "Cheese",
      "Yogurt",
      "Butter"
    ]
  }
}

# Create foods and associate them with doshas
dosha_foods_data.each do |dosha_name, foods_data|
  dosha = Dosha.find_by(name: dosha_name)
  next unless dosha

  puts "Adding foods for #{dosha_name}..."

  # Add healing foods
  foods_data[:healing_foods].each do |food_name|
    food = Food.find_or_create_by(name: food_name)
    unless dosha.foods_that_heal.include?(food)
      dosha.foods_that_heal << food
    end
  end

  # Add aggravating foods
  foods_data[:aggravating_foods].each do |food_name|
    food = Food.find_or_create_by(name: food_name)
    unless dosha.foods_that_aggravate.include?(food)
      dosha.foods_that_aggravate << food
    end
  end

  puts "Added #{dosha.foods_that_heal.count} healing foods and #{dosha.foods_that_aggravate.count} aggravating foods for #{dosha_name}"
end

puts "Dosha foods seeded."
