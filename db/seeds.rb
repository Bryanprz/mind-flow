require_relative 'seeds_data.rb'

Quiz.find_or_create_by!(category: 'vikruti') do |quiz|
  quiz.title = 'Vikruti Quiz'
  quiz.description = 'Vikruti (current elemental imbalance) self-assessment quiz'
end

prakruti_quiz = Quiz.find_or_create_by!(category: 'prakruti') do |quiz|
  quiz.title = 'Prakruti Quiz'
  quiz.description = 'Prakruti (original elemental nature) self-assessment quiz'
end

if prakruti_quiz.questions.none?
  PRAKRUTI_QUESTIONS_DATA.each do |question_data|
    question = Question.create!(quiz: prakruti_quiz, text: question_data[:text], points: question_data[:points])
    question_data[:options].each do |option_data|
      QuizOption.create!(question: question, text: option_data[:text], dosha: option_data[:dosha])
    end
  end
end

# Populate Dosha details from Chapter 4 of the PDF
Dosha.find_or_create_by!(name: 'vata') do |dosha|
  dosha.archetype_info = {
    archetype: "Mystic / Visionary",
    elements: "Space and Air",
    primary_traits: "Light, dry, mobile, creative, erratic"
  }
  dosha.people_manifestation = {
    body_type: "Thin frame, dry skin, cold hands/feet",
    emotions: "Anxious, excited, scattered, imaginative",
    energy: "Bursts of creativity, fatigue comes quickly",
    careers: "Artist, dancer, musician, writer, entrepreneur, traveler"
  }
end

Dosha.find_or_create_by!(name: 'pitta') do |dosha|
  dosha.archetype_info = {
    archetype: "Warrior / Reformer",
    elements: "Fire and Water",
    primary_traits: "Hot, sharp, intense, focused"
  }
  dosha.people_manifestation = {
    body_type: "Medium build, warm body temperature, sharp features",
    emotions: "Anger, ambition, courage, determination",
    energy: "Steady and intense, can burn out from overwork",
    careers: "Lawyer, police, surgeon, manager, strategist, engineer"
  }
end

Dosha.find_or_create_by!(name: 'kapha') do |dosha|
  dosha.archetype_info = {
    archetype: "Nurturer / Preserver",
    elements: "Earth and Water",
    primary_traits: "Heavy, stable, nurturing, calm"
  }
  dosha.people_manifestation = {
    body_type: "Sturdy build, soft skin, slow digestion",
    emotions: "Calm, loyal, loving, but prone to lethargy or sadness",
    energy: "Consistent, slow to start but long-lasting",
    careers: "Counselor, caregiver, teacher, chef, social worker"
  }
end

# Disease Stages
DiseaseStage.find_or_create_by!(formation_stage: 1) do |stage|
  stage.name = "Accumulation"
  stage.description = "Bio-energies begin to build up in their natural sites due to improper lifestyle or sensory use, causing mild early-warning symptoms like gas, acid buildup, or heaviness that can be easily reversed with simple lifestyle changes."
end

DiseaseStage.find_or_create_by!(formation_stage: 2) do |stage|
  stage.name = "Aggravation"
  stage.description = "The bio-energies overflow from their original sites into nearby organs as disease-causing factors persist, intensifying symptoms like pain (Vata), burning sensations (Pitta), or itchiness (Kapha)."
end

DiseaseStage.find_or_create_by!(formation_stage: 3) do |stage|
  stage.name = "Spreading"
  stage.description = "Aggravated bio-energies move beyond their original sites and enter general circulation, sometimes carrying toxins, causing systemic symptoms like widespread aches, body-wide heat, or overall sluggishness."
end

DiseaseStage.find_or_create_by!(formation_stage: 4) do |stage|
  stage.name = "Localization"
  stage.description = "The spreading bio-energies settle into weak or vulnerable areas of the body, marking the shift from energy imbalance to early disease with localized symptoms like joint cracking, inflammation, or edema in specific areas."
end

DiseaseStage.find_or_create_by!(formation_stage: 5) do |stage|
  stage.name = "Manifestation"
  stage.description = "Bio-energies fully express in weak tissues causing functional damage and clear disease symptoms, as the disease gains strength and begins to act with its own intelligence in the body's vulnerable points."
end

DiseaseStage.find_or_create_by!(formation_stage: 6) do |stage|
  stage.name = "Complication"
  stage.description = "The disease deepens with structural damage, symptom evolution, and involvement of other tissues, becoming more chronic and severe - such as joint pain progressing to osteoporosis or inflammation leading to hemorrhoids."
end

puts "Seeds file has been run."
