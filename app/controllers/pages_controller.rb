class PagesController < ApplicationController
  def terms_of_service
  end

  def privacy_policy
  end

  def contact_us
  end

  def demo_community
    # Demo mode - show static social posts UI
    @demo_mode = true
    @demo_posts = [
      {
        id: 1,
        user_name: "Sarah Wellness",
        content: "Just completed my morning meditation! 7 days strong 💪",
        created_at: 2.hours.ago,
        likes_count: 12,
        replies_count: 3
      },
      {
        id: 2,
        user_name: "Mike Health",
        content: "Sleep tracking has been a game changer. Getting 8+ hours consistently now!",
        created_at: 4.hours.ago,
        likes_count: 8,
        replies_count: 1
      },
      {
        id: 3,
        user_name: "Emma Balance",
        content: "Gratitude journaling before bed has improved my sleep quality significantly ✨",
        created_at: 1.day.ago,
        likes_count: 15,
        replies_count: 5
      }
    ]
  end

  def demo_messages
    # Demo mode - show static messaging UI
    @demo_mode = true
    @demo_conversations = [
      {
        id: 1,
        user_name: "Wellness Coach",
        last_message: "Great job on your streak! Keep it up!",
        last_message_time: 1.hour.ago,
        unread_count: 0
      },
      {
        id: 2,
        user_name: "Support Team",
        last_message: "How can we help you today?",
        last_message_time: 3.hours.ago,
        unread_count: 1
      }
    ]
    
    @demo_messages = [
      {
        id: 1,
        user_name: "Wellness Coach",
        content: "How's your meditation practice going?",
        created_at: 2.hours.ago,
        is_sent: false
      },
      {
        id: 2,
        user_name: "Current User",
        content: "It's going great! I've been consistent for a week now.",
        created_at: 1.hour.ago,
        is_sent: true
      },
      {
        id: 3,
        user_name: "Wellness Coach",
        content: "Excellent! Consistency is key. Keep up the great work!",
        created_at: 1.hour.ago,
        is_sent: false
      }
    ]
  end

  def demo_saved_posts
    # Demo mode - show static saved posts UI
    @demo_mode = true
    @demo_saved_posts = [
      {
        id: 1,
        user_name: "Sarah Wellness",
        content: "5-minute morning routine that changed my life...",
        saved_at: 1.day.ago
      },
      {
        id: 2,
        user_name: "Mike Health",
        content: "Sleep optimization tips from a sleep researcher...",
        saved_at: 3.days.ago
      }
    ]
  end
end
