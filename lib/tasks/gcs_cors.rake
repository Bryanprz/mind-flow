# lib/tasks/gcs_cors.rake
require 'google/apis/storage_v1'
require 'googleauth'

namespace :gcs do
  desc "Set CORS policy for GCS buckets used by Active Storage"
  task :set_cors => :environment do
    # Get the service account credentials
    credentials = JSON.parse(Rails.application.credentials.gcs[:credentials])
    
    # Initialize the storage service
    storage = Google::Apis::StorageV1::StorageService.new
    storage.authorization = Google::Auth::ServiceAccountCredentials.make_creds(
      json_key_io: StringIO.new(credentials.to_json),
      scope: 'https://www.googleapis.com/auth/devstorage.full_control'
    )

    # Define CORS configuration
    cors_config = {
      cors: [
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
    }

    # Bucket names
    buckets = ["ancientherb-social-posts", "ancientherb-avatars"]

    # Set CORS for each bucket
    buckets.each do |bucket_name|
      begin
        puts "Setting CORS for bucket: #{bucket_name}"
        
        # First, get the current bucket metadata
        bucket = storage.get_bucket(bucket_name)
        
        # Update the CORS configuration
        bucket.cors = cors_config[:cors]
        
        # Update the bucket with the new CORS configuration
        storage.patch_bucket(bucket_name, bucket, predefined_acl: 'projectPrivate')
        
        puts "Successfully updated CORS for bucket: #{bucket_name}"
      rescue Google::Apis::ClientError => e
        puts "Error updating CORS for #{bucket_name}: #{e.message}"
      end
    end
    puts "CORS configuration completed for all buckets"
  end
end
