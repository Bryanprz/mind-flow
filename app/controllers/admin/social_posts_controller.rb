class Admin::SocialPostsController < ApplicationController
  before_action :require_admin!
  before_action :set_social_post, only: [:show, :edit, :update, :destroy]

  def index
    @social_posts = SocialPost.order(created_at: :desc)
  end

  def show
  end

  def edit
  end

  def update
    if @social_post.update(social_post_params)
      redirect_to admin_social_post_path(@social_post), notice: "Social post was successfully updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @social_post.destroy!
    redirect_to admin_social_posts_path, notice: "Social post was successfully deleted.", status: :see_other
  end

  private

  def require_admin!
    unless Current.user&.admin?
      redirect_to root_path, alert: "You are not authorized to access this page."
    end
  end

  def set_social_post
    @social_post = SocialPost.find(params[:id])
  end

  def social_post_params
    params.require(:social_post).permit(:content, :published_at)
  end
end
