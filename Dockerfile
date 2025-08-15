# # syntax=docker/dockerfile:1
# # check=error=true
#
# # This Dockerfile is designed for production, not development. Use with Kamal or build'n'run by hand:
# # docker build -t ancientherb .
# # docker run -d -p 80:80 -e RAILS_MASTER_KEY=<value from config/master.key> --name ancientherb ancientherb
#
# # For a containerized dev environment, see Dev Containers: https://guides.rubyonrails.org/getting_started_with_devcontainer.html
#
# # Make sure RUBY_VERSION matches the Ruby version in .ruby-version
# ARG RUBY_VERSION=3.3.0
# FROM docker.io/library/ruby:$RUBY_VERSION-slim AS base
#
# # Rails app lives here
# WORKDIR /rails
#
# # Install base packages
# RUN apt-get update -qq && \
#     apt-get install --no-install-recommends -y curl libjemalloc2 libvips sqlite3 libsqlite3-dev && \
#     rm -rf /var/lib/apt/lists /var/cache/apt/archives
#
# # Set production environment
# ENV RAILS_ENV="production" \
#     BUNDLE_DEPLOYMENT="1" \
#     BUNDLE_PATH="/usr/local/bundle" \
#     BUNDLE_WITHOUT="development"
#
# # Throw-away build stage to reduce size of final image
# FROM base AS build
#
# # Install packages needed to build gems
# RUN apt-get update -qq && \
#     apt-get install --no-install-recommends -y build-essential git libyaml-dev pkg-config && \
#     rm -rf /var/lib/apt/lists /var/cache/apt/archives
#
# # Install application gems
# COPY Gemfile Gemfile.lock ./
# RUN bundle install && \
#     rm -rf ~/.bundle/ "${BUNDLE_PATH}"/ruby/*/cache "${BUNDLE_PATH}"/ruby/*/bundler/gems/*/.git && \
#     bundle exec bootsnap precompile --gemfile
#
# # Copy application code
# COPY . .
#
# # Precompile bootsnap code for faster boot times
# RUN bundle exec bootsnap precompile app/ lib/
#
# # Precompiling assets for production without requiring secret RAILS_MASTER_KEY
# RUN SECRET_KEY_BASE_DUMMY=1 ./bin/rails assets:precompile
#
#
#
#
# # Final stage for app image
# FROM base
#
# # Copy built artifacts: gems, application
# COPY --from=build "${BUNDLE_PATH}" "${BUNDLE_PATH}"
# COPY --from=build /rails /rails
#
# # Run and own only the runtime files as a non-root user for security
# RUN groupadd --system --gid 1000 rails && \
#     useradd rails --uid 1000 --gid 1000 --create-home --shell /bin/bash && \
#     chown -R rails:rails db log storage tmp
# USER 1000:1000
#
# # Entrypoint prepares the database.
# ENTRYPOINT ["/rails/bin/docker-entrypoint"]
#
# # Start server via Thruster by default, this can be overwritten at runtime
# EXPOSE 80
# CMD ["./bin/thrust", "./bin/rails", "server"]

# syntax=docker/dockerfile:1

# Use Ruby 3.3 base image
FROM ruby:3.3.0 AS base

# Set working directory
WORKDIR /app

# Install required packages for Rails + SQLite
RUN apt-get update -qq && \
    apt-get install -y build-essential libsqlite3-dev nodejs yarn && \
    rm -rf /var/lib/apt/lists/*

# Set production environment
ENV RAILS_ENV=production \
    BUNDLE_DEPLOYMENT=1 \
    BUNDLE_PATH=/usr/local/bundle \
    BUNDLE_WITHOUT=development

# Install gems
COPY Gemfile Gemfile.lock ./
RUN bundle install && \
    rm -rf ~/.bundle/ "${BUNDLE_PATH}"/ruby/*/cache "${BUNDLE_PATH}"/ruby/*/bundler/gems/*/.git

# Copy application code
COPY . .

# Precompile bootsnap code for faster boot times
RUN bundle exec bootsnap precompile app/ lib/

# Create a non-root user and set up directories
RUN useradd -m app

# Create directories with correct permissions
RUN mkdir -p /app /rails && \
    chown -R app:app /app /rails && \
    chmod -R 0755 /app /rails

# Switch to app user for the rest of the build
USER app:app

# Set up application directory
WORKDIR /app

# Copy application files
COPY --chown=app:app . .

# Set up public directory structure and database
RUN mkdir -p /app/public/assets /app/db && \
    touch /app/db/cable.sqlite3 && \
    chmod -R 0755 /app/public /app/db

# Precompile assets for production
RUN SECRET_KEY_BASE_DUMMY=1 bundle exec rails assets:precompile && \
    # Ensure the assets and db directories have the correct permissions
    chmod -R 0755 /app/public/assets /app/db

# Set up Solid Cable database at runtime through an entrypoint script

# Copy entrypoint script
COPY --chown=app:app docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Create a symlink from /rails to /app for compatibility
USER root
RUN ln -sf /app /rails && \
    chown -R app:app /rails
USER app:app

# Expose port 3000
EXPOSE 3000

# Set the entrypoint
ENTRYPOINT ["docker-entrypoint.sh"]

# Start the main process
CMD ["./bin/rails", "server", "-b", "0.0.0.0"]
