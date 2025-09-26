class LikesController < ApplicationController
  before_action :require_authentication
  
  def create
    likeable = find_likeable
    existing_like = Like.find_by(user: Current.user, likeable: likeable)
    
    if existing_like
      # If like exists, destroy it (unlike)
      existing_like.destroy
      liked = false
    else
      # If no like exists, create one (like)
      @like = Like.create(user: Current.user, likeable: likeable)
      liked = @like.persisted?
    end
    
    render json: { success: true, liked: liked, likes_count: likeable.reload.likes_count }
  rescue => e
    render json: { success: false, error: e.message }, status: 422
  end
  
  def destroy
    @like = Like.find_by(
      user: Current.user,
      likeable: find_likeable
    )
    @like&.destroy
    
    render json: { success: true, liked: false, likes_count: find_likeable.likes_count }
  end
  
  private
  
  def find_likeable
    case params[:likeable_type]
    when 'SocialPost'
      SocialPost.find(params[:likeable_id])
    else
      raise ActiveRecord::RecordNotFound
    end
  end
end
