# syntax = docker/dockerfile:1

# Make sure RUBY_VERSION matches the Ruby version in .ruby-version and Gemfile
ARG RUBY_VERSION=3.3.0
FROM ruby:$RUBY_VERSION-slim

# Install dependencies including Node.js and libvips for image processing
RUN apt-get update -qq && \
    apt-get install -y build-essential libsqlite3-dev curl libvips libvips-dev libvips42 libvips-tools libvips-doc && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g npm@latest && \
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

# Copy package files and install Node dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy application code
COPY . .



# Precompile bootsnap code for faster boot times
RUN bundle exec bootsnap precompile app/ lib/

# Build Tailwind CSS (v3 uses different command)
RUN RAILS_ENV=production SECRET_KEY_BASE=dummy_secret bundle exec rails tailwindcss:build

# Precompile assets with dummy secret
RUN RAILS_ENV=production SECRET_KEY_BASE=dummy_secret bundle exec rails assets:precompile

# Start the server
CMD ["bin/rails", "server"]
