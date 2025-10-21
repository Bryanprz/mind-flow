# Create a first admin user
admin_user = User.find_or_create_by!(email_address: 'b@b') do |user|
  user.name = 'Bryan Perez'
  user.password = 'asdfasdf'
  user.password_confirmation = 'asdfasdf'
  user.admin = true
end

if admin_user.previously_new_record?
  puts "Created admin user b@b."
else
  puts "Admin user b@b already exists."
end

# Create a second test user
hector = User.find_or_create_by!(email_address: 'h@h') do |user|
  user.name = 'Hector'
  user.password = 'asdfasdf'
  user.password_confirmation = 'asdfasdf'
end

if hector.previously_new_record?
  puts "Created test user h@h."
else
  puts "Test user h@h already exists."
end
