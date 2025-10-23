#!/usr/bin/env bash
set -o errexit

echo "Installing dependencies..."
bundle install

echo "Loading database schema..."
bundle exec rails db:schema:load db:seed

echo "Precompiling assets..."
bundle exec rails assets:precompile
