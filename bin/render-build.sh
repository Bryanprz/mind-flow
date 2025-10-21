#!/usr/bin/env bash
set -o errexit

echo "Installing dependencies..."
bundle install

echo "Resetting database..."
bundle exec rails db:drop db:create db:migrate db:seed

echo "Precompiling assets..."
bundle exec rails assets:precompile
