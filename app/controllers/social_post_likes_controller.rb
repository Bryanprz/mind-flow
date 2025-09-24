class SocialPostLikesController < ApplicationController
  before_action :require_authentication
  
  def create
    @social_post = SocialPost.find(params[:social_post_id])
    @like = @social_post.social_post_likes.build(user: Current.user)
    
    if @like.save
      render json: { 
        success: true, 
        likes_count: @social_post.social_post_likes.count,
        liked: true 
      }
    else
      render json: { success: false, errors: @like.errors.full_messages }
    end
  end
  
  def destroy
    @social_post = SocialPost.find(params[:social_post_id])
    @like = @social_post.social_post_likes.find_by(user: Current.user)
    
    if @like&.destroy
      render json: { 
        success: true, 
        likes_count: @social_post.social_post_likes.count,
        liked: false 
      }
    else
      # Like doesn't exist, so user hasn't liked it yet
      render json: { 
        success: true, 
        likes_count: @social_post.social_post_likes.count,
        liked: false 
      }
    end
  end
end
