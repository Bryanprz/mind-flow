# Create Users
ava = User.find_or_create_by!(email_address: "ava@example.com") do |user|
  user.password = "password"
  user.name = "Ava Lopez"
end

jamal = User.find_or_create_by!(email_address: "jamal@example.com") do |user|
  user.password = "password"
  user.name = "Jamal Singh"
end

rina = User.find_or_create_by!(email_address: "rina@example.com") do |user|
  user.password = "password"
  user.name = "Rina Kapoor"
end

marta = User.find_or_create_by!(email_address: "marta@example.com") do |user|
  user.password = "password"
  user.name = "Marta Torres"
end

theo = User.find_or_create_by!(email_address: "theo@example.com") do |user|
  user.password = "password"
  user.name = "Theo Kim"
end

# Create Social Posts
SocialPost.find_or_create_by!(user: ava, content: "Day 10 on the new herbal routine. Energy is up and sleep is deeper. Anyone else notice fewer afternoon slumps?")
SocialPost.find_or_create_by!(user: jamal, content: "Tried the ginger-turmeric tea before workouts. Warm-up feels smoother and joints are happier.")
SocialPost.find_or_create_by!(user: rina, content: "Swapped afternoon coffee for lemon balm + mint. Calmer focus, fewer jitters. Highly recommend!")
SocialPost.find_or_create_by!(user: marta, content: "Weekend farmer's market haul. Any recipe ideas for fresh chamomile and nettle?")
SocialPost.find_or_create_by!(user: theo, content: "Micro-dosing adaptogens has helped me handle meetings better. Small changes, big impact.")