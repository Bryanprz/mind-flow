class AiController < ApplicationController
  def ask
    @question = params[:question]
    
    # Return canned wellness tips instead of using AI
    canned_responses = [
      "Great question! For better sleep, try establishing a consistent bedtime routine and avoiding screens 1 hour before bed.",
      "Meditation is a powerful tool for wellness. Start with just 5 minutes daily and gradually increase.",
      "Remember to stay hydrated throughout the day. Aim for 8 glasses of water for optimal health.",
      "Regular exercise, even a 10-minute walk, can significantly boost your mood and energy levels.",
      "Practice gratitude daily - writing down 3 things you're grateful for can improve your overall well-being.",
      "Deep breathing exercises can help reduce stress. Try the 4-7-8 technique: inhale for 4, hold for 7, exhale for 8.",
      "A balanced diet with plenty of fruits and vegetables is key to maintaining good health.",
      "Quality sleep is essential for wellness. Aim for 7-9 hours of uninterrupted rest each night."
    ]
    
    @answer = canned_responses.sample
    
    # This will implicitly render app/views/ai/ask.turbo_stream.erb
  end
end
