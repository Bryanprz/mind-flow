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
      render json: { 
        success: true, 
        replies_count: @social_post.social_post_replies.count,
        reply: render_to_string(partial: 'social_post_replies/reply', locals: { reply: @reply })
      }
    else
      render json: { success: false, errors: @reply.errors.full_messages }
    end
  end
end
