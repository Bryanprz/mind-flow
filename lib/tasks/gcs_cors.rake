# lib/tasks/gcs_cors.rake
namespace :gcs do
  desc "Set CORS policy for GCS buckets used by Active Storage"
  task :set_cors => :environment do
    require "google/cloud/storage"

    # Define the CORS policy
    cors_policy = [
      {
        origin: ["https://ancientherb.health"], # Your application's domain
        method: ["GET", "POST", "PUT", "DELETE"],
        response_header: ["Content-Type"],
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
        social_posts_bucket.update do |bucket|
          bucket.cors = cors_policy
        end
        puts "CORS policy set for bucket: #{social_posts_bucket_name}"
      else
        puts "Bucket not found: #{social_posts_bucket_name}"
      end
    rescue Google::Cloud::NotFoundError
      puts "Bucket not found: #{social_posts_bucket_name}"
    rescue => e
      puts "Error setting CORS for #{social_posts_bucket_name}: #{e.message}"
    end

    # Set CORS for avatars bucket
    begin
      avatars_bucket = storage.bucket(avatars_bucket_name)
      if avatars_bucket
        avatars_bucket.update do |bucket|
          bucket.cors = cors_policy
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
