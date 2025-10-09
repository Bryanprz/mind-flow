import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Bot, Send, Sparkles, Brain, Heart, Zap, Coffee } from 'lucide-react'

export default function AIChatCard() {
  const [question, setQuestion] = useState('')
  const [isProduction] = useState(window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1')

  const handleSubmit = async (e, presetQuestion = null) => {
    e.preventDefault()
    
    if (isProduction) {
      alert('AI Chat coming soon!')
      return
    }

    const questionToAsk = presetQuestion || question
    
    // In development, submit the form
    const form = e.target
    const formData = new FormData()
    formData.append('question', questionToAsk)

    try {
      await fetch('/ai/ask', {
        method: 'POST',
        headers: {
          'X-CSRF-Token': document.querySelector('[name="csrf-token"]')?.content || '',
        },
        body: formData,
      })
      setQuestion('')
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const recommendations = [
    {
      id: 'focus',
      title: 'Boost Focus',
      description: 'Try 5-minute breathing exercise',
      icon: Brain,
      color: 'blue',
      action: 'Start Session'
    },
    {
      id: 'energy',
      title: 'Energy Dip',
      description: 'Take a 10-minute walk outside',
      icon: Zap,
      color: 'green',
      action: 'Get Moving'
    },
    {
      id: 'hydration',
      title: 'Stay Hydrated',
      description: 'You\'re 2 glasses behind today',
      icon: Coffee,
      color: 'purple',
      action: 'Drink Water'
    }
  ]

  const presetQuestions = [
    "What foods balance my dosha?",
    "Suggest a morning routine for me",
    "How can I improve my sleep?"
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card bg-base-100 shadow-sm rounded-lg flex flex-col h-full min-h-0"
    >
      {/* Chat Header */}
      <div className="py-4 px-6 border-b border-base-300">
        <div className="flex items-start justify-between gap-3">
          <motion.div 
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 3, repeatDelay: 2 }}
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white"
          >
            <Bot className="h-5 w-5" />
          </motion.div>
          <div className="flex-1">
            <h3 className="font-semibold flex items-center gap-2 text-base-content">
              Your Wellness Coach
              <Sparkles className="w-3 h-3 text-primary" />
            </h3>
            <p className="text-xs text-base-content/70">Personalized recommendations & chat</p>
          </div>
        </div>
      </div>
      
      {/* Chat Messages */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="relative flex-1 min-h-0">
          <div id="chat_messages" className="absolute inset-0 overflow-y-auto p-4">
            {/* Recommendations */}
            <div className="space-y-3 mb-4">
              <h4 className="text-sm font-semibold text-base-content flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                Today's Recommendations
              </h4>
              {recommendations.map((rec, index) => {
                const Icon = rec.icon
                const colorClasses = {
                  blue: 'text-blue-600 bg-blue-100',
                  green: 'text-green-600 bg-green-100',
                  purple: 'text-purple-600 bg-purple-100'
                }[rec.color]
                
                return (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-base-200 rounded-lg border border-base-300 hover:shadow-sm transition-shadow"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorClasses}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm text-base-content">{rec.title}</div>
                      <div className="text-xs text-base-content/70">{rec.description}</div>
                    </div>
                    <button className="text-xs px-3 py-1 bg-primary text-primary-content rounded-full hover:bg-primary/80 transition-colors">
                      {rec.action}
                    </button>
                  </motion.div>
                )
              })}
            </div>

            {/* Welcome Message */}
            <div className="flex items-start mb-4">
              <div className="w-8 h-8 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-white mr-2">
                <Bot className="h-5 w-5" />
              </div>
              <div className="bg-base-200 rounded-r-lg rounded-bl-lg p-3 max-w-[80%]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold">Ready to chat!</span>
                </div>
                <p className="text-sm">Ask me anything about your wellness journey, habits, or get personalized advice.</p>
              </div>
            </div>
            
            {/* Suggested Questions */}
            <div className="px-2 space-y-2">
              {presetQuestions.map((q, index) => (
                <button
                  key={index}
                  className="block w-full p-3 text-sm text-left rounded-lg hover:bg-base-200"
                  onClick={(e) => isProduction ? alert('AI Chat coming soon!') : handleSubmit(e, q)}
                >
                  {q}
                </button>
              ))}
            </div>
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-base-100 to-transparent"></div>
          </div>
        </div>
      </div>

      {/* Message Input */}
      <div className="p-3 border-t border-gray-200">
        {isProduction ? (
          <div className="relative">
            <input 
              type="text" 
              className="input input-bordered input-sm w-full flex-1 pr-12" 
              placeholder="Ask me anything about your health..." 
              disabled 
            />
            <button 
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
              onClick={() => alert('AI Chat coming soon!')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <input
                type="text"
                className="input input-bordered input-sm w-full flex-1 pr-12"
                placeholder="Ask me anything about your health..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
              >
                <Send className="h-5 w-5" />
              </motion.button>
            </div>
          </form>
        )}
      </div>
    </motion.div>
  )
}

