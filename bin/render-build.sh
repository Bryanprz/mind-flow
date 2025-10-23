#!/usr/bin/env bash
set -o errexit

echo "Installing dependencies..."
bundle install

echo "Running database migrations..."
bundle exec rails db:migrate db:seed

echo "Precompiling assets..."
bundle exec rails assets:precompile
