# Create a sample public room for testing
if Room.where(name: "General Discussion").empty?
  general_room = Room.create!(
    name: "General Discussion",
    description: "A place for general wellness discussions",
    room_type: 'public'
  )
  
  # Add all existing users to the general room
  User.find_each do |user|
    general_room.users << user unless general_room.users.include?(user)
  end
  
  puts "Created General Discussion room with #{general_room.users.count} members"
end

# Create a wellness tips room
if Room.where(name: "Wellness Tips").empty?
  tips_room = Room.create!(
    name: "Wellness Tips",
    description: "Share and discover wellness tips and practices",
    room_type: 'public'
  )
  
  # Add all existing users to the tips room
  User.find_each do |user|
    tips_room.users << user unless tips_room.users.include?(user)
  end
  
  puts "Created Wellness Tips room with #{tips_room.users.count} members"
end
