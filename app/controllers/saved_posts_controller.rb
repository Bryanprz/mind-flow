class SavedPostsController < ApplicationController
  before_action :require_authentication
  
  def index
    @saved_posts = Current.user.saved_social_posts
      .includes(:user, :social_post_likes, :social_post_replies, :saved_posts)
      .order('saved_posts.created_at DESC')
      .page(params[:page])
  end
  
  def create
    @social_post = SocialPost.find(params[:social_post_id])
    @saved_post = @social_post.saved_posts.build(user: Current.user)
    
    if @saved_post.save
      render json: { 
        success: true, 
        saved: true, 
        saves_count: @social_post.saved_posts.count 
      }
    else
      render json: { 
        success: false, 
        errors: @saved_post.errors.full_messages 
      }
    end
  end
  
  def destroy
    @social_post = SocialPost.find(params[:social_post_id])
    @saved_post = @social_post.saved_posts.find_by(user: Current.user)
    
    if @saved_post&.destroy
      render json: { 
        success: true, 
        saved: false, 
        saves_count: @social_post.saved_posts.count 
      }
    else
      render json: { 
        success: true, 
        saved: false, 
        saves_count: @social_post.saved_posts.count 
      }
    end
  end
end
