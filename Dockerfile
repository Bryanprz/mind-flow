# syntax = docker/dockerfile:1

# Make sure RUBY_VERSION matches the Ruby version in .ruby-version and Gemfile
ARG RUBY_VERSION=3.3.0
FROM ruby:$RUBY_VERSION-slim

# Install dependencies
RUN apt-get update -qq && \
    apt-get install -y build-essential libsqlite3-dev && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /rails

# Set production environment
ENV RAILS_ENV=production \
    RAILS_SERVE_STATIC_FILES=true \
    RAILS_LOG_TO_STDOUT=true

# Install gems
COPY Gemfile Gemfile.lock ./
RUN bundle install

# Copy application code
COPY . .

# Precompile bootsnap code for faster boot times
RUN bundle exec bootsnap precompile app/ lib/


# DEBUG: Show Tailwind version and environment
RUN bundle exec rails tailwindcss:version || echo "No version command"
RUN echo "NODE_ENV: $NODE_ENV, RAILS_ENV: $RAILS_ENV"

# Build Tailwind CSS in DEVELOPMENT MODE
RUN NODE_ENV=development RAILS_ENV=production SECRET_KEY_BASE=dummy_secret bundle exec rails tailwindcss:build

# DEBUG: Check what was actually built
RUN ls -la app/assets/builds/
RUN head -50 app/assets/builds/tailwind.css
RUN grep -c "\.w-4\|\.h-4\|\.mt-20" app/assets/builds/tailwind.css || echo "Target classes NOT found"
RUN wc -l app/assets/builds/tailwind.css


# Precompile assets with dummy secret
RUN RAILS_ENV=production SECRET_KEY_BASE=dummy_secret bundle exec rails assets:precompile

# DEBUG: Check final compiled assets
RUN find public/assets -name "*tailwind*" -exec wc -l {} \;

# Start the server
CMD ["bin/rails", "server"]
