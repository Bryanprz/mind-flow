# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# Ensure at least one quiz exists
if Quiz.find_by(category: 'prakruti').nil?
  Quiz.create!(category: 'prakruti', title: 'Prakruti Quiz')
  puts "Created Prakruti Quiz"
end

if Quiz.find_by(category: 'vikruti').nil?
  Quiz.create!(category: 'vikruti', title: 'Vikruti Quiz')
  puts "Created Vikruti Quiz"
end