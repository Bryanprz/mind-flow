# Create a sample public room for testing
general_room = Room.find_or_create_by!(name: "General Discussion") do |room|
  room.description = "A place for general wellness discussions"
  room.room_type = 'public'
end

# Add all existing users to the general room
User.find_each do |user|
  general_room.users << user unless general_room.users.include?(user)
end

if general_room.previously_new_record?
  puts "Created General Discussion room with #{general_room.users.count} members"
else
  puts "General Discussion room already exists with #{general_room.users.count} members"
end

# Create a wellness tips room
tips_room = Room.find_or_create_by!(name: "Wellness Tips") do |room|
  room.description = "Share and discover wellness tips and practices"
  room.room_type = 'public'
end

# Add all existing users to the tips room
User.find_each do |user|
  tips_room.users << user unless tips_room.users.include?(user)
end

if tips_room.previously_new_record?
  puts "Created Wellness Tips room with #{tips_room.users.count} members"
else
  puts "Wellness Tips room already exists with #{tips_room.users.count} members"
end
