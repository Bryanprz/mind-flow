# Demo Recommendation Engine - Returns generic habit suggestions
module DemoStubs
  class RecommendationEngine
    HABIT_SUGGESTIONS = {
      sleep: [
        "Establish a consistent sleep schedule",
        "Create a relaxing bedtime routine",
        "Keep your bedroom cool and dark",
        "Avoid caffeine after 2 PM",
        "Limit screen time before bed"
      ],
      meditation: [
        "Start with 5 minutes of guided meditation",
        "Try mindfulness breathing exercises",
        "Use a meditation app for consistency",
        "Practice body scan meditation",
        "Join a meditation group or class"
      ],
      exercise: [
        "Take a 20-minute walk daily",
        "Try yoga or stretching in the morning",
        "Set a step goal and track it",
        "Find an exercise buddy for accountability",
        "Mix cardio and strength training"
      ],
      nutrition: [
        "Drink water first thing in the morning",
        "Prep healthy snacks for the week",
        "Eat mindfully without distractions",
        "Include more vegetables in meals",
        "Plan your meals ahead of time"
      ],
      stress: [
        "Practice deep breathing exercises",
        "Take regular breaks during work",
        "Spend time in nature",
        "Keep a gratitude journal",
        "Set boundaries with technology"
      ]
    }.freeze

    def self.suggest_habits(category: :sleep, count: 3)
      habits = HABIT_SUGGESTIONS[category] || HABIT_SUGGESTIONS[:sleep]
      habits.sample(count)
    end

    def self.personalized_plan(user, preferences = {})
      {
        morning: [
          "Wake up at the same time daily",
          "Drink a glass of water",
          "5 minutes of stretching or meditation"
        ],
        evening: [
          "Reflect on the day in a journal",
          "Prepare for tomorrow",
          "Wind down without screens"
        ],
        throughout_day: [
          "Take movement breaks every hour",
          "Practice mindful breathing when stressed",
          "Stay hydrated"
        ]
      }
    end

    def self.analyze_progress(habit_logs)
      # Analyze habit logs and return insights
      {
        streak: habit_logs.count { |log| log[:completed] },
        consistency_score: (habit_logs.count { |log| log[:completed] }.to_f / habit_logs.length * 100).round,
        top_habit: "Morning meditation",
        suggestion: "You're doing great! Try adding an evening routine next."
      }
    end
  end
end


