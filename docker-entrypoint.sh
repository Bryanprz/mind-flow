#!/bin/bash
set -e

# Set up the database if it doesn't already exist
if [ ! -f /app/db/production.sqlite3 ]; then
  echo "Setting up database..."
  RAILS_ENV=production bundle exec rails db:create db:migrate
fi

# Set up the Solid Cable database
if [ ! -f /app/db/cable.sqlite3 ]; then
  echo "Setting up Solid Cable database..."
  RAILS_ENV=production bundle exec rails solid_cable:setup
fi

# Execute the CMD from the Dockerfile
exec "$@"
