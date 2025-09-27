class Admin::NewslettersController < ApplicationController
  before_action :require_admin
  
  def index
    @newsletters = Newsletter.order(created_at: :desc)
    @subscribed_count = Newsletter.subscribed.count
    @total_count = Newsletter.count
  end
  
  def show
    @newsletter = Newsletter.find(params[:id])
  end
  
  def update
    @newsletter = Newsletter.find(params[:id])
    if @newsletter.update(newsletter_params)
      redirect_to admin_newsletter_path(@newsletter), notice: "Newsletter subscription updated."
    else
      redirect_to admin_newsletter_path(@newsletter), alert: "Failed to update newsletter subscription."
    end
  end
  
  def destroy
    @newsletter = Newsletter.find(params[:id])
    @newsletter.destroy
    redirect_to admin_newsletters_path, notice: "Newsletter subscription deleted."
  end
  
  def send_blast
    @newsletters = Newsletter.subscribed.active
    @subject = params[:subject]
    @content = params[:content]
    
    if @newsletters.any? && @subject.present? && @content.present?
      NewsletterMailer.newsletter_blast(@newsletters, @subject, @content).deliver_later
      redirect_to admin_newsletters_path, notice: "Newsletter blast sent to #{@newsletters.count} subscribers."
    else
      redirect_to admin_newsletters_path, alert: "Please provide subject and content."
    end
  end
  
  private
  
  def newsletter_params
    params.require(:newsletter).permit(:status, :active)
  end
  
  def require_admin
    redirect_to root_path unless Current.user&.admin?
  end
end
