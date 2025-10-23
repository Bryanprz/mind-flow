#!/usr/bin/env bash
set -o errexit

echo "Installing dependencies..."
bundle install

echo "Installing Node.js dependencies..."
npm install

echo "Loading database schema..."
DISABLE_DATABASE_ENVIRONMENT_CHECK=1 bundle exec rails db:schema:load db:seed

echo "Precompiling assets..."
bundle exec rails assets:precompile
