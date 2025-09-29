class ActiveStorage::BlobsController < ActiveStorage::BaseController
  def show
    blob = ActiveStorage::Blob.find_signed(params[:signed_id])
    
    # Add aggressive caching headers for avatar images
    if blob.attachments.any? { |attachment| attachment.name == 'avatar' }
      response.headers['Cache-Control'] = 'public, max-age=31536000, immutable' # 1 year
      response.headers['Expires'] = 1.year.from_now.httpdate
      response.headers['ETag'] = blob.checksum
    end
    
    super
  end
end
