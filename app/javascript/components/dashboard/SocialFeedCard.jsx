import React from 'react'
import { motion } from 'framer-motion'
import { Users, Heart, MessageCircle, Bookmark, Image as ImageIcon, Send } from 'lucide-react'

const demoPosts = [
  {
    id: 1,
    userName: "Sarah Wellness",
    content: "Just completed my morning meditation! 7 days strong 💪",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    likesCount: 12,
    repliesCount: 3
  },
  {
    id: 2,
    userName: "Mike Health",
    content: "Sleep tracking has been a game changer. Getting 8+ hours consistently now!",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    likesCount: 8,
    repliesCount: 1
  },
  {
    id: 3,
    userName: "Emma Balance",
    content: "Gratitude journaling before bed has improved my sleep quality significantly ✨",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    likesCount: 15,
    repliesCount: 5
  }
]

function timeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000)
  
  let interval = seconds / 31536000
  if (interval > 1) return Math.floor(interval) + " years"
  
  interval = seconds / 2592000
  if (interval > 1) return Math.floor(interval) + " months"
  
  interval = seconds / 86400
  if (interval > 1) return Math.floor(interval) + " days"
  
  interval = seconds / 3600
  if (interval > 1) return Math.floor(interval) + " hours"
  
  interval = seconds / 60
  if (interval > 1) return Math.floor(interval) + " minutes"
  
  return Math.floor(seconds) + " seconds"
}

export default function SocialFeedCard() {
  const handlePostClick = () => {
    alert('Demo Mode: Posting is disabled. Visit the full community page to see more!')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card bg-base-100 border border-gray-300 h-full flex flex-col min-h-0 social-feed-card"
    >
      <div className="card-body p-0 flex flex-col flex-1 min-h-0">
        {/* Feed Header */}
        <div className="py-2 px-4 border-b border-gray-200 flex items-start justify-between gap-3">
          <div>
            <h2 className="card-title text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Community Feed
            </h2>
            <p className="text-xs text-gray-500">Share your wins, struggles, questions — anything on your mind</p>
          </div>
          <div className="flex-shrink-0">
            <a href="/community" className="link link-primary text-xs">View full feed</a>
          </div>
        </div>
        
        {/* Feed Content */}
        <div className="flex-1 flex flex-col min-h-0 max-h-full">
          <div className="relative flex-1 min-h-0 max-h-full">
            <div className="absolute inset-0 max-h-full">
              <div className="h-full max-h-full overflow-y-auto" id="social-feed-scroll">
                <div className="p-4">
                  <div className="space-y-4">
                    {demoPosts.map((post, index) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-lg p-4 border border-gray-100"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">{post.userName.charAt(0)}</span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <h3 className="text-sm font-semibold text-gray-900">{post.userName}</h3>
                              <span className="text-gray-400 text-xs">·</span>
                              <time className="text-gray-500 text-xs">
                                {timeAgo(post.createdAt)} ago
                              </time>
                            </div>
                            <p className="mt-1 text-sm text-gray-900">{post.content}</p>
                            
                            <div className="mt-3 flex items-center space-x-4">
                              <motion.button 
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors text-xs"
                              >
                                <Heart className="h-4 w-4" />
                                <span>{post.likesCount}</span>
                              </motion.button>
                              <motion.button 
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors text-xs"
                              >
                                <MessageCircle className="h-4 w-4" />
                                <span>{post.repliesCount}</span>
                              </motion.button>
                              <motion.button 
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="flex items-center space-x-1 text-gray-500 hover:text-green-500 transition-colors text-xs"
                              >
                                <Bookmark className="h-4 w-4" />
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* New Post Form (Demo Mode) */}
        <div className="px-3 pt-3 border-t border-gray-200">
          <div className="w-full">
            <div className="flex items-start gap-3">
              <div className="flex-1 relative min-w-0 flex items-center gap-2 mb-2">
                <textarea 
                  className="textarea flex-1 social-feed-input" 
                  placeholder="Write something..."
                  rows="1"
                  onClick={handlePostClick}
                  readOnly
                />
                <div className="flex items-center gap-2">
                  <motion.label 
                    whileHover={{ scale: 1.1 }}
                    className="cursor-pointer text-gray-400 hover:text-primary"
                  >
                    <ImageIcon className="h-5 w-5" />
                  </motion.label>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button" 
                    className="text-gray-400 hover:text-primary border-0 bg-transparent p-0"
                    onClick={handlePostClick}
                  >
                    <Send className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

