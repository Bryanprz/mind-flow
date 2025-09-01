# db/seeds/healing_plan_templates.seeds.rb

# Seed Dosha records if they don't exist (assuming they are already seeded elsewhere or will be)
# For this seed, we'll find_or_create_by name
vata_dosha = Dosha.find_or_initialize_by(name: "Vata")
vata_dosha.color = "blue"
vata_dosha.save!

pitta_dosha = Dosha.find_or_initialize_by(name: "Pitta")
pitta_dosha.color = "red"
pitta_dosha.save!

kapha_dosha = Dosha.find_or_initialize_by(name: "Kapha")
kapha_dosha.color = "green"
kapha_dosha.save!

# Data extracted from en.yml
dosha_healing_plans_data = {
  "Vata" => {
    description: "To balance Vata, focus on establishing a consistent daily routine with regular meals and sleep times. Favor warm, nourishing, and slightly oily foods while incorporating calming activities like meditation and gentle yoga to ground your energy.",
    sections: [
      {
        name: "Focus Areas",
        items: [
          "Sleep: Deeper rest",
          "Digestion: Improve Agni",
          "Energy: Maintain balance",
          "Emotions: Reduce anxiety"
        ]
      },
      {
        name: "Morning Routine",
        items: [
          "Wake up before 6 AM.",
          "Drink warm water with lemon.",
          "Perform oil pulling for 5-10 minutes.",
          "Gentle stretching or yoga for 15-20 minutes.",
          "Tongue scraping, oil pulling",
          "5 min Pranayama",
          "Warm, grounding breakfast"
        ]
      },
      {
        name: "Midday Routine",
        items: [
          "Largest meal (12–1pm)",
          "Brahmi tea",
          "5-min walk + breathwork"
        ]
      },
      {
        name: "Evening Routine",
        items: [
          "Abhyanga massage",
          "Gentle yoga / meditation",
          "Sleep prep (10pm)"
        ]
      },
      {
        name: "Dietary Guidelines",
        items: [
          "Favor warm, cooked, moist, and grounding foods.",
          "Avoid cold, dry, raw, and light foods.",
          "Eat regular meals at consistent times.",
          "Include healthy fats like ghee and olive oil.",
          "Spices: ginger, cumin, coriander, fennel."
        ]
      },
      {
        name: "Foods to Favor",
        items: [
          "Warm soups",
          "root veggies",
          "ghee",
          "dates"
        ]
      },
      {
        name: "Foods to Avoid",
        items: [
          "Cold salads",
          "raw nuts",
          "excess coffee"
        ]
      },
      {
        name: "Herbal Remedies",
        items: [
          "Ashwagandha: 500mg, nourishes majja dhatu",
          "Brahmi: calming, supports concentration",
          "Triphala: gentle detox, supports digestion"
        ]
      },
      {
        name: "Lifestyle Practices",
        items: [
          "Maintain a consistent daily routine (dinacharya).",
          "Get adequate rest (7-8 hours of sleep).",
          "Practice self-oil massage (abhyanga) daily.",
          "Spend time in nature, especially in calming environments.",
          "Yoga: Cat-cow, forward bends, gentle twists",
          "Breathwork: Alternate nostril, Bhramari",
          "Meditation: Grounding mantra meditation"
        ]
      },
      {
        name: "Mind-Body Connection",
        items: [
          "Practice meditation or mindfulness for 10-15 minutes daily.",
          "Engage in calming activities like reading or gentle music.",
          "Avoid overstimulation and excessive travel."
        ]
      }
    ]
  },
  "Pitta" => {
    description: "For Pitta, emphasize cooling and moderation in all aspects of life. Consume fresh, cooling foods while avoiding spicy, fried, and sour items, and practice calming, non-competitive activities like swimming or walking in nature.",
    sections: [
      {
        name: "Focus Areas",
        items: [
          "Sleep: Deeper rest",
          "Digestion: Improve Agni",
          "Energy: Maintain balance",
          "Emotions: Reduce anxiety"
        ]
      },
      {
        name: "Morning Routine",
        items: [
          "Wake up before 6 AM.",
          "Drink cool water.",
          "Perform gentle cleansing practices.",
          "Practice cooling pranayama (breathing exercises).",
          "Tongue scraping, oil pulling",
          "5 min Pranayama",
          "Warm, grounding breakfast"
        ]
      },
      {
        name: "Midday Routine",
        items: [
          "Largest meal (12–1pm)",
          "Brahmi tea",
          "5-min walk + breathwork"
        ]
      },
      {
        name: "Evening Routine",
        items: [
          "Abhyanga massage",
          "Gentle yoga / meditation",
          "Sleep prep (10pm)"
        ]
      },
      {
        name: "Dietary Guidelines",
        items: [
          "Favor cool, sweet, bitter, and astringent foods.",
          "Avoid hot, spicy, sour, and salty foods.",
          "Eat at regular times and avoid skipping meals.",
          "Include plenty of fresh fruits and vegetables.",
          "Spices: coriander, fennel, cardamom, saffron."
        ]
      },
      {
        name: "Foods to Favor",
        items: [
          "Warm soups",
          "root veggies",
          "ghee",
          "dates"
        ]
      },
      {
        name: "Foods to Avoid",
        items: [
          "Cold salads",
          "raw nuts",
          "excess coffee"
        ]
      },
      {
        name: "Herbal Remedies",
        items: [
          "Ashwagandha: 500mg, nourishes majja dhatu",
          "Brahmi: calming, supports concentration",
          "Triphala: gentle detox, supports digestion"
        ]
      },
      {
        name: "Lifestyle Practices",
        items: [
          "Avoid excessive heat and sun exposure.",
          "Engage in moderate, non-competitive exercise.",
          "Prioritize relaxation and leisure activities.",
          "Spend time near water or in cool environments.",
          "Yoga: Cat-cow, forward bends, gentle twists",
          "Breathwork: Alternate nostril, Bhramari",
          "Meditation: Grounding mantra meditation"
        ]
      },
      {
        name: "Mind-Body Connection",
        items: [
          "Practice meditation or mindfulness to calm the mind.",
          "Cultivate patience and forgiveness.",
          "Avoid arguments and intense debates.",
          "Engage in creative outlets that are not overly stimulating."
        ]
      }
    ]
  },
  "Kapha" => {
    description: "A Kapha-balancing plan prioritizes stimulation and regular movement to counteract sluggishness. Eat light, warm, and spicy foods, engage in vigorous daily exercise, and actively seek out new and exciting experiences.",
    sections: [
      {
        name: "Focus Areas",
        items: [
          "Sleep: Deeper rest",
          "Digestion: Improve Agni",
          "Energy: Maintain balance",
          "Emotions: Reduce anxiety"
        ]
      },
      {
        name: "Morning Routine",
        items: [
          "Wake up early (before 6 AM).",
          "Drink warm water with honey and ginger.",
          "Perform dry brushing (garshana).",
          "Vigorous exercise for 30-45 minutes.",
          "Tongue scraping, oil pulling",
          "5 min Pranayama",
          "Warm, grounding breakfast"
        ]
      },
      {
        name: "Midday Routine",
        items: [
          "Largest meal (12–1pm)",
          "Brahmi tea",
          "5-min walk + breathwork"
        ]
      },
      {
        name: "Evening Routine",
        items: [
          "Abhyanga massage",
          "Gentle yoga / meditation",
          "Sleep prep (10pm)"
        ]
      },
      {
        name: "Dietary Guidelines",
        items: [
          "Favor warm, light, dry, and pungent foods.",
          "Avoid cold, heavy, oily, and sweet foods.",
          "Eat smaller meals and avoid snacking.",
          "Include plenty of fresh vegetables and legumes.",
          "Spices: ginger, black pepper, cayenne, turmeric."
        ]
      },
      {
        name: "Foods to Favor",
        items: [
          "Warm soups",
          "root veggies",
          "ghee",
          "dates"
        ]
      },
      {
        name: "Foods to Avoid",
        items: [
          "Cold salads",
          "raw nuts",
          "excess coffee"
        ]
      },
      {
        name: "Herbal Remedies",
        items: [
          "Ashwagandha: 500mg, nourishes majja dhatu",
          "Brahmi: calming, supports concentration",
          "Triphala: gentle detox, supports digestion"
        ]
      },
      {
        name: "Lifestyle Practices",
        items: [
          "Stay active and avoid prolonged sitting.",
          "Seek out new experiences and challenges.",
          "Avoid excessive napping during the day.",
          "Engage in stimulating activities and social interaction.",
          "Yoga: Cat-cow, forward bends, gentle twists",
          "Breathwork: Alternate nostril, Bhramari",
          "Meditation: Grounding mantra meditation"
        ]
      },
      {
        name: "Mind-Body Connection",
        items: [
          "Practice invigorating yoga or exercise.",
          "Engage in stimulating intellectual activities.",
          "Avoid emotional eating and attachment.",
          "Cultivate enthusiasm and motivation."
        ]
      }
    ]
  }
}

dosha_map = {
  "Vata" => vata_dosha,
  "Pitta" => pitta_dosha,
  "Kapha" => kapha_dosha
}

dosha_healing_plans_data.each do |dosha_name, data|
  dosha = dosha_map[dosha_name]
  puts "Creating Healing Plan Template for #{dosha_name}..."

  healing_plan_template = HealingPlanTemplate.find_or_initialize_by(
    name: "#{dosha_name} Balancing Plan"
  )
  healing_plan_template.description = data[:description]
  healing_plan_template.dosha = dosha
  healing_plan_template.save!

  data[:sections].each_with_index do |section_data, section_index|
    section_template = healing_plan_template.plan_section_templates.find_or_initialize_by(
      name: section_data[:name]
    )
    section_template.ordering = section_index + 1
    section_template.save!

    section_data[:items].each_with_index do |item_content, item_index|
      item_template = section_template.plan_item_templates.find_or_initialize_by(
        content: item_content
      )
      item_template.ordering = item_index + 1
      item_template.save!
    end
  end
end

puts "Healing Plan Templates seeded successfully!"
