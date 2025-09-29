# ActionCable configuration for production
if Rails.env.production?
  Rails.application.configure do
    # Allow WebSocket connections from the same origin
    config.action_cable.allowed_request_origins = [
      /http:\/\/.*/, /https:\/\/.*/
    ]
    
    # Set the URL for ActionCable connections
    config.action_cable.url = ENV.fetch("ACTIONCABLE_URL", "/cable")
    
    # Configure CORS for WebSocket connections
    config.action_cable.disable_request_forgery_protection = false
    
    # Set the mount path for ActionCable
    config.action_cable.mount_path = '/cable'
  end
end
