# Demo Messaging Service - Explains demo mode limitations
module DemoStubs
  class MessagingService
    DEMO_MODE_MESSAGE = "This is a demo version of MindMetrics. Messaging features are displayed for portfolio demonstration purposes only.".freeze

    def self.send_message(room_id, user_id, content)
      {
        success: false,
        error: "Demo Mode",
        message: DEMO_MODE_MESSAGE,
        demo_response: "In a production environment, your message would be sent and delivered in real-time."
      }
    end

    def self.create_room(user_ids, room_type = :private)
      {
        success: false,
        error: "Demo Mode",
        message: DEMO_MODE_MESSAGE,
        demo_response: "In a production environment, a new conversation would be created."
      }
    end

    def self.load_messages(room_id, limit: 50)
      # Return demo messages
      [
        {
          id: 1,
          user_name: "Wellness Coach",
          content: "Welcome to MindMetrics! How can I help you today?",
          created_at: 1.hour.ago,
          is_sent: false
        },
        {
          id: 2,
          user_name: "You",
          content: "Thanks! I'm looking to improve my sleep quality.",
          created_at: 55.minutes.ago,
          is_sent: true
        },
        {
          id: 3,
          user_name: "Wellness Coach",
          content: "Great goal! Let's start with tracking your current sleep patterns...",
          created_at: 50.minutes.ago,
          is_sent: false
        }
      ]
    end

    def self.demo_mode?
      true
    end

    def self.demo_mode_notice
      {
        type: "info",
        title: "Demo Mode Active",
        message: "Messaging features are for demonstration only. Messages are not saved or sent.",
        actions: [
          { label: "Learn More", url: "#demo-info" },
          { label: "Got it", dismissible: true }
        ]
      }
    end
  end
end



