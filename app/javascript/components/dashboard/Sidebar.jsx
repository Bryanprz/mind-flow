import React from 'react'
import { motion } from 'framer-motion'
import { ClipboardList, MessageSquare, Users, CheckSquare, User } from 'lucide-react'

export default function Sidebar({ currentUser }) {
  const menuItems = [
    { href: '/habit_plan', icon: ClipboardList, label: 'Habit Plan' },
    { href: '/messages', icon: MessageSquare, label: 'Messages' },
    { href: '/community', icon: Users, label: 'Community' },
    { href: '/habit_logs', icon: CheckSquare, label: 'Check Ins' },
  ]

  if (currentUser) {
    menuItems.push({ 
      href: `/users/${currentUser.slug}`, 
      icon: User, 
      label: 'Profile' 
    })
  }

  return (
    <div className="drawer-side" style={{ height: '100%', overflow: 'visible' }}>
      <label htmlFor="sidebar-toggle" className="drawer-overlay"></label>
      <ul className="menu p-4 w-80 bg-base-200 text-base-content" style={{ height: '100%', overflowY: 'auto' }}>
          {menuItems.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.li
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, x: 5 }}
              >
                <a href={item.href} className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  {item.label}
                </a>
              </motion.li>
            )
          })}
      </ul>
    </div>
  )
}

