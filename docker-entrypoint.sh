#!/bin/bash
set -e

# This script runs on every container start.
# We check for the existence of the database files in the persistent volume.
# If it doesn't exist, it's the first time the app is starting, so we prepare the databases.

if [ ! -f /rails/storage/production.sqlite3 ] && \
   [ ! -f /rails/storage/production_cache.sqlite3 ] && \
   [ ! -f /rails/storage/production_queue.sqlite3 ] && \
   [ ! -f /rails/storage/production_cable.sqlite3 ]; then
  echo "Database not found. Preparing databases for the first time..."
  # db:prepare creates the database, loads the schema, and runs pending migrations.
  # It should handle all databases configured in database.yml.
  RAILS_ENV=production bundle exec rails db:prepare
else
  echo "Database found. Skipping setup."
fi

exec "$@"
