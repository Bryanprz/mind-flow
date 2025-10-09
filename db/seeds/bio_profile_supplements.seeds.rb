# Populate BioProfileSupplement details with modern scientific approach
nervous_system_profile = BioProfile.find_by(name: BioProfile::NERVOUS_SYSTEM)
metabolic_profile = BioProfile.find_by(name: BioProfile::METABOLIC)
structural_profile = BioProfile.find_by(name: BioProfile::STRUCTURAL)

# Nervous System Profile Supplements
BioProfileSupplement.find_or_create_by!(bio_profile: nervous_system_profile, name: "Ashwagandha", description: "Adaptogenic herb (500mg daily) that regulates cortisol levels, supports stress response, and enhances sleep quality. Supports nervous system health and cellular regeneration.")
BioProfileSupplement.find_or_create_by!(bio_profile: nervous_system_profile, name: "Ginger", description: "Warming adaptogen (1-3g daily) that stimulates circulation, supports digestive function, and provides metabolic support for nervous system optimization.")
BioProfileSupplement.find_or_create_by!(bio_profile: nervous_system_profile, name: "Triphala", description: "Digestive support blend (1-2g daily) that promotes regular elimination and supports healthy digestive system function for nervous system health.")
BioProfileSupplement.find_or_create_by!(bio_profile: nervous_system_profile, name: "Licorice Root", description: "Adaptogenic herb (300-600mg daily) that supports adrenal function and helps maintain stable energy levels throughout the day.")
BioProfileSupplement.find_or_create_by!(bio_profile: nervous_system_profile, name: "Chamomile", description: "Nervous system support herb (400-800mg daily) that promotes relaxation and supports healthy sleep patterns through GABA modulation.")

# Metabolic Profile Supplements
BioProfileSupplement.find_or_create_by!(bio_profile: metabolic_profile, name: "Amla", description: "High-potency antioxidant (1-3g daily) that supports metabolic cooling, reduces inflammation, and promotes healthy digestive system function.")
BioProfileSupplement.find_or_create_by!(bio_profile: metabolic_profile, name: "Mint", description: "Cooling herb (2-4g daily) that supports temperature regulation, soothes digestive inflammation, and provides metabolic cooling support.")
BioProfileSupplement.find_or_create_by!(bio_profile: metabolic_profile, name: "Shatavari", description: "Adaptogenic herb (500-1000mg daily) that supports metabolic balance, reduces inflammation, and provides rejuvenating properties for metabolic optimization.")
BioProfileSupplement.find_or_create_by!(bio_profile: metabolic_profile, name: "Turmeric", description: "Anti-inflammatory compound (500-1000mg daily) that supports metabolic health, reduces inflammation markers, and promotes healthy metabolic function.")
BioProfileSupplement.find_or_create_by!(bio_profile: metabolic_profile, name: "Coriander", description: "Cooling herb (1-2g daily) that supports metabolic cooling, aids digestion, and helps regulate metabolic temperature for optimal function.")

# Structural Profile Supplements
BioProfileSupplement.find_or_create_by!(bio_profile: structural_profile, name: "Turmeric", description: "Anti-inflammatory compound (500-1000mg daily) that supports structural health, promotes detoxification, and helps optimize structural function and mobility.")
BioProfileSupplement.find_or_create_by!(bio_profile: structural_profile, name: "Ginger", description: "Warming herb (1-3g daily) that stimulates metabolism, supports digestive function, and helps with structural health and respiratory support.")
BioProfileSupplement.find_or_create_by!(bio_profile: structural_profile, name: "Cinnamon", description: "Metabolism-boosting spice (1-2g daily) that supports structural health, improves circulation, and enhances metabolic function for structural optimization.")
BioProfileSupplement.find_or_create_by!(bio_profile: structural_profile, name: "Bibhitaki", description: "Structural support herb (500-1000mg daily) that promotes structural health and supports optimal structural function and mobility.")
BioProfileSupplement.find_or_create_by!(bio_profile: structural_profile, name: "Chitrak", description: "Digestive support herb (300-600mg daily) that enhances digestive function and supports structural health through improved nutrient absorption and metabolic support.")
