class SocialPostsController < ApplicationController
  before_action :require_authentication

  def index
    @social_posts = SocialPost.order(published_at: :desc)
  end

  def create
    @social_post = SocialPost.new(social_post_params)
    @social_post.user = Current.user # Assuming Current.user holds the logged-in user
    @social_post.published_at = Time.current

    if @social_post.save
      redirect_to community_path, notice: "Post created successfully!"
    else
      # Handle errors, perhaps re-render the form with @social_post
      # For now, a simple redirect with alert
      redirect_to community_path, alert: "Failed to create post."
    end
  end

  private

  def social_post_params
    params.require(:social_post).permit(:content, media: [])
  end
end
