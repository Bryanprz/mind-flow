class SocialPostRepliesController < ApplicationController
  before_action :require_authentication
  
  def create
    @social_post = SocialPost.find(params[:social_post_id])
    @reply = @social_post.social_post_replies.build(reply_params)
    @reply.user = Current.user
    
    if @reply.save
      # Reload to ensure associations are loaded
      @reply.reload
      @reply = SocialPostReply.includes(:user, :rich_text_content).find(@reply.id)
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
              html: @social_post.social_post_replies.count
            )
          ]
        end
        format.html do
          redirect_to social_post_path(@social_post), notice: "Reply posted successfully!"
        end
      end
    else
      respond_to do |format|
        format.json { render json: { success: false, errors: @reply.errors.full_messages } }
        format.turbo_stream { render turbo_stream: turbo_stream.update("flash", partial: "layouts/flash") }
        format.html { redirect_to social_post_path(@social_post), alert: "Reply could not be saved: #{@reply.errors.full_messages.join(', ')}" }
      end
    end
  end

  private

  def reply_params
    params.require(:social_post_reply).permit(:content)
  end
end
