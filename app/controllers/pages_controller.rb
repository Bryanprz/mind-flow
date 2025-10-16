class PagesController < ApplicationController
  allow_unauthenticated_access only: [:analytics, :goals, :learning, :notifications, :settings, :terms_of_service, :privacy_policy, :contact_us, :demo_community, :demo_messages, :demo_saved_posts]
  
  layout 'with_sidebar', only: [:analytics, :goals, :learning, :notifications, :settings]
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

  def analytics
    # Analytics page with cognitive performance metrics
    @page_title = "Cognitive Analytics"
    @analytics_data = {
      focus_trends: generate_focus_trends,
      performance_metrics: generate_performance_metrics,
      weekly_summary: generate_weekly_summary
    }
  end

  def goals
    # Goals and targets page
    @page_title = "Cognitive Goals"
    @goals_data = {
      active_goals: generate_active_goals,
      completed_goals: generate_completed_goals,
      goal_categories: generate_goal_categories
    }
  end

  def learning
    # Learning and resources page
    @page_title = "Learning Hub"
    @learning_data = {
      courses: generate_courses,
      resources: generate_learning_resources,
      progress: generate_learning_progress
    }
  end

  def notifications
    # Notifications page
    @page_title = "Notifications"
    @notifications_data = {
      unread: generate_unread_notifications,
      recent: generate_recent_notifications,
      settings: generate_notification_settings
    }
  end

  def settings
    # Settings page
    @page_title = "Settings"
    @settings_data = {
      profile: generate_profile_settings,
      preferences: generate_preferences,
      privacy: generate_privacy_settings
    }
  end

  private

  def generate_focus_trends
    [
      { date: '2024-01-15', focus_score: 8.2, clarity: 7.8, energy: 8.5 },
      { date: '2024-01-16', focus_score: 8.5, clarity: 8.1, energy: 8.2 },
      { date: '2024-01-17', focus_score: 7.9, clarity: 7.6, energy: 7.8 },
      { date: '2024-01-18', focus_score: 8.8, clarity: 8.4, energy: 9.1 },
      { date: '2024-01-19', focus_score: 8.1, clarity: 7.9, energy: 8.3 },
      { date: '2024-01-20', focus_score: 8.6, clarity: 8.2, energy: 8.7 },
      { date: '2024-01-21', focus_score: 8.3, clarity: 8.0, energy: 8.4 }
    ]
  end

  def generate_performance_metrics
    {
      avg_focus: 8.3,
      peak_performance: 'Friday',
      improvement_rate: '+12%',
      consistency_score: 94,
      flow_state_hours: 3.2,
      deep_work_sessions: 8
    }
  end

  def generate_weekly_summary
    {
      total_sessions: 24,
      avg_session_length: 45,
      breakthrough_moments: 3,
      energy_level: 'High',
      mood_trend: 'Improving',
      next_week_focus: 'Flow State Optimization'
    }
  end

  def generate_active_goals
    [
      { id: 1, title: "Achieve 90% Focus Score", progress: 82, target: 90, deadline: '2024-02-15' },
      { id: 2, title: "Complete 20 Deep Work Sessions", progress: 8, target: 20, deadline: '2024-02-28' },
      { id: 3, title: "Meditate Daily for 30 Days", progress: 15, target: 30, deadline: '2024-02-10' },
      { id: 4, title: "Read 5 Cognitive Science Books", progress: 2, target: 5, deadline: '2024-03-31' }
    ]
  end

  def generate_completed_goals
    [
      { id: 5, title: "Establish Morning Routine", completed_at: '2024-01-10', impact: 'High' },
      { id: 6, title: "Reduce Screen Time by 30%", completed_at: '2024-01-05', impact: 'Medium' },
      { id: 7, title: "Learn Basic Meditation", completed_at: '2023-12-20', impact: 'High' }
    ]
  end

  def generate_goal_categories
    [
      { name: 'Focus & Concentration', count: 2, color: 'blue' },
      { name: 'Learning & Growth', count: 2, color: 'purple' },
      { name: 'Wellness & Balance', count: 1, color: 'green' }
    ]
  end

  def generate_courses
    [
      { id: 1, title: "Advanced Focus Techniques", instructor: "Dr. Sarah Chen", progress: 75, rating: 4.8 },
      { id: 2, title: "Flow State Mastery", instructor: "Prof. Mike Rodriguez", progress: 45, rating: 4.9 },
      { id: 3, title: "Cognitive Enhancement", instructor: "Dr. Emma Wilson", progress: 20, rating: 4.7 }
    ]
  end

  def generate_learning_resources
    [
      { id: 1, title: "The Focused Mind: A Complete Guide", type: 'Book', difficulty: 'Intermediate' },
      { id: 2, title: "Meditation for Peak Performance", type: 'Course', difficulty: 'Beginner' },
      { id: 3, title: "Flow State Research Papers", type: 'Research', difficulty: 'Advanced' }
    ]
  end

  def generate_learning_progress
    {
      courses_completed: 3,
      books_read: 12,
      hours_studied: 48,
      certificates_earned: 2,
      current_streak: 15
    }
  end

  def generate_unread_notifications
    [
      { id: 1, title: "Focus Session Complete", message: "Great job! You achieved 89% focus score.", time: '5 minutes ago', type: 'success' },
      { id: 2, title: "Goal Milestone Reached", message: "You're 80% complete with your meditation goal!", time: '1 hour ago', type: 'achievement' }
    ]
  end

  def generate_recent_notifications
    [
      { id: 3, title: "Weekly Report Ready", message: "Your cognitive performance report is available.", time: '1 day ago', type: 'info' },
      { id: 4, title: "New Course Available", message: "Advanced Focus Techniques course is now available.", time: '2 days ago', type: 'course' }
    ]
  end

  def generate_notification_settings
    {
      focus_reminders: true,
      goal_milestones: true,
      weekly_reports: true,
      course_updates: false,
      email_notifications: true
    }
  end

  def generate_profile_settings
    {
      name: 'Cognitive Optimizer',
      email: 'user@mindflow.com',
      timezone: 'UTC-8',
      language: 'English',
      avatar: nil
    }
  end

  def generate_preferences
    {
      theme: 'dark',
      focus_sound: 'nature',
      reminder_frequency: 'smart',
      data_sharing: 'minimal',
      analytics_depth: 'detailed'
    }
  end

  def generate_privacy_settings
    {
      data_retention: '1 year',
      sharing_analytics: false,
      anonymous_usage: true,
      export_data: true,
      delete_account: false
    }
  end
end
