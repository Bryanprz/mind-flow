# lib/tasks/gcs_cors.rake
namespace :gcs do
  desc "Set CORS policy for GCS buckets used by Active Storage"
  task :set_cors => :environment do
    require "google/cloud/storage"

    # Define CORS configuration according to Google Cloud Storage API
    cors_policy = [
      {
        origin: ["https://ancientherb.health", "https://www.ancientherb.health"],
        method: ["GET", "HEAD", "PUT", "POST", "DELETE", "OPTIONS"],
        response_header: [
          "Content-Type",
          "Content-MD5",
          "x-goog-resumable",
          "x-goog-meta-*",
          "x-client-*"
        ],
        max_age_seconds: 3600
      }
    ]

    # Initialize GCS client using credentials
    # Ensure Rails.application.credentials.gcs[:credentials] is correctly set up
    # as a JSON string in your Rails credentials.
    gcs_credentials = Rails.application.credentials.gcs[:credentials]
    storage = Google::Cloud::Storage.new(credentials: gcs_credentials)

    # Define bucket names
    social_posts_bucket_name = "ancientherb-social-posts"
    avatars_bucket_name = "ancientherb-avatars"

    # Set CORS for social posts bucket
    begin
      social_posts_bucket = storage.bucket(social_posts_bucket_name)
      if social_posts_bucket
        # For google-cloud-storage 1.57.0, we need to use the update method with cors_configuration
        social_posts_bucket.update do |b|
          b.cors_configuration = cors_policy
          # Ensure public access prevention is not blocking CORS
          b.website_main_page_suffix = nil
          b.website_not_found_page = nil
        end
        puts "CORS policy set for bucket: #{social_posts_bucket_name}"
      else
        puts "Bucket not found: #{social_posts_bucket_name}"
      end
    rescue Google::Cloud::NotFoundError
      puts "Bucket not found: #{social_posts_bucket_name}"
    rescue => e
      puts "Error setting CORS for #{social_posts_bucket_name}: #{e.message}"
      puts e.backtrace.join("\n") # Add backtrace for debugging
    end

    # Set CORS for avatars bucket
    begin
      avatars_bucket = storage.bucket(avatars_bucket_name)
      if avatars_bucket
        # For google-cloud-storage 1.57.0, we need to use the update method with cors_configuration
        avatars_bucket.update do |b|
          b.cors_configuration = cors_policy
          # Ensure public access prevention is not blocking CORS
          b.website_main_page_suffix = nil
          b.website_not_found_page = nil
        end
        puts "CORS policy set for bucket: #{avatars_bucket_name}"
      else
        puts "Bucket not found: #{avatars_bucket_name}"
      end
    rescue Google::Cloud::NotFoundError
      puts "Bucket not found: #{avatars_bucket_name}"
    rescue => e
      puts "Error setting CORS for #{avatars_bucket_name}: #{e.message}"
    end
  end
end
