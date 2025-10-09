# db/seeds/bio_profile_foods_seed.rb

puts "Seeding BioProfile Healing and Aggravating Foods..."

# Fetch BioProfile records
nervous_system = BioProfile.find_by(name: "Nervous System")
metabolic = BioProfile.find_by(name: "Metabolic")
structural = BioProfile.find_by(name: "Structural")

# Seed BioProfileHealingFoods
if nervous_system
  puts "  Seeding Healing Foods for Nervous System Profile..."
  [
    { name: "Cooked Oats", description: "Complex carbohydrates that support stable blood sugar and nervous system function.", recommendations: "With healthy fats, cinnamon, and cardamom for metabolic support." },
    { name: "Basmati Rice", description: "Easily digestible complex carbs that support nervous system stability.", recommendations: "Cooked with healthy fats for optimal nutrient absorption." },
    { name: "Mung Dal", description: "High-quality plant protein that supports nervous system health and digestive function.", recommendations: "In soups or stews for optimal bioavailability." },
    { name: "Sweet Potatoes", description: "Nutrient-dense complex carbs that support nervous system grounding and stability.", recommendations: "Baked or roasted with healthy fats." },
    { name: "Asparagus", description: "Nutrient-rich vegetable that supports nervous system health and digestive function.", recommendations: "Steamed or lightly cooked to preserve nutrients." },
    { name: "Ghee", description: "Healthy saturated fats that support nervous system health and nutrient absorption.", recommendations: "Used in cooking or added to warm dishes for optimal absorption." },
    { name: "Ginger (fresh)", description: "Anti-inflammatory herb that supports digestive function and circulation.", recommendations: "In teas or cooked dishes for maximum benefit." },
    { name: "Cinnamon", description: "Blood sugar-regulating spice that supports metabolic function.", recommendations: "In warm drinks or desserts for metabolic support." },
    { name: "Cardamom", description: "Digestive-supporting spice that promotes nervous system calm.", recommendations: "In sweet dishes or teas for digestive and nervous system support." },
    { name: "Warm Milk", description: "Sleep-supporting beverage that promotes nervous system relaxation.", recommendations: "With a pinch of nutmeg before bed for optimal sleep support." }
  ].each do |food_data|
    BioProfileHealingFood.find_or_create_by!(food_data.merge(bio_profile: nervous_system))
  end
end

if metabolic
  puts "  Seeding Healing Foods for Metabolic Profile..."
  [
    { name: "Basmati Rice", description: "Anti-inflammatory complex carbs that support metabolic cooling and digestive function.", recommendations: "Plain or with cooling spices for metabolic support." },
    { name: "Cucumbers", description: "Hydrating, cooling vegetables that support metabolic temperature regulation.", recommendations: "Raw in salads or juices for maximum cooling benefit." },
    { name: "Cilantro", description: "Detoxifying herb that supports metabolic cooling and inflammation reduction.", recommendations: "Fresh in dishes or as a garnish for metabolic support." },
    { name: "Coconut", description: "Cooling, nutrient-dense food that supports metabolic health and hydration.", recommendations: "Water, milk, or fresh meat for metabolic cooling." },
    { name: "Ghee", description: "Anti-inflammatory healthy fats that support metabolic cooling and digestive function.", recommendations: "Used in cooking or added to warm dishes for metabolic support." },
    { name: "Mint", description: "Cooling herb that supports digestive function and metabolic temperature regulation.", recommendations: "In teas or fresh in dishes for digestive and metabolic support." },
    { name: "Fennel", description: "Cooling, digestive-supporting herb that reduces acidity and supports metabolic health.", recommendations: "Seeds after meals or in teas for digestive and metabolic optimization." },
    { name: "Green Beans", description: "Light, cooling vegetables that support metabolic health and digestive function.", recommendations: "Steamed or lightly cooked for optimal nutrient absorption." },
    { name: "Pomegranates", description: "Antioxidant-rich fruit that supports metabolic cooling and detoxification.", recommendations: "Fresh fruit or juice for metabolic and antioxidant support." },
    { name: "Sweet Apples", description: "Cooling, cleansing fruit that supports metabolic health and digestive function.", recommendations: "Raw or stewed for metabolic cooling and digestive support." }
  ].each do |food_data|
    BioProfileHealingFood.find_or_create_by!(food_data.merge(bio_profile: metabolic))
  end

end

if structural
  puts "  Seeding Healing Foods for Structural Profile..."
  [
    { name: "Millet", description: "Light, metabolism-boosting grain that supports structural health and energy.", recommendations: "Cooked as a grain or in porridges for structural optimization." },
    { name: "Barley", description: "Light, metabolism-supporting grain that promotes structural health and circulation.", recommendations: "Soups or as a grain for structural and metabolic support." },
    { name: "Lentils (red/brown)", description: "High-quality plant protein that supports structural health and muscle function.", recommendations: "Soups or dals for structural protein support." },
    { name: "Broccoli", description: "Nutrient-dense vegetable that supports structural health and metabolic function.", recommendations: "Steamed or stir-fried for optimal nutrient absorption." },
    { name: "Cabbage", description: "Light, metabolism-supporting vegetable that promotes structural health.", recommendations: "Steamed or stir-fried for structural and metabolic support." },
    { name: "Ginger (dry)", description: "Metabolism-boosting herb that supports structural health and circulation.", recommendations: "In teas or cooked dishes for structural and metabolic optimization." },
    { name: "Black Pepper", description: "Metabolism-enhancing spice that supports structural health and digestive function.", recommendations: "Freshly ground on dishes for structural and metabolic support." },
    { name: "Turmeric", description: "Anti-inflammatory compound that supports structural health and metabolic function.", recommendations: "In cooking or warm milk for structural and metabolic optimization." },
    { name: "Honey", description: "Natural energy source that supports structural health and metabolic function.", recommendations: "Raw, not cooked, in warm water for structural energy support." },
    { name: "Green Tea", description: "Metabolism-boosting beverage that supports structural health and detoxification.", recommendations: "Plain or with a slice of ginger for structural and metabolic optimization." }
  ].each do |food_data|
    BioProfileHealingFood.find_or_create_by!(food_data.merge(bio_profile: structural))
  end
end

# Seed BioProfileAggravatingFoods
if nervous_system
  puts "  Seeding Aggravating Foods for Nervous System Profile..."
  [
    { name: "Raw Salads", description: "Cold, difficult to digest foods that can stress nervous system.", recommendations: "Avoid or consume in very small amounts with warming spices." },
    { name: "Cold Drinks", description: "Cooling beverages that can stress nervous system function.", recommendations: "Avoid, prefer warm beverages for nervous system support." },
    { name: "Dried Fruit", description: "Concentrated sugars that can cause blood sugar spikes and nervous system stress.", recommendations: "Soak before consuming or avoid for stable blood sugar." },
    { name: "Beans (large)", description: "Gas-forming foods that can stress digestive and nervous system function.", recommendations: "Avoid or soak and cook thoroughly with digestive spices." },
    { name: "Cabbage (raw)", description: "Gas-forming, cold foods that can stress nervous system.", recommendations: "Avoid raw, lightly cook if consumed for digestive support." },
    { name: "Broccoli (raw)", description: "Gas-forming, cold foods that can stress nervous system.", recommendations: "Avoid raw, lightly cook if consumed for digestive support." },
    { name: "Ice Cream", description: "Cold, high-sugar foods that can stress nervous system and blood sugar.", recommendations: "Avoid for nervous system and metabolic health." },
    { name: "Carbonated Drinks", description: "Gas-forming, high-sugar beverages that can stress nervous system.", recommendations: "Avoid for nervous system and metabolic health." },
    { name: "Popcorn", description: "Dry, processed foods that can stress nervous system and digestive function.", recommendations: "Avoid for nervous system and digestive health." },
    { name: "Coffee", description: "Overstimulating beverage that can stress nervous system and adrenal function.", recommendations: "Reduce or avoid for nervous system balance." }
  ].each do |food_data|
    BioProfileAggravatingFood.find_or_create_by!(food_data.merge(bio_profile: nervous_system))
  end
end

if metabolic
  puts "  Seeding Aggravating Foods for Metabolic Profile..."
  [
    { name: "Spicy Peppers", description: "Inflammatory foods that can stress metabolic function and increase inflammation.", recommendations: "Avoid or use very sparingly for metabolic health." },
    { name: "Sour Cream", description: "High-fat dairy that can stress metabolic function and digestive health.", recommendations: "Avoid for metabolic and digestive optimization." },
    { name: "Tomatoes (raw)", description: "Acidic foods that can stress metabolic function and digestive health.", recommendations: "Cooked is better, raw can stress metabolic function." },
    { name: "Citrus Fruits (sour)", description: "Acidic foods that can stress metabolic function and digestive health.", recommendations: "Avoid or consume in moderation for metabolic balance." },
    { name: "Red Meat", description: "Heavy, inflammatory protein that can stress metabolic function.", recommendations: "Reduce or avoid for metabolic and inflammatory health." },
    { name: "Alcohol", description: "Toxic substance that can stress metabolic function and increase inflammation.", recommendations: "Avoid or consume in very small amounts for metabolic health." },
    { name: "Fermented Foods", description: "Acidic foods that can stress metabolic function and digestive health.", recommendations: "Avoid or consume in moderation for metabolic balance." },
    { name: "Garlic", description: "Pungent foods that can stress metabolic function and digestive health.", recommendations: "Use sparingly or avoid for metabolic optimization." },
    { name: "Onions (raw)", description: "Pungent foods that can stress metabolic function and digestive health.", recommendations: "Cooked is better, raw can stress metabolic function." },
    { name: "Vinegar", description: "Acidic foods that can stress metabolic function and digestive health.", recommendations: "Avoid or use sparingly for metabolic balance." }
  ].each do |food_data|
    BioProfileAggravatingFood.find_or_create_by!(food_data.merge(bio_profile: metabolic))
  end
end

if structural
  puts "  Seeding Aggravating Foods for Structural Profile..."
  [
    { name: "Dairy (heavy)", description: "Heavy, inflammatory foods that can stress structural health and metabolic function.", recommendations: "Avoid or consume in very small amounts for structural optimization." },
    { name: "Sweet Fruits (heavy)", description: "High-sugar foods that can stress structural health and metabolic function.", recommendations: "Avoid or consume in moderation for structural and metabolic health." },
    { name: "Wheat", description: "Heavy, inflammatory grain that can stress structural health and digestive function.", recommendations: "Reduce or avoid, prefer lighter grains for structural optimization." },
    { name: "Fried Foods", description: "Heavy, inflammatory foods that can stress structural health and metabolic function.", recommendations: "Avoid for structural and metabolic health." },
    { name: "Cold Drinks", description: "Cooling beverages that can stress structural health and metabolic function.", recommendations: "Avoid, prefer warm beverages for structural and metabolic support." },
    { name: "Sugar", description: "High-sugar foods that can stress structural health and metabolic function.", recommendations: "Reduce or avoid for structural and metabolic optimization." },
    { name: "Salt (excess)", description: "High-sodium foods that can stress structural health and water balance.", recommendations: "Reduce for structural and metabolic health." },
    { name: "Avocado", description: "High-fat foods that can stress structural health and metabolic function.", recommendations: "Consume in very small amounts for structural optimization." },
    { name: "Bananas", description: "High-sugar foods that can stress structural health and metabolic function.", recommendations: "Avoid or consume in moderation for structural and metabolic health." },
    { name: "Pork", description: "Heavy, inflammatory protein that can stress structural health and metabolic function.", recommendations: "Avoid for structural and metabolic optimization." }
  ].each do |food_data|
    BioProfileAggravatingFood.find_or_create_by!(food_data.merge(bio_profile: structural))
  end
end

puts "BioProfile Healing and Aggravating Foods seeding complete."
