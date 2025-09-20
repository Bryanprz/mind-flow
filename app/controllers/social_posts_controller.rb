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
        format.turbo_stream
        format.html { redirect_to community_path, notice: "Post created successfully!" }
      else
        format.turbo_stream do
          render turbo_stream: turbo_stream.update("new_post_form",
            partial: "shared/error_messages",
            locals: { resource: @social_post }
          )
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
