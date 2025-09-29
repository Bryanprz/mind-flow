class ActiveStorage::BlobsController < ActiveStorage::BaseController
  def show
    blob = ActiveStorage::Blob.find_signed(params[:signed_id])
    
    # Add aggressive caching headers for avatar images
    if blob.attachments.any? { |attachment| attachment.name == 'avatar' }
      # Enhanced caching with stale-while-revalidate
      expires_in 30.minutes, public: true, stale_while_revalidate: 1.week
      response.headers['ETag'] = blob.checksum
      
      # Check if client has cached version
      if stale?(etag: blob.checksum)
        # Process avatar with WebP optimization
        if blob.image?
          variant = blob.variant(resize_to_limit: [512, 512], format: :webp)
          send_webp_blob_file(variant.key)
        else
          super
        end
      else
        head :not_modified
      end
    else
      super
    end
  end
  
  private
  
  def send_webp_blob_file(key)
    send_file ActiveStorage::Blob.service.path_for(key), 
              content_type: "image/webp", 
              disposition: :inline
  end
end
