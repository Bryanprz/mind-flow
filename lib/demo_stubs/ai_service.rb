# Demo AI Service - Returns canned wellness tips instead of calling real AI
module DemoStubs
  class AiService
    CANNED_RESPONSES = [
      "Great question! For better sleep, try establishing a consistent bedtime routine and avoiding screens 1 hour before bed.",
      "Meditation is a powerful tool for wellness. Start with just 5 minutes daily and gradually increase.",
      "Remember to stay hydrated throughout the day. Aim for 8 glasses of water for optimal health.",
      "Regular exercise, even a 10-minute walk, can significantly boost your mood and energy levels.",
      "Practice gratitude daily - writing down 3 things you're grateful for can improve your overall well-being.",
      "Deep breathing exercises can help reduce stress. Try the 4-7-8 technique: inhale for 4, hold for 7, exhale for 8.",
      "A balanced diet with plenty of fruits and vegetables is key to maintaining good health.",
      "Quality sleep is essential for wellness. Aim for 7-9 hours of uninterrupted rest each night.",
      "Mindfulness practices can reduce anxiety. Try focusing on the present moment throughout your day.",
      "Social connections are vital for mental health. Reach out to friends or family regularly.",
      "Set realistic wellness goals. Small, consistent changes lead to lasting habits.",
      "Track your progress to stay motivated. Seeing improvement can boost your commitment to healthy habits."
    ].freeze

    def self.ask(question)
      # Return a random canned response
      CANNED_RESPONSES.sample
    end

    def self.generate_recommendation(user, context = {})
      # Generate a generic wellness recommendation based on context
      recommendations = {
        sleep: "Consider going to bed and waking up at the same time each day to regulate your circadian rhythm.",
        stress: "Try incorporating 10 minutes of meditation or deep breathing exercises into your daily routine.",
        exercise: "Start with 15-20 minutes of moderate activity like walking or yoga, 3-4 times per week.",
        nutrition: "Focus on whole foods and try to eat a rainbow of fruits and vegetables throughout the week.",
        default: "Continue tracking your habits and celebrate small wins along the way!"
      }

      recommendations[context[:type]&.to_sym] || recommendations[:default]
    end
  end
end


