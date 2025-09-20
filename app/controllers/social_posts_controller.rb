class SocialPostsController < ApplicationController
  before_action :require_authentication

  def index
    @social_posts = SocialPost.order(published_at: :desc)
    # For dashboard card
    # Use a variant for embedded (e.g., Turbo Frame) requests so we can render a compact feed
    request.variant = :embedded if turbo_frame_request?
  end

  def create
    @social_post = SocialPost.new(social_post_params)
    @social_post.user = Current.user
    @social_post.published_at = Time.current

    respond_to do |format|
      if @social_post.save
        format.turbo_stream do
          if request.referer&.include?('dashboard')
            render turbo_stream: [
              turbo_stream.prepend("social_feed", 
                partial: "social_posts/social_post",
                formats: [:html],
                variants: [:embedded],
                locals: { social_post: @social_post }
              ),
              turbo_stream.update("new_post_form", 
                partial: "dashboards/social_feed_form"
              )
            ]
          else
            render turbo_stream: [
              turbo_stream.prepend("social-posts", 
                partial: "social_posts/social_post",
                locals: { social_post: @social_post }
              ),
              turbo_stream.update("post-form-container",
                partial: "social_posts/form"
              ),
              turbo_stream.update("flash",
                partial: "layouts/flash"
              )
            ]
          end
        end
        format.html { redirect_to community_path, notice: "Post created successfully!" }
      else
        format.turbo_stream do
          if request.referer&.include?('dashboard')
            render turbo_stream: turbo_stream.update("new_post_form",
              partial: "dashboards/social_feed_form",
              locals: { social_post: @social_post }
            )
          else
            render turbo_stream: turbo_stream.update("post-form-container",
              partial: "social_posts/form",
              locals: { social_post: @social_post }
            )
          end
        end
        format.html { redirect_to community_path, alert: @social_post.errors.full_messages.to_sentence }
      end
    end
  end

  private

  def social_post_params
    params.require(:social_post).permit(:content, media: [])
  end
end
