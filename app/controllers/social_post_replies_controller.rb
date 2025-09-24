class SocialPostRepliesController < ApplicationController
  before_action :require_authentication
  
  def create
    @social_post = SocialPost.find(params[:social_post_id])
    @reply = @social_post.social_post_replies.build(
      user: Current.user,
      content: params[:social_post_reply][:content]
    )
    
    if @reply.save
      # Reload to ensure associations are loaded
      @reply.reload
      respond_to do |format|
        format.json do
          render json: { 
            success: true, 
            replies_count: @social_post.social_post_replies.count,
            reply: render_to_string(partial: 'social_post_replies/reply', locals: { reply: @reply })
          }
        end
        format.turbo_stream do
          render turbo_stream: [
            turbo_stream.append("repliesList", 
              partial: 'social_post_replies/reply', 
              locals: { reply: @reply }
            ),
            turbo_stream.update("repliesCount", 
              text: @social_post.social_post_replies.count
            )
          ]
        end
      end
    else
      respond_to do |format|
        format.json { render json: { success: false, errors: @reply.errors.full_messages } }
        format.turbo_stream { render turbo_stream: turbo_stream.update("flash", partial: "layouts/flash") }
      end
    end
  end
end
