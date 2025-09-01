# Disease Stages
stage1 = DiseaseStage.find_or_initialize_by(formation_stage: 1)
stage1.name = "Accumulation"
stage1.description = "Bio-energies begin to build up in their natural sites due to improper lifestyle or sensory use, causing mild early-warning symptoms like gas, acid buildup, or heaviness that can be easily reversed with simple lifestyle changes."
stage1.save!

stage2 = DiseaseStage.find_or_initialize_by(formation_stage: 2)
stage2.name = "Aggravation"
stage2.description = "The bio-energies overflow from their original sites into nearby organs as disease-causing factors persist, intensifying symptoms like pain (Vata), burning sensations (Pitta), or itchiness (Kapha)."
stage2.save!

stage3 = DiseaseStage.find_or_initialize_by(formation_stage: 3)
stage3.name = "Spreading"
stage3.description = "Aggravated bio-energies move beyond their original sites and enter general circulation, sometimes carrying toxins, causing systemic symptoms like widespread aches, body-wide heat, or overall sluggishness."
stage3.save!

stage4 = DiseaseStage.find_or_initialize_by(formation_stage: 4)
stage4.name = "Localization"
stage4.description = "The spreading bio-energies settle into weak or vulnerable areas of the body, marking the shift from energy imbalance to early disease with localized symptoms like joint cracking, inflammation, or edema in specific areas."
stage4.save!

stage5 = DiseaseStage.find_or_initialize_by(formation_stage: 5)
stage5.name = "Manifestation"
stage5.description = "Bio-energies fully express in weak tissues causing functional damage and clear disease symptoms, as the disease gains strength and begins to act with its own intelligence in the body's vulnerable points."
stage5.save!

stage6 = DiseaseStage.find_or_initialize_by(formation_stage: 6)
stage6.name = "Complication"
stage6.description = "The disease deepens with structural damage, symptom evolution, and involvement of other tissues, becoming more chronic and severe - such as joint pain progressing to osteoporosis or inflammation leading to hemorrhoids."
stage6.save!

