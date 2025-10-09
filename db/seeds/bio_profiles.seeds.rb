# Populate BioProfile details with modern biohacking approach
nervous_system_profile = BioProfile.find_or_initialize_by(name: BioProfile::NERVOUS_SYSTEM)
nervous_system_profile.color = "blue"
nervous_system_profile.archetype_info = {
  archetype: "Innovator / Creative",
  elements: "Air and Space",
  primary_traits: "Light, mobile, creative, adaptable, high-strung"
}
nervous_system_profile.people_manifestation = {
  body_type: "Lean frame, dry skin, cold extremities",
  emotions: "Anxious, excited, scattered, imaginative",
  energy: "Bursts of creativity, fatigue comes quickly",
  careers: "Artist, entrepreneur, writer, designer, consultant"
}
nervous_system_profile.general_recommendations = "Optimize nervous system regulation through consistent routines and stress management protocols. Focus on grounding practices, regular sleep schedules, and nervous system support supplements. Establish circadian rhythm consistency with regular meal times, sleep timing, and movement patterns. Practice stress-reduction techniques like meditation and breathwork. Support with adaptogenic herbs and healthy fats for nervous system health."
nervous_system_profile.save!

metabolic_profile = BioProfile.find_or_initialize_by(name: BioProfile::METABOLIC)
metabolic_profile.color = "red"
metabolic_profile.archetype_info = {
  archetype: "Leader / Strategist",
  elements: "Fire and Water",
  primary_traits: "Intense, focused, driven, competitive, high-energy"
}
metabolic_profile.people_manifestation = {
  body_type: "Athletic build, warm body temperature, sharp features",
  emotions: "Ambitious, determined, competitive, intense",
  energy: "High and sustained, prone to burnout from overwork",
  careers: "Executive, surgeon, engineer, strategist, athlete"
}
metabolic_profile.general_recommendations = "Optimize metabolic function and reduce inflammation through cooling protocols and stress management. Focus on anti-inflammatory nutrition, regular recovery practices, and temperature regulation. Incorporate moderate, non-competitive exercise and cooling activities. Practice stress-reduction techniques and avoid excessive heat exposure. Support with cooling supplements and anti-inflammatory compounds for metabolic optimization."
metabolic_profile.save!

structural_profile = BioProfile.find_or_initialize_by(name: BioProfile::STRUCTURAL)
structural_profile.color = "green"
structural_profile.archetype_info = {
  archetype: "Builder / Stabilizer",
  elements: "Earth and Water",
  primary_traits: "Stable, nurturing, methodical, consistent, grounded"
}
structural_profile.people_manifestation = {
  body_type: "Solid build, soft skin, steady metabolism",
  emotions: "Calm, loyal, loving, but prone to lethargy or resistance to change",
  energy: "Consistent, slow to start but long-lasting",
  careers: "Counselor, teacher, healthcare worker, builder, organizer"
}
structural_profile.general_recommendations = "Optimize structural health and energy through stimulation protocols and metabolic enhancement. Focus on light, warming nutrition and regular vigorous exercise. Incorporate variety and new experiences to prevent stagnation. Establish early morning routines and avoid excessive rest periods. Support with energizing supplements and metabolism-boosting compounds for structural optimization and energy enhancement."
structural_profile.save!

