vikruti_health_assessment = HealthAssessment.find_or_initialize_by(assessment_type: :vikruti)
vikruti_health_assessment.name = 'Vikruti Assessment'
vikruti_health_assessment.description = 'Vikruti (current elemental imbalance) self-assessment'
vikruti_health_assessment.save!

prakruti_health_assessment = HealthAssessment.find_or_initialize_by(assessment_type: :prakruti)
prakruti_health_assessment.name = 'Prakruti Assessment'
prakruti_health_assessment.description = 'Prakruti (original elemental nature) self-assessment'
prakruti_health_assessment.save!

if prakruti_health_assessment.assessment_questions.none?
  puts "Importing Prakruti questions..."
  Rake::Task['import:prakruti_questions'].invoke
end

if vikruti_health_assessment.assessment_questions.none?
  puts "Importing Vikruti questions..."
  Rake::Task['import:vikruti_questions'].invoke
end

