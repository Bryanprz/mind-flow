class NewsletterMailer < ApplicationMailer
  default from: "AncientHerb <noreply@ancientherb.com>"
  
  def welcome_email(newsletter)
    @newsletter = newsletter
    @unsubscribe_url = unsubscribe_newsletter_url(email: @newsletter.email_address)
    
    mail(
      to: @newsletter.email_address,
      subject: "Welcome to AncientHerb - Your Healing Journey Starts Now! 🌿"
    )
  end
  
  def newsletter_blast(newsletters, subject, content)
    @content = content
    @unsubscribe_urls = newsletters.map { |n| [n.email_address, unsubscribe_newsletter_url(email: n.email_address)] }.to_h
    
    mail(
      to: newsletters.pluck(:email_address),
      subject: subject
    )
  end
end
