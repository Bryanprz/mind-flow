#!/bin/bash
set -e

# Set up the database if it doesn't already exist
if [ ! -f /app/db/production.sqlite3 ]; then
  echo "Setting up database..."
  RAILS_ENV=production bundle exec rails db:create db:migrate
fi

# Set up the Solid Cable database
if [ ! -f /app/db/production_cable.sqlite3 ]; then
  echo "Setting up Solid Cable database..."
  RAILS_ENV=production bundle exec rails solid_cable:setup
fi

# Set up the Solid Cache database
if [ ! -f /app/db/production_cache.sqlite3 ]; then
  echo "Setting up Solid Cache database..."
  RAILS_ENV=production bundle exec rails solid_cache:setup
fi

# Set up the Solid Queue database
if [ ! -f /app/db/production_queue.sqlite3 ]; then
  echo "Setting up Solid Queue database..."
  RAILS_ENV=production bundle exec rails solid_queue:setup
fi

# Run migrations for all databases
RAILS_ENV=production bundle exec rails migrate_all

# Execute the CMD from the Dockerfile
exec "$@"
