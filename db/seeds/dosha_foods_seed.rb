# db/seeds/dosha_foods_seed.rb

puts "Seeding Dosha Healing and Aggravating Foods..."

# Fetch Dosha records
vata = Dosha.find_by(name: "Vata")
pitta = Dosha.find_by(name: "Pitta")
kapha = Dosha.find_by(name: "Kapha")

# Seed DoshaHealingFoods
if vata
  puts "  Seeding Healing Foods for Vata..."
  [
    { name: "Cooked Oats", description: "Warm, nourishing, easy to digest.", recommendations: "With ghee, cinnamon, and cardamom." },
    { name: "Basmati Rice", description: "Light, easy to digest, grounding.", recommendations: "Cooked with a little ghee." },
    { name: "Mung Dal", description: "Light, protein-rich, tridoshic.", recommendations: "Soups or stews." },
    { name: "Sweet Potatoes", description: "Grounding, nourishing, warming.", recommendations: "Baked or roasted." },
    { name: "Asparagus", description: "Light, slightly bitter, good for Vata.", recommendations: "Steamed or lightly cooked." },
    { name: "Ghee", description: "Lubricating, nourishing, promotes digestion.", recommendations: "Used in cooking or added to warm dishes." },
    { name: "Ginger (fresh)", description: "Warming, digestive stimulant.", recommendations: "In teas or cooked dishes." },
    { name: "Cinnamon", description: "Warming, sweet, digestive.", recommendations: "In warm drinks or desserts." },
    { name: "Cardamom", description: "Aromatic, digestive, calming.", recommendations: "In sweet dishes or teas." },
    { name: "Warm Milk", description: "Nourishing, calming, promotes sleep.", recommendations: "With a pinch of nutmeg before bed." }
  ].each do |food_data|
    DoshaHealingFood.find_or_create_by!(food_data.merge(dosha: vata))
  end
end

if pitta
  puts "  Seeding Healing Foods for Pitta..."
  [
    { name: "Basmati Rice", description: "Cooling, easy to digest.", recommendations: "Plain or with cooling spices." },
    { name: "Cucumbers", description: "Cooling, hydrating.", recommendations: "Raw in salads or juices." },
    { name: "Cilantro", description: "Cooling, detoxifying.", recommendations: "Fresh in dishes or as a garnish." },
    { name: "Coconut", description: "Cooling, nourishing.", recommendations: "Water, milk, or fresh meat." },
    { name: "Ghee", description: "Cooling, soothing, anti-inflammatory.", recommendations: "Used in cooking or added to warm dishes." },
    { name: "Mint", description: "Cooling, digestive.", recommendations: "In teas or fresh in dishes." },
    { name: "Fennel", description: "Cooling, digestive, reduces acidity.", recommendations: "Seeds after meals or in teas." },
    { name: "Green Beans", description: "Light, cooling, easy to digest.", recommendations: "Steamed or lightly cooked." },
    { name: "Pomegranates", description: "Cooling, astringent, detoxifying.", recommendations: "Fresh fruit or juice." },
    { name: "Sweet Apples", description: "Cooling, cleansing.", recommendations: "Raw or stewed." }
  ].each do |food_data|
    DoshaHealingFood.find_or_create_by!(food_data.merge(dosha: pitta))
  end

end

if kapha
  puts "  Seeding Healing Foods for Kapha..."
  [
    { name: "Millet", description: "Light, drying, warming.", recommendations: "Cooked as a grain or in porridges." },
    { name: "Barley", description: "Light, drying, diuretic.", recommendations: "Soups or as a grain." },
    { name: "Lentils (red/brown)", description: "Light, astringent, protein-rich.", recommendations: "Soups or dals." },
    { name: "Broccoli", description: "Light, pungent, drying.", recommendations: "Steamed or stir-fried." },
    { name: "Cabbage", description: "Light, drying, pungent.", recommendations: "Steamed or stir-fried." },
    { name: "Ginger (dry)", description: "Warming, stimulating, drying.", recommendations: "In teas or cooked dishes." },
    { name: "Black Pepper", description: "Pungent, warming, stimulates digestion.", recommendations: "Freshly ground on dishes." },
    { name: "Turmeric", description: "Bitter, astringent, anti-inflammatory.", recommendations: "In cooking or warm milk." },
    { name: "Honey", description: "Warming, drying, expectorant.", recommendations: "Raw, not cooked, in warm water." },
    { name: "Green Tea", description: "Light, stimulating, detoxifying.", recommendations: "Plain or with a slice of ginger." }
  ].each do |food_data|
    DoshaHealingFood.find_or_create_by!(food_data.merge(dosha: kapha))
  end
end

# Seed DoshaAggravatingFoods
if vata
  puts "  Seeding Aggravating Foods for Vata..."
  [
    { name: "Raw Salads", description: "Cold, dry, difficult to digest.", recommendations: "Avoid or consume in very small amounts." },
    { name: "Cold Drinks", description: "Cooling, constricting.", recommendations: "Avoid, prefer warm beverages." },
    { name: "Dried Fruit", description: "Dry, light, can cause constipation.", recommendations: "Soak before consuming or avoid." },
    { name: "Beans (large)", description: "Gas-forming, difficult to digest.", recommendations: "Avoid or soak and cook thoroughly with spices." },
    { name: "Cabbage (raw)", description: "Gas-forming, cold, dry.", recommendations: "Avoid raw, lightly cook if consumed." },
    { name: "Broccoli (raw)", description: "Gas-forming, cold, dry.", recommendations: "Avoid raw, lightly cook if consumed." },
    { name: "Ice Cream", description: "Cold, heavy, congesting.", recommendations: "Avoid." },
    { name: "Carbonated Drinks", description: "Cold, gas-forming.", recommendations: "Avoid." },
    { name: "Popcorn", description: "Dry, light, rough.", recommendations: "Avoid." },
    { name: "Coffee", description: "Stimulating, drying, can increase anxiety.", recommendations: "Reduce or avoid." }
  ].each do |food_data|
    DoshaAggravatingFood.find_or_create_by!(food_data.merge(dosha: vata))
  end
end

if pitta
  puts "  Seeding Aggravating Foods for Pitta..."
  [
    { name: "Spicy Peppers", description: "Heating, inflammatory.", recommendations: "Avoid or use very sparingly." },
    { name: "Sour Cream", description: "Sour, heating, can cause acidity.", recommendations: "Avoid." },
    { name: "Tomatoes (raw)", description: "Acidic, heating.", recommendations: "Cooked is better, raw can aggravate." },
    { name: "Citrus Fruits (sour)", description: "Acidic, heating.", recommendations: "Avoid or consume in moderation." },
    { name: "Red Meat", description: "Heating, heavy, difficult to digest.", recommendations: "Reduce or avoid." },
    { name: "Alcohol", description: "Heating, toxic, can cause inflammation.", recommendations: "Avoid or consume in very small amounts." },
    { name: "Fermented Foods", description: "Sour, heating, can increase acidity.", recommendations: "Avoid or consume in moderation." },
    { name: "Garlic", description: "Pungent, heating.", recommendations: "Use sparingly or avoid." },
    { name: "Onions (raw)", description: "Pungent, heating.", recommendations: "Cooked is better, raw can aggravate." },
    { name: "Vinegar", description: "Sour, heating, can cause acidity.", recommendations: "Avoid or use sparingly." }
  ].each do |food_data|
    DoshaAggravatingFood.find_or_create_by!(food_data.merge(dosha: pitta))
  end
end

if kapha
  puts "  Seeding Aggravating Foods for Kapha..."
  [
    { name: "Dairy (heavy)", description: "Heavy, cold, mucus-forming.", recommendations: "Avoid or consume in very small amounts." },
    { name: "Sweet Fruits (heavy)", description: "Heavy, cold, can increase mucus.", recommendations: "Avoid or consume in moderation." },
    { name: "Wheat", description: "Heavy, mucus-forming.", recommendations: "Reduce or avoid, prefer lighter grains." },
    { name: "Fried Foods", description: "Heavy, oily, difficult to digest.", recommendations: "Avoid." },
    { name: "Cold Drinks", description: "Cooling, can increase mucus.", recommendations: "Avoid, prefer warm beverages." },
    { name: "Sugar", description: "Heavy, cold, can increase mucus.", recommendations: "Reduce or avoid." },
    { name: "Salt (excess)", description: "Water retention, can increase heaviness.", recommendations: "Reduce." },
    { name: "Avocado", description: "Heavy, oily, can increase Kapha.", recommendations: "Consume in very small amounts." },
    { name: "Bananas", description: "Heavy, cold, mucus-forming.", recommendations: "Avoid or consume in moderation." },
    { name: "Pork", description: "Heavy, oily, difficult to digest.", recommendations: "Avoid." }
  ].each do |food_data|
    DoshaAggravatingFood.find_or_create_by!(food_data.merge(dosha: kapha))
  end
end

puts "Dosha Healing and Aggravating Foods seeding complete."
