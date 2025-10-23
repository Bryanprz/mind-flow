#!/usr/bin/env bash
set -o errexit

echo "Installing dependencies..."
bundle install

echo "Resetting database..."
bundle exec rails db:reset:all db:seed

echo "Precompiling assets..."
bundle exec rails assets:precompile
