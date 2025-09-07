# Populate DoshaHealingHerb details
vata_dosha = Dosha.find_by(name: Dosha::VATA)
pitta_dosha = Dosha.find_by(name: Dosha::PITTA)
kapha_dosha = Dosha.find_by(name: Dosha::KAPHA)

# Vata Healing Herbs
DoshaHealingHerb.find_or_create_by!(dosha: vata_dosha, name: "Ashwagandha", description: "This adaptogenic herb helps the body manage stress, reduces anxiety, and promotes better sleep. Its warming nature helps to counteract Vata's cold quality.")
DoshaHealingHerb.find_or_create_by!(dosha: vata_dosha, name: "Ginger", description: "Known for its warming and stimulating properties, ginger aids digestion, improves circulation, and can alleviate bloating and constipation associated with Vata imbalance.")
DoshaHealingHerb.find_or_create_by!(dosha: vata_dosha, name: "Triphala", description: "A combination of three fruits, Triphala is beneficial for balancing Vata by supporting regular elimination and a healthy digestive system.")
DoshaHealingHerb.find_or_create_by!(dosha: vata_dosha, name: "Licorice Root", description: "This herb is calming and helps to maintain energy levels.")
DoshaHealingHerb.find_or_create_by!(dosha: vata_dosha, name: "Chamomile", description: "Known for its calming effects on the nervous system, chamomile is often used to promote relaxation.")

# Pitta Healing Herbs
DoshaHealingHerb.find_or_create_by!(dosha: pitta_dosha, name: "Amla", description: "Considered one of the best herbs for balancing Pitta, Amla helps to cool the body and supports a healthy digestive system.")
DoshaHealingHerb.find_or_create_by!(dosha: pitta_dosha, name: "Mint", description: "All varieties of mint are cooling and can help to soothe internal heat.")
DoshaHealingHerb.find_or_create_by!(dosha: pitta_dosha, name: "Shatavari", description: "This herb from the wild asparagus family helps to reduce Pitta and has rejuvenating properties.")
DoshaHealingHerb.find_or_create_by!(dosha: pitta_dosha, name: "Turmeric", description: "While warming, turmeric in moderation can be beneficial for Pitta due to its anti-inflammatory properties.")
DoshaHealingHerb.find_or_create_by!(dosha: pitta_dosha, name: "Coriander", description: "This herb is excellent for clearing irritating heat from the body and aiding digestion.")

# Kapha Healing Herbs
DoshaHealingHerb.find_or_create_by!(dosha: kapha_dosha, name: "Turmeric", description: "With its bitter, pungent, and astringent tastes, turmeric is an excellent detoxifying agent and helps to balance excess Kapha.")
DoshaHealingHerb.find_or_create_by!(dosha: kapha_dosha, name: "Ginger", description: "This warming herb stimulates digestion and can help with Kapha-related issues like sinusitis.")
DoshaHealingHerb.find_or_create_by!(dosha: kapha_dosha, name: "Cinnamon", description: "A warming and sweet spice, cinnamon helps to reduce Kapha in the respiratory system and improves circulation.")
DoshaHealingHerb.find_or_create_by!(dosha: kapha_dosha, name: "Bibhitaki", description: "This herb is known to help balance Kapha.")
DoshaHealingHerb.find_or_create_by!(dosha: kapha_dosha, name: "Chitrak", description: "The root of this plant is a potent digestive aid that helps to balance Kapha.")
