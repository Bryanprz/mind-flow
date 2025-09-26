class SocialPostsController < ApplicationController
  before_action :require_authentication

  def index
    @social_posts = SocialPost.top_level_posts
                              .includes(:user, :likes, :social_post_bookmarks, :replies, media_attachments: :blob)
                              .order(published_at: :desc)
    # For dashboard card
    # Use a variant for embedded (e.g., Turbo Frame) requests so we can render a compact feed
    request.variant = :embedded if turbo_frame_request?
  end

  def show
    @social_post = SocialPost.includes(:user, :likes, :social_post_bookmarks, :replies, :rich_text_content)
                            .find(params[:id])
    @replies = @social_post.replies.includes(:user, :rich_text_content, media_attachments: :blob).order(:created_at)
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
              ),
              turbo_stream.append("social_feed", "
                <div data-controller='scroll-to' data-action='turbo:frame-render->scroll-to#scrollTop'></div>
              ".html_safe)
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
        format.json { 
          render json: { 
            success: true, 
            message: "Reply posted successfully!",
            reply: render_to_string(partial: "social_posts/reply", locals: { social_post: @social_post }, formats: [:html]),
            replies_count: @social_post.parent_post.replies_count
          } 
        }
        format.html do
          if @social_post.reply?
            redirect_to social_post_path(@social_post.parent_post), notice: "Reply posted successfully!"
          else
            redirect_to community_path, notice: "Post created successfully!"
          end
        end
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
        format.json { render json: { success: false, errors: @social_post.errors.full_messages }, status: 422 }
        format.html do
          if @social_post.reply?
            redirect_to social_post_path(@social_post.parent_post), alert: @social_post.errors.full_messages.to_sentence
          else
            redirect_to community_path, alert: @social_post.errors.full_messages.to_sentence
          end
        end
      end
    end
  end

  private

  def social_post_params
    params.require(:social_post).permit(:content, :parent_post_id, media: [])
  end
end
