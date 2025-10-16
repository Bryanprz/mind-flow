require "application_system_test_case"

class NavigationSystemTest < ApplicationSystemTestCase

  test "complete navigation flow" do
    visit dashboard_path
    
    # Verify dashboard loads
    assert_selector "h1", text: "MindFlow"
    
    # Navigate to Analytics
    visit analytics_path
    assert_selector "h1", text: "Cognitive Analytics"
    assert_selector "span", text: "📊"
    
    # Verify analytics content
    assert_selector "h3", text: "Average Focus"
    assert_selector "h3", text: "Flow State Hours"
    assert_selector "h3", text: "Deep Work Sessions"
    assert_selector "h3", text: "Consistency Score"
    
    # Navigate to Goals
    visit goals_path
    assert_selector "h1", text: "Cognitive Goals"
    assert_selector "span", text: "🎯"
    
    # Verify goals content
    assert_selector "h3", text: "Focus & Concentration"
    assert_selector "h3", text: "Learning & Growth"
    assert_selector "h3", text: "Wellness & Balance"
    assert_selector "h2", text: "Active Goals"
    assert_selector "h2", text: "Recently Completed"
    
    # Navigate to Learning
    visit learning_path
    assert_selector "h1", text: "Learning Hub"
    assert_selector "span", text: "📚"
    
    # Verify learning content
    assert_selector "h3", text: "Courses Completed"
    assert_selector "h3", text: "Books Read"
    assert_selector "h3", text: "Hours Studied"
    assert_selector "h3", text: "Certificates"
    assert_selector "h3", text: "Current Streak"
    assert_selector "h2", text: "Current Courses"
    assert_selector "h2", text: "Recommended Resources"
    assert_selector "h2", text: "Learning Path"
    
    # Navigate to Notifications
    visit notifications_path
    assert_selector "h1", text: "Notifications"
    assert_selector "span", text: "🔔"
    
    # Verify notifications content
    assert_selector "p", text: "Unread"
    assert_selector "p", text: "Today"
    assert_selector "p", text: "This Week"
    assert_selector "h2", text: "Unread Notifications"
    assert_selector "h2", text: "Recent Notifications"
    assert_selector "h2", text: "Notification Preferences"
    
    # Navigate to Settings
    visit settings_path
    assert_selector "h1", text: "Settings"
    assert_selector "span", text: "⚙️"
    
    # Verify settings content
    assert_selector "h2", text: "Profile Settings"
    assert_selector "h2", text: "Preferences"
    assert_selector "h2", text: "Privacy & Security"
    assert_selector "h2", text: "Danger Zone"
  end

  test "analytics page interactive elements" do
    visit analytics_path
    
    # Check for interactive elements
    assert_selector "button", text: "Mark All Read"
    assert_selector "button", text: "Settings"
    
    # Verify performance metrics cards are present
    assert_selector "div", class: "bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
    
    # Check for chart placeholders
    assert_selector "div", class: "h-64 bg-black/20 rounded-lg p-4"
  end

  test "goals page interactive elements" do
    visit goals_path
    
    # Check for interactive elements
    assert_selector "button", text: "+ New Goal"
    
    # Verify goal cards are present
    assert_selector "div", class: "bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
    
    # Check for progress bars
    assert_selector "div", class: "w-full bg-gray-700 rounded-full h-2"
    
    # Check for action buttons
    assert_selector "button", text: "Update Progress"
    assert_selector "button", text: "View Details"
  end

  test "learning page interactive elements" do
    visit learning_path
    
    # Check for progress cards
    assert_selector "div", class: "bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
    
    # Check for course cards
    assert_selector "button", text: "Continue Learning"
    assert_selector "button", text: "View Details"
    
    # Check for learning path
    assert_selector "button", text: "Continue Learning Path"
  end

  test "notifications page interactive elements" do
    visit notifications_path
    
    # Check for interactive elements
    assert_selector "button", text: "Mark All Read"
    assert_selector "button", text: "Settings"
    
    # Check for notification cards
    assert_selector "div", class: "bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
    
    # Check for action buttons
    assert_selector "button", text: "View Details"
    assert_selector "button", text: "Mark as Read"
    
    # Check for toggle switches
    assert_selector "input[type='checkbox']"
  end

  test "settings page interactive elements" do
    visit settings_path
    
    # Check for interactive elements
    assert_selector "button", text: "Save Changes"
    assert_selector "button", text: "Change Avatar"
    
    # Check for form elements
    assert_selector "input[type='text']"
    assert_selector "input[type='email']"
    assert_selector "select"
    
    # Check for toggle switches
    assert_selector "input[type='checkbox']"
    
    # Check for danger zone buttons
    assert_selector "button", text: "Reset Data"
    assert_selector "button", text: "Delete Account"
  end

  test "responsive design elements" do
    # Test analytics page responsiveness
    visit analytics_path
    
    # Check for responsive grid classes
    assert_selector "div", class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
    
    # Test goals page responsiveness
    visit goals_path
    assert_selector "div", class: "grid grid-cols-1 md:grid-cols-3"
    assert_selector "div", class: "grid grid-cols-1 lg:grid-cols-2"
    
    # Test learning page responsiveness
    visit learning_path
    assert_selector "div", class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5"
    assert_selector "div", class: "grid grid-cols-1 lg:grid-cols-3"
    
    # Test notifications page responsiveness
    visit notifications_path
    assert_selector "div", class: "grid grid-cols-1 md:grid-cols-3"
    assert_selector "div", class: "grid grid-cols-1 md:grid-cols-2"
    
    # Test settings page responsiveness
    visit settings_path
    assert_selector "div", class: "grid grid-cols-1 md:grid-cols-2"
  end

  test "accessibility features" do
    # Test all pages for accessibility features
    pages = [analytics_path, goals_path, learning_path, notifications_path, settings_path]
    
    pages.each do |page|
      visit page
      
      # Check for proper heading structure
      assert_selector "h1"
      
      # Check for proper button elements
      assert_selector "button"
      
      # Check for proper form elements
      if page == settings_path
        assert_selector "input[type='text']"
        assert_selector "input[type='email']"
        assert_selector "select"
      end
    end
  end

  test "logout functionality" do
    visit logout_path
    
    # Should redirect after logout
    assert_current_path root_path
  end
end
