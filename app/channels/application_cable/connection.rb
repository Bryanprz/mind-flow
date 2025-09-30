module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      Rails.logger.info "🔌 ActionCable connection attempt for session: #{cookies.signed[:session_id]}"
      if set_current_user
        Rails.logger.info "✅ ActionCable connected for user: #{current_user&.name}"
      else
        Rails.logger.error "❌ ActionCable connection rejected - no valid session"
        reject_unauthorized_connection
      end
    end

    private
      def set_current_user
        if session = Session.find_by(id: cookies.signed[:session_id])
          self.current_user = session.user
        end
      end
  end
end
