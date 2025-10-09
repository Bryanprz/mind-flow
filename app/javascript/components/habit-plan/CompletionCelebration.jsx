import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Trophy, Star, Zap, Heart, Target } from 'lucide-react'

export default function CompletionCelebration({ 
  isVisible, 
  onClose, 
  streak = 0,
  completionPercentage = 100,
  className = ''
}) {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])

  // Confetti animation
  useEffect(() => {
    if (!isVisible) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Create confetti particles
    const createParticle = () => ({
      x: Math.random() * canvas.width,
      y: -10,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 2,
      color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'][Math.floor(Math.random() * 6)],
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10
    })

    // Initialize particles
    particlesRef.current = Array.from({ length: 50 }, createParticle)

    let animationId
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particlesRef.current.forEach((particle, index) => {
        // Update particle
        particle.x += particle.vx
        particle.y += particle.vy
        particle.rotation += particle.rotationSpeed
        particle.vy += 0.1 // gravity

        // Draw particle
        ctx.save()
        ctx.translate(particle.x, particle.y)
        ctx.rotate((particle.rotation * Math.PI) / 180)
        ctx.fillStyle = particle.color
        ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size)
        ctx.restore()

        // Remove particles that are off screen
        if (particle.y > canvas.height + 20) {
          particlesRef.current[index] = createParticle()
        }
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [isVisible])

  const celebrationMessages = [
    "Amazing work! 🎉",
    "You're on fire! 🔥",
    "Incredible dedication! 💪",
    "Outstanding! ⭐",
    "You're unstoppable! 🚀",
    "Fantastic progress! 🌟"
  ]

  const getStreakMessage = (streak) => {
    if (streak >= 30) return "A whole month strong! 🎊"
    if (streak >= 14) return "Two weeks of dedication! 🌟"
    if (streak >= 7) return "One week strong! 🚀"
    if (streak >= 3) return "Great start! You're on a streak! 🎉"
    return "Day complete! 🎉"
  }

  const getRandomMessage = () => {
    return celebrationMessages[Math.floor(Math.random() * celebrationMessages.length)]
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 ${className}`}
        onClick={onClose}
      >
        {/* Confetti Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 1 }}
        />

        {/* Celebration Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            delay: 0.2 
          }}
          className="relative z-10 card bg-base-100 shadow-2xl max-w-md mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="card-body text-center p-8">
            {/* Animated Icons */}
            <div className="relative mb-6">
              <motion.div
                className="text-8xl mb-4"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ 
                  scale: [0, 1.2, 1],
                  rotate: [180, 0, 360]
                }}
                transition={{ 
                  duration: 1.5,
                  ease: "easeOut"
                }}
              >
                🎉
              </motion.div>
              
              {/* Floating icons */}
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ 
                  y: [-10, 10, -10],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Trophy className="w-8 h-8 text-yellow-500" />
              </motion.div>
              
              <motion.div
                className="absolute -bottom-2 -left-2"
                animate={{ 
                  y: [10, -10, 10],
                  rotate: [0, -15, 15, 0]
                }}
                transition={{ 
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              >
                <Star className="w-6 h-6 text-blue-500" />
              </motion.div>
            </div>

            {/* Celebration Message */}
            <motion.h2
              className="text-3xl font-black mb-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              {getRandomMessage()}
            </motion.h2>
            
            <motion.p
              className="text-lg text-base-content/80 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              {getStreakMessage(streak)}
            </motion.p>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-2 gap-4 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-xl p-4 border border-green-400/30">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-base-content">Completion</span>
                </div>
                <div className="text-2xl font-bold text-green-600">{completionPercentage}%</div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl p-4 border border-orange-400/30">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-medium text-base-content">Streak</span>
                </div>
                <div className="text-2xl font-bold text-orange-600">{streak} days</div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="flex gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="btn btn-primary flex-1"
              >
                <CheckCircle className="w-5 h-5" />
                Keep Going!
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  // Share functionality would go here
                  console.log('Share achievement')
                }}
                className="btn btn-ghost"
              >
                <Heart className="w-5 h-5" />
                Share
              </motion.button>
            </motion.div>

            {/* Motivational Quote */}
            <motion.div
              className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 rounded-xl border border-purple-400/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
            >
              <p className="text-sm text-base-content/70 italic">
                "Consistency is the mother of mastery." - Robin Sharma
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
