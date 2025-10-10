import React from 'react'
import { motion } from 'framer-motion'
import { Github } from 'lucide-react'

export default function AuthenticatedFooter({ currentUser }) {
  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  return (
    <motion.footer
      variants={footerVariants}
      initial="hidden"
      animate="visible"
      className="text-white mt-auto w-full"
    >
      <div className="w-full py-4">
        <div className="flex justify-center items-center text-sm text-white/60 px-6">
          <div>
            © 2025 MindFlow. Built by{' '}
            <a 
              href="https://github.com/Bryanprz" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1 text-md"
            >
              <Github className="w-4 h-4" />
              Bryan Perez
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}
