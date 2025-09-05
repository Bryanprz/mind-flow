# frozen_string_literal: true

puts "Seeding chronic illnesses..."

chronic_illnesses = [
  { name: "Obesity", description: "A complex disease involving an excessive amount of body fat.", icon: "obesity.png" },
  { name: "Hypertension", description: "A condition in which the force of the blood against the artery walls is too high.", icon: "hypertension.png" },
  { name: "Depression", description: "A mood disorder causing a persistent feeling of sadness and loss of interest.", icon: "depression.png" },
  { name: "Diabetes", description: "A disease in which the body’s ability to produce or respond to the hormone insulin is impaired, resulting in abnormal metabolism of carbohydrates and elevated levels of glucose in the blood and urine.", icon: "diabetes.png" },
  { name: "Arthritis", description: "Inflammation of one or more joints, causing pain and stiffness that can worsen with age.", icon: "arthritis.png" },
  { name: "Alzheimer's Disease", description: "A progressive disorder that causes brain cells to waste away (degenerate) and die.", icon: "alzheimers.png" },
  { name: "Asthma", description: "A condition in which your airways narrow and swell and may produce extra mucus.", icon: "asthma.png" },
  { name: "Cancer", description: "A disease in which some of the body’s cells grow uncontrollably and spread to other parts of the body.", icon: "cancer.png" },
  { name: "Cardiovascular Disease", description: "A general term for conditions affecting the heart or blood vessels.", icon: "cardiovascular.png" },
  { name: "Heart Disease", description: "Heart conditions that include diseased vessels, structural problems, and blood clots.", icon: "heart_disease.png" },
  { name: "Chronic Kidney Disease", description: "A condition in which the kidneys are damaged and cannot filter blood as well as they should.", icon: "chronic_kidney_disease.png" },
  { name: "Chronic Obstructive Pulmonary Disease", description: "A chronic inflammatory lung disease that causes obstructed airflow from the lungs.", icon: "chronic_obstructive_pulmonary_disease.png" },
  { name: "Stroke", description: "A disease that affects the arteries leading to and within the brain.", icon: "stroke.png" },
  { name: "Addiction", description: "A treatable, chronic medical disease involving complex interactions among brain circuits, genetics, the environment, and an individual’s life experiences.", icon: "addiction.png" },
  { name: "ALS (Lou Gehrig's Disease)", description: "A progressive neurodegenerative disease that affects nerve cells in the brain and the spinal cord.", icon: "als.png" },
  { name: "Anxiety", description: "An emotion characterized by feelings of tension, worried thoughts and physical changes like increased blood pressure.", icon: "anxiety.png" },
  { name: "Atrial Fibrillation", description: "An irregular and often very rapid heart rhythm (arrhythmia) that can lead to blood clots in the heart.", icon: "atrial_fibrillation.png" },
  { name: "Autism Spectrum Disorders", description: "A developmental disability caused by differences in the brain.", icon: "autism.png" },
  { name: "Crohn's Disease", description: "A type of inflammatory bowel disease (IBD) that causes inflammation of your digestive tract.", icon: "crohns_disease.png" },
  { name: "Cystic Fibrosis", description: "A progressive, genetic disease that causes persistent lung infections and limits the ability to breathe over time.", icon: "cystic_fibrosis.png" },
  { name: "Epilepsy", description: "A central nervous system (neurological) disorder in which brain activity becomes abnormal, causing seizures or periods of unusual behavior, sensations, and sometimes loss of awareness.", icon: "epilepsy.png" },
  { name: "Hepatitis C", description: "A liver infection caused by the hepatitis C virus (HCV).", icon: "hepatitis_c.png" },
  { name: "High Cholesterol", description: "A condition in which you have too many lipids (fats) in your blood.", icon: "high_cholesterol.png" },
  { name: "HIV/AIDS", description: "A chronic, potentially life-threatening condition caused by the human immunodeficiency virus (HIV). Acquired immunodeficiency syndrome (AIDS) is the late stage of infection with HIV.", icon: "hiv_aids.png" },
  { name: "Osteoporosis", description: "A bone disease that develops when bone mineral density and bone mass decreases, or when the quality or structure of bone changes.", icon: "osteoporosis.png" },
  { name: "Parkinson's Disease", description: "A progressive disorder that affects the nervous system and the parts of the body controlled by the nerves.", icon: "parkinsons_disease.png" },
  { name: "Chronic Liver Disease", description: "A range of conditions that affect the liver, including Fatty Liver and Cirrhosis.", icon: "chronic_liver_disease.png" },
  { name: "Thyroid Disorders", description: "Conditions that affect the thyroid gland, such as Hypothyroidism and Hyperthyroidism.", icon: "thyroid.png" }
]

chronic_illnesses.each do |illness_data|
  illness = ChronicIllness.find_or_initialize_by(name: illness_data[:name])
  illness.description = illness_data[:description]
  illness.icon = illness_data[:icon]
  illness.save!
end

puts "Chronic illnesses seeded."
