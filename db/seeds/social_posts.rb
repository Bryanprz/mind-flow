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

# Create Social Posts (only if they don't exist)
post_contents = [
  "Day 10 on the new herbal routine. Energy is up and sleep is deeper. Anyone else notice fewer afternoon slumps?",
  "Tried the ginger-turmeric tea before workouts. Warm-up feels smoother and joints are happier.",
  "Swapped afternoon coffee for lemon balm + mint. Calmer focus, fewer jitters. Highly recommend!",
  "Weekend farmer's market haul. Any recipe ideas for fresh chamomile and nettle?",
  "Micro-dosing adaptogens has helped me handle meetings better. Small changes, big impact."
]

users = [ava, jamal, rina, marta, theo]

users.each_with_index do |user, index|
  content = post_contents[index]
  
  # Check if user already has a post with this content
  existing_post = SocialPost.joins(:rich_text_content)
                           .where(user: user)
                           .where('action_text_rich_texts.body LIKE ?', "%#{content[0..50]}%")
                           .first
  
  unless existing_post
    post = SocialPost.create!(
      user: user,
      content: content,
      published_at: Time.current
    )
  end
end