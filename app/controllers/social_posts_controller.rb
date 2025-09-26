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
    # Get all replies in the conversation thread (direct replies and nested replies)
    @replies = get_all_replies_in_thread(@social_post)
  end

  private

  def get_all_replies_in_thread(main_post)
    # Get all social posts that are part of this conversation thread
    # This includes direct replies and all nested replies
    all_replies = []
    
    # Start with direct replies
    direct_replies = main_post.replies.includes(:user, :rich_text_content, media_attachments: :blob).order(:created_at)
    
    # Recursively get all nested replies
    direct_replies.each do |reply|
      all_replies << reply
      # Get nested replies for this reply
      nested_replies = get_all_replies_in_thread(reply)
      all_replies.concat(nested_replies)
    end
    
    Rails.logger.info "Found #{all_replies.count} total replies in thread"
    all_replies
  end

  def create
    Rails.logger.info "=== SOCIAL POSTS CONTROLLER CREATE CALLED ==="
    Rails.logger.info "Params: #{params.inspect}"
    Rails.logger.info "Request format: #{request.format}"
    Rails.logger.info "Request headers Accept: #{request.headers['Accept']}"
    Rails.logger.info "Request content type: #{request.content_type}"
    
    begin
      @social_post = SocialPost.new(social_post_params)
      Rails.logger.info "Social post created: #{@social_post.inspect}"
      @social_post.user = Current.user
      @social_post.published_at = Time.current
      Rails.logger.info "Social post after setting user and time: #{@social_post.inspect}"
    rescue => e
      Rails.logger.error "Error creating social post: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      raise e
    end

    Rails.logger.info "Creating social post: #{@social_post.inspect}"
    Rails.logger.info "Request format: #{request.format}"
    Rails.logger.info "Is reply?: #{@social_post.reply?}"
    Rails.logger.info "Content: #{@social_post.content}"
    Rails.logger.info "Parent post ID: #{@social_post.parent_post_id}"

    respond_to do |format|
      format.json do
        if @social_post.save
          Rails.logger.info "Social post saved successfully: #{@social_post.id}"
          render json: { 
            success: true, 
            message: "Reply posted successfully!",
            redirect_url: social_post_path(@social_post.original_post)
          }
        else
          Rails.logger.error "Social post save failed: #{@social_post.errors.full_messages}"
          render json: { 
            success: false, 
            errors: @social_post.errors.full_messages 
          }, status: 422
        end
      end
      
      format.turbo_stream do
        if @social_post.save
          Rails.logger.info "Social post saved successfully: #{@social_post.id}"
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
        else
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
      end
      
      format.html do
        if @social_post.save
          if @social_post.reply?
            redirect_to social_post_path(@social_post.original_post), notice: "Reply posted successfully!"
          else
            redirect_to community_path, notice: "Post created successfully!"
          end
        else
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
