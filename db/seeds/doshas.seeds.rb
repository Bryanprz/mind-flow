# Populate Dosha details from Chapter 4 of the PDF
vata_dosha = Dosha.find_or_initialize_by(name: Dosha::VATA)
vata_dosha.color = "blue"
vata_dosha.archetype_info = {
  archetype: "Mystic / Visionary",
  elements: "Space and Air",
  primary_traits: "Light, dry, mobile, creative, erratic"
}
vata_dosha.people_manifestation = {
  body_type: "Thin frame, dry skin, cold hands/feet",
  emotions: "Anxious, excited, scattered, imaginative",
  energy: "Bursts of creativity, fatigue comes quickly",
  careers: "Artist, dancer, musician, writer, entrepreneur, traveler"
}
vata_dosha.general_recommendations = "To counterbalance Vata's cool, dry, and light nature, favor warm, moist, and grounding foods. Consistency and routine are key to pacifying Vata. Establish regular times for meals, sleep, and exercise. Practice calming activities like meditation and gentle yoga. Daily self-massage with warming oils like sesame or almond can be deeply nourishing."
vata_dosha.save!

pitta_dosha = Dosha.find_or_initialize_by(name: Dosha::PITTA)
pitta_dosha.color = "red"
pitta_dosha.archetype_info = {
  archetype: "Warrior / Reformer",
  elements: "Fire and Water",
  primary_traits: "Hot, sharp, intense, focused"
}
pitta_dosha.people_manifestation = {
  body_type: "Medium build, warm body temperature, sharp features",
  emotions: "Anger, ambition, courage, determination",
  energy: "Steady and intense, can burn out from overwork",
  careers: "Lawyer, police, surgeon, manager, strategist, engineer"
}
pitta_dosha.general_recommendations = "To cool Pitta's fiery nature, opt for cooling, refreshing, and moderately heavy foods. Moderation and coolness are essential for balancing Pitta. Incorporate regular, non-competitive exercise into your routine. Spend time in nature and practice calming activities like meditation. Avoid excessive heat and overworking."
pitta_dosha.save!

kapha_dosha = Dosha.find_or_initialize_by(name: Dosha::KAPHA)
kapha_dosha.color = "green"
kapha_dosha.archetype_info = {
  archetype: "Nurturer / Preserver",
  elements: "Earth and Water",
  primary_traits: "Heavy, stable, nurturing, calm"
}
kapha_dosha.people_manifestation = {
  body_type: "Sturdy build, soft skin, slow digestion",
  emotions: "Calm, loyal, loving, but prone to lethargy or sadness",
  energy: "Consistent, slow to start but long-lasting",
  careers: "Counselor, caregiver, teacher, chef, social worker"
}
kapha_dosha.general_recommendations = "To offset Kapha's heavy, oily, and cool qualities, favor light, warm, and dry foods. Stimulation and variety are key to balancing Kapha. Incorporate regular, vigorous exercise into your daily routine. Vary your routines and seek out new experiences. It's beneficial to wake up early, before sunrise, and avoid daytime naps."
kapha_dosha.save!

