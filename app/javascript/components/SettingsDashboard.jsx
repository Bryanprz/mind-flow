import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings, 
  User, 
  Shield, 
  Bell, 
  Palette,
  Globe,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  Download,
  Trash2,
  Key,
  Mail,
  Smartphone,
  Monitor,
  Laptop,
  Smartphone as Phone
} from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
}

export default function SettingsDashboard({ settingsData }) {
  const [activeTab, setActiveTab] = useState('profile')
  const [settings, setSettings] = useState({})
  const [hasChanges, setHasChanges] = useState(false)

  // Mock data for demonstration
  useEffect(() => {
    const mockSettings = {
      profile: {
        name: 'Bryan Perez',
        email: 'bryan@mindflow.com',
        avatar: null,
        timezone: 'UTC-8',
        language: 'English',
        bio: 'Cognitive optimization enthusiast'
      },
      preferences: {
        theme: 'dark',
        focus_sound: 'nature',
        reminder_frequency: 'smart',
        data_sharing: 'minimal',
        analytics_depth: 'detailed',
        notifications: true,
        email_digest: true,
        sound_effects: true
      },
      privacy: {
        data_retention: '1 year',
        sharing_analytics: false,
        anonymous_usage: true,
        export_data: true,
        delete_account: false,
        profile_visibility: 'private',
        data_encryption: true
      },
      security: {
        two_factor: false,
        session_timeout: '24 hours',
        login_notifications: true,
        password_strength: 'strong',
        last_login: '2024-01-15 14:30'
      }
    }
    setSettings(mockSettings)
  }, [])

  const tabs = [
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'preferences', label: 'Preferences', icon: Palette },
    { key: 'privacy', label: 'Privacy', icon: Shield },
    { key: 'security', label: 'Security', icon: Key },
    { key: 'notifications', label: 'Notifications', icon: Bell }
  ]

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }))
    setHasChanges(true)
  }

  const handleSave = () => {
    // Simulate save
    setHasChanges(false)
    console.log('Settings saved:', settings)
  }

  const SettingToggle = ({ title, description, category, setting, value }) => (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-white font-semibold">{title}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          className="sr-only peer" 
          checked={value}
          onChange={(e) => handleSettingChange(category, setting, e.target.checked)}
        />
        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
      </label>
    </div>
  )

  const SettingInput = ({ title, description, category, setting, value, type = 'text' }) => (
    <div>
      <label className="block text-white font-semibold mb-2">{title}</label>
      <p className="text-gray-400 text-sm mb-3">{description}</p>
      <input
        type={type}
        value={value}
        onChange={(e) => handleSettingChange(category, setting, e.target.value)}
        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-colors"
      />
    </div>
  )

  const SettingSelect = ({ title, description, category, setting, value, options }) => (
    <div>
      <label className="block text-white font-semibold mb-2">{title}</label>
      <p className="text-gray-400 text-sm mb-3">{description}</p>
      <select
        value={value}
        onChange={(e) => handleSettingChange(category, setting, e.target.value)}
        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-colors"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <SettingInput
              title="Full Name"
              description="Your display name across the platform"
              category="profile"
              setting="name"
              value={settings.profile?.name || ''}
            />
            <SettingInput
              title="Email Address"
              description="Used for account notifications and recovery"
              category="profile"
              setting="email"
              value={settings.profile?.email || ''}
              type="email"
            />
            <SettingInput
              title="Bio"
              description="Tell others about your cognitive journey"
              category="profile"
              setting="bio"
              value={settings.profile?.bio || ''}
            />
            <SettingSelect
              title="Timezone"
              description="Used for scheduling and notifications"
              category="profile"
              setting="timezone"
              value={settings.profile?.timezone || 'UTC-8'}
              options={[
                { value: 'UTC-8', label: 'Pacific Time (UTC-8)' },
                { value: 'UTC-5', label: 'Eastern Time (UTC-5)' },
                { value: 'UTC+0', label: 'GMT (UTC+0)' },
                { value: 'UTC+1', label: 'Central European Time (UTC+1)' }
              ]}
            />
            <SettingSelect
              title="Language"
              description="Interface language preference"
              category="profile"
              setting="language"
              value={settings.profile?.language || 'English'}
              options={[
                { value: 'English', label: 'English' },
                { value: 'Spanish', label: 'Spanish' },
                { value: 'French', label: 'French' },
                { value: 'German', label: 'German' }
              ]}
            />
          </div>
        )

      case 'preferences':
        return (
          <div className="space-y-6">
            <SettingSelect
              title="Theme"
              description="Choose your preferred interface theme"
              category="preferences"
              setting="theme"
              value={settings.preferences?.theme || 'dark'}
              options={[
                { value: 'dark', label: 'Dark (NASA Style)' },
                { value: 'light', label: 'Light' },
                { value: 'auto', label: 'Auto (System)' }
              ]}
            />
            <SettingSelect
              title="Focus Sound"
              description="Ambient sound for focus sessions"
              category="preferences"
              setting="focus_sound"
              value={settings.preferences?.focus_sound || 'nature'}
              options={[
                { value: 'nature', label: 'Nature Sounds' },
                { value: 'ocean', label: 'Ocean Waves' },
                { value: 'rain', label: 'Rain' },
                { value: 'silence', label: 'Silence' }
              ]}
            />
            <SettingSelect
              title="Reminder Frequency"
              description="How often to receive focus reminders"
              category="preferences"
              setting="reminder_frequency"
              value={settings.preferences?.reminder_frequency || 'smart'}
              options={[
                { value: 'smart', label: 'Smart (AI Optimized)' },
                { value: 'frequent', label: 'Frequent' },
                { value: 'moderate', label: 'Moderate' },
                { value: 'minimal', label: 'Minimal' }
              ]}
            />
            <SettingToggle
              title="Sound Effects"
              description="Play sounds for interactions and notifications"
              category="preferences"
              setting="sound_effects"
              value={settings.preferences?.sound_effects || true}
            />
            <SettingToggle
              title="Email Digest"
              description="Receive weekly performance summaries"
              category="preferences"
              setting="email_digest"
              value={settings.preferences?.email_digest || true}
            />
          </div>
        )

      case 'privacy':
        return (
          <div className="space-y-6">
            <SettingSelect
              title="Data Retention"
              description="How long to keep your data"
              category="privacy"
              setting="data_retention"
              value={settings.privacy?.data_retention || '1 year'}
              options={[
                { value: '30 days', label: '30 Days' },
                { value: '6 months', label: '6 Months' },
                { value: '1 year', label: '1 Year' },
                { value: 'indefinite', label: 'Indefinite' }
              ]}
            />
            <SettingToggle
              title="Anonymous Usage"
              description="Help improve the platform with anonymous usage data"
              category="privacy"
              setting="anonymous_usage"
              value={settings.privacy?.anonymous_usage || true}
            />
            <SettingToggle
              title="Data Encryption"
              description="Encrypt your personal data at rest"
              category="privacy"
              setting="data_encryption"
              value={settings.privacy?.data_encryption || true}
            />
            <SettingToggle
              title="Export Data"
              description="Allow data export in standard formats"
              category="privacy"
              setting="export_data"
              value={settings.privacy?.export_data || true}
            />
            <div className="pt-4 border-t border-gray-700/30">
              <h3 className="text-white font-semibold mb-3">Data Management</h3>
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export Data
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Account
                </motion.button>
              </div>
            </div>
          </div>
        )

      case 'security':
        return (
          <div className="space-y-6">
            <SettingToggle
              title="Two-Factor Authentication"
              description="Add an extra layer of security to your account"
              category="security"
              setting="two_factor"
              value={settings.security?.two_factor || false}
            />
            <SettingSelect
              title="Session Timeout"
              description="Automatically log out after inactivity"
              category="security"
              setting="session_timeout"
              value={settings.security?.session_timeout || '24 hours'}
              options={[
                { value: '1 hour', label: '1 Hour' },
                { value: '8 hours', label: '8 Hours' },
                { value: '24 hours', label: '24 Hours' },
                { value: '7 days', label: '7 Days' }
              ]}
            />
            <SettingToggle
              title="Login Notifications"
              description="Get notified of new login attempts"
              category="security"
              setting="login_notifications"
              value={settings.security?.login_notifications || true}
            />
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">Password Security</h3>
              <p className="text-gray-400 text-sm mb-3">Last changed: {settings.security?.last_login}</p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 px-4 py-2 rounded-lg transition-colors"
              >
                Change Password
              </motion.button>
            </div>
          </div>
        )

      case 'notifications':
        return (
          <div className="space-y-6">
            <SettingToggle
              title="Push Notifications"
              description="Receive notifications in your browser"
              category="preferences"
              setting="notifications"
              value={settings.preferences?.notifications || true}
            />
            <SettingToggle
              title="Email Notifications"
              description="Receive important updates via email"
              category="preferences"
              setting="email_digest"
              value={settings.preferences?.email_digest || true}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-white font-semibold">Focus & Productivity</h3>
                <SettingToggle
                  title="Focus Reminders"
                  description="Daily focus session reminders"
                  category="preferences"
                  setting="focus_reminders"
                  value={true}
                />
                <SettingToggle
                  title="Goal Milestones"
                  description="Achievement notifications"
                  category="preferences"
                  setting="goal_milestones"
                  value={true}
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-white font-semibold">Learning & Growth</h3>
                <SettingToggle
                  title="Course Updates"
                  description="New content and courses"
                  category="preferences"
                  setting="course_updates"
                  value={false}
                />
                <SettingToggle
                  title="Weekly Reports"
                  description="Performance summaries"
                  category="preferences"
                  setting="weekly_reports"
                  value={true}
                />
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="w-full h-full bg-transparent relative">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full min-h-full flex flex-col p-6 space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-wide">MISSION CONTROL</h1>
              <p className="text-cyan-400 text-sm">Configure your cognitive optimization settings</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {hasChanges && (
              <div className="flex items-center gap-2 text-amber-400 text-sm">
                <RefreshCw className="w-4 h-4" />
                <span>Unsaved changes</span>
              </div>
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={!hasChanges}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                hasChanges 
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white shadow-lg shadow-cyan-400/20'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Save className="w-5 h-5" />
              Save Changes
            </motion.button>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={itemVariants} className="flex items-center gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/30'
                    : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </motion.div>

        {/* Tab Content */}
        <motion.div variants={itemVariants} className="flex-1">
          <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30">
            {renderTabContent()}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
