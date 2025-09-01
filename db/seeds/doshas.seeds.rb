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
kapha_dosha.save!

