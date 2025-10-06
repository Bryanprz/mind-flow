# Seeds for the 7 Dhatus of Ayurveda
# Dhatus are the seven fundamental tissues of the body according to Ayurveda

puts "Seeding Dhatus..."

dhatus = [
  {
    name: "Rasa Dhatu",
    description: "The first dhatu, representing plasma, lymph, and extracellular fluid. It nourishes all other dhatus and carries nutrients throughout the body. Rasa dhatu is responsible for satisfaction, contentment, and proper circulation of nutrients. When imbalanced, it can lead to issues like edema, lymph congestion, and poor circulation."
  },
  {
    name: "Rakta Dhatu", 
    description: "The second dhatu, representing blood and red blood cells. It carries oxygen and nutrients to all tissues and removes waste products. Rakta dhatu is associated with vitality, complexion, and the fire element. Imbalances can manifest as blood disorders, skin problems, liver issues, and inflammatory conditions."
  },
  {
    name: "Mamsa Dhatu",
    description: "The third dhatu, representing muscle tissue and flesh. It provides strength, structure, and movement to the body. Mamsa dhatu is associated with courage, confidence, and the earth element. When imbalanced, it can lead to muscle weakness, tumors, cysts, and issues with the skin and lips."
  },
  {
    name: "Meda Dhatu",
    description: "The fourth dhatu, representing adipose tissue (fat). It provides lubrication, insulation, and energy storage. Meda dhatu is associated with stability, endurance, and the water element. Imbalances can manifest as obesity, diabetes, high cholesterol, and issues with the sweat glands and kidneys."
  },
  {
    name: "Asthi Dhatu",
    description: "The fifth dhatu, representing bone tissue and cartilage. It provides structure, support, and protection to the body. Asthi dhatu is associated with determination, courage, and the earth element. When imbalanced, it can lead to bone disorders, dental problems, joint issues, and problems with hair and nails."
  },
  {
    name: "Majja Dhatu",
    description: "The sixth dhatu, representing bone marrow and nervous tissue. It fills the bones and is responsible for the nervous system. Majja dhatu is associated with intelligence, memory, and the space element. Imbalances can manifest as neurological disorders, memory problems, bone marrow disorders, and issues with the joints."
  },
  {
    name: "Shukra Dhatu",
    description: "The seventh and final dhatu, representing reproductive tissue and sexual fluids. It is the essence of all other dhatus and responsible for reproduction and vitality. Shukra dhatu is associated with creativity, joy, and the water element. When imbalanced, it can lead to reproductive disorders, infertility, and a general loss of vitality and enthusiasm for life."
  }
]

dhatus.each do |dhatu_data|
  dhatu = Dhatu.find_or_create_by!(name: dhatu_data[:name]) do |d|
    d.description = dhatu_data[:description]
  end
  
  if dhatu.previously_new_record?
    puts "  Created #{dhatu.name}"
  else
    puts "  #{dhatu.name} already exists"
  end
end

puts "Dhatus seeding complete!"
