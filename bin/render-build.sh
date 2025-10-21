#!/usr/bin/env bash
set -o errexit

echo "Installing dependencies..."
bundle install

echo "Running database migrations..."
bundle exec rails db:migrate

echo "Precompiling assets..."
bundle exec rails assets:precompile
