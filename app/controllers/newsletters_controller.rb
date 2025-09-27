class NewslettersController < ApplicationController
  skip_before_action :require_authentication, only: [:create, :unsubscribe]
  
  def create
    @newsletter = Newsletter.new(newsletter_params)
    
    respond_to do |format|
      if @newsletter.save
        # For now, skip email to avoid hanging - we'll add it back later
        # NewsletterMailer.welcome_email(@newsletter).deliver_later
        
        format.turbo_stream do
          render turbo_stream: [
            turbo_stream.replace(
              "newsletter-form",
              partial: "newsletters/success_message"
            )
          ]
        end
        format.html { redirect_to root_path, notice: "Successfully subscribed to our newsletter!" }
        format.json { render json: { status: 'success', message: 'Successfully subscribed!' }, status: :created }
      else
        format.turbo_stream do
          render turbo_stream: [
            turbo_stream.replace(
              "newsletter-form",
              partial: "newsletters/form",
              locals: { newsletter: @newsletter }
            )
          ], status: :unprocessable_entity
        end
        format.html { redirect_to root_path, alert: "There was an error subscribing to the newsletter." }
        format.json { render json: { errors: @newsletter.errors.full_messages }, status: :unprocessable_entity }
      end
    end
  end
  
  def unsubscribe
    @newsletter = Newsletter.find_by(email_address: params[:email])
    
    if @newsletter
      @newsletter.unsubscribe!
      render :unsubscribed
    else
      render :not_found
    end
  end
  
  private
  
  def newsletter_params
    params.require(:newsletter).permit(:email_address)
  end
end
