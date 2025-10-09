import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX, SkipForward, SkipBack, Settings } from 'lucide-react'

export default function AmbientSoundPlayer({ 
  className = ''
}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [volume, setVolume] = useState(70)
  const [isMuted, setIsMuted] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const audioRef = useRef(null)

  const ambientSounds = [
    {
      id: 1,
      name: "Forest Rain",
      description: "Gentle rain in a peaceful forest",
      icon: "🌧️",
      category: "Nature",
      duration: "60:00",
      color: "from-blue-500 to-emerald-500",
      audioUrl: "/sounds/forest-rain.mp3" // Would be real audio files
    },
    {
      id: 2,
      name: "Ocean Waves",
      description: "Calming ocean waves on shore",
      icon: "🌊",
      category: "Nature",
      duration: "45:00",
      color: "from-cyan-500 to-blue-500",
      audioUrl: "/sounds/ocean-waves.mp3"
    },
    {
      id: 3,
      name: "Binaural Focus",
      description: "40Hz gamma waves for deep focus",
      icon: "🧠",
      category: "Focus",
      duration: "90:00",
      color: "from-purple-500 to-pink-500",
      audioUrl: "/sounds/binaural-focus.mp3"
    },
    {
      id: 4,
      name: "Cafe Ambience",
      description: "Soft chatter and coffee shop sounds",
      icon: "☕",
      category: "Urban",
      duration: "30:00",
      color: "from-orange-500 to-amber-500",
      audioUrl: "/sounds/cafe-ambience.mp3"
    },
    {
      id: 5,
      name: "White Noise",
      description: "Pure white noise for concentration",
      icon: "⚪",
      category: "Focus",
      duration: "∞",
      color: "from-gray-500 to-slate-500",
      audioUrl: "/sounds/white-noise.mp3"
    },
    {
      id: 6,
      name: "Thunderstorm",
      description: "Distant thunder and gentle rain",
      icon: "⛈️",
      category: "Nature",
      duration: "75:00",
      color: "from-slate-500 to-gray-600",
      audioUrl: "/sounds/thunderstorm.mp3"
    }
  ]

  const currentSound = ambientSounds[currentTrack]

  // Simulate audio playback (in real app, would use actual audio)
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100
    }
  }, [volume, isMuted])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
    // In real app: audioRef.current.play() or audioRef.current.pause()
  }

  const handlePrevious = () => {
    setCurrentTrack((prev) => (prev - 1 + ambientSounds.length) % ambientSounds.length)
  }

  const handleNext = () => {
    setCurrentTrack((prev) => (prev + 1) % ambientSounds.length)
  }

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const handleMute = () => {
    setIsMuted(!isMuted)
  }

  // Simulate timer for demonstration
  const [currentTime, setCurrentTime] = useState(0)
  useEffect(() => {
    if (isPlaying) {
      const timer = setInterval(() => {
        setCurrentTime(prev => prev + 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isPlaying])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Nature': return 'text-green-500 bg-green-50 border-green-200'
      case 'Focus': return 'text-purple-500 bg-purple-50 border-purple-200'
      case 'Urban': return 'text-orange-500 bg-orange-50 border-orange-200'
      default: return 'text-gray-500 bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg">🎵</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-base-content">Focus Mode</h3>
            <p className="text-sm text-base-content/70">Ambient sounds for concentration</p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowSettings(!showSettings)}
          className="btn btn-ghost btn-sm btn-circle"
        >
          <Settings className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Main Player */}
      <div className="card bg-base-100/80 backdrop-blur-xl border border-base-300/50 shadow-lg">
        <div className="card-body p-6">
          {/* Current Track Info */}
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${currentSound.color} flex items-center justify-center text-2xl`}>
              {currentSound.icon}
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-base-content">{currentSound.name}</h4>
              <p className="text-sm text-base-content/70">{currentSound.description}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`badge badge-sm ${getCategoryColor(currentSound.category)}`}>
                  {currentSound.category}
                </span>
                <span className="text-xs text-base-content/60">
                  {currentSound.duration}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-base-content/60 mb-2">
              <span>{formatTime(currentTime)}</span>
              <span>{currentSound.duration}</span>
            </div>
            <div className="w-full bg-base-300 rounded-full h-2">
              <motion.div
                className={`h-2 rounded-full bg-gradient-to-r ${currentSound.color}`}
                animate={{ 
                  width: isPlaying ? `${(currentTime / 60) * 100}%` : '0%' 
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrevious}
              className="btn btn-ghost btn-circle"
            >
              <SkipBack className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePlayPause}
              className={`btn btn-circle btn-lg ${
                isPlaying 
                  ? 'btn-primary' 
                  : 'btn-primary btn-outline'
              }`}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" />
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className="btn btn-ghost btn-circle"
            >
              <SkipForward className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleMute}
              className="btn btn-ghost btn-sm btn-circle"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </motion.button>
            
            <div className="flex-1">
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                className="range range-primary range-sm"
              />
            </div>
            
            <span className="text-sm text-base-content/60 w-8">
              {volume}%
            </span>
          </div>
        </div>
      </div>

      {/* Sound Library */}
      <div className="card bg-base-100/80 backdrop-blur-xl border border-base-300/50 shadow-lg">
        <div className="card-body p-6">
          <h4 className="text-lg font-bold text-base-content mb-4">Sound Library</h4>
          <div className="grid grid-cols-1 gap-3">
            {ambientSounds.map((sound, index) => (
              <motion.div
                key={sound.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  currentTrack === index 
                    ? 'border-primary bg-primary/5' 
                    : 'border-base-300 hover:border-primary/50 hover:bg-base-200/50'
                }`}
                onClick={() => setCurrentTrack(index)}
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${sound.color} flex items-center justify-center text-lg`}>
                  {sound.icon}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-base-content">{sound.name}</div>
                  <div className="text-sm text-base-content/70">{sound.description}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-base-content/60">{sound.duration}</div>
                  <span className={`badge badge-xs ${getCategoryColor(sound.category)}`}>
                    {sound.category}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} loop>
        <source src={currentSound.audioUrl} type="audio/mpeg" />
      </audio>
    </div>
  )
}

