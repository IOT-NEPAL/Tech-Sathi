import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bot, User, Volume2, Copy, Check } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

const MessageBubble = ({ message, onVoiceResponse, isLast }) => {
  const { currentTheme } = useTheme()
  const [copied, setCopied] = useState(false)
  const [showVoiceButton, setShowVoiceButton] = useState(false)

  const isAI = message.role === 'assistant'

  useEffect(() => {
    if (isAI && isLast) {
      setShowVoiceButton(true)
    }
  }, [isAI, isLast])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const handleVoiceResponse = () => {
    if (onVoiceResponse) {
      onVoiceResponse(message.content)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    }
  }

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 200,
        delay: 0.1
      }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`flex gap-3 ${isAI ? 'justify-start' : 'justify-end'}`}
    >
      {isAI && (
        <motion.div
          variants={iconVariants}
          className="w-10 h-10 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg"
        >
          <Bot className="w-6 h-6 text-white" />
        </motion.div>
      )}
      
      <motion.div
        className={`max-w-[80%] p-4 rounded-2xl ${
          isAI 
            ? 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white' 
            : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
        } shadow-lg`}
        style={{
          boxShadow: isAI 
            ? '0 10px 25px rgba(0, 0, 0, 0.1)' 
            : '0 10px 25px rgba(59, 130, 246, 0.3)'
        }}
      >
        <div className="space-y-2">
          <div className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </div>
          
          {isAI && (
            <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopy}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400"
                title="Copy message"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </motion.button>
              
              {showVoiceButton && (
                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleVoiceResponse}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-blue-500 dark:text-blue-400"
                  title="Listen to response"
                >
                  <Volume2 className="w-4 h-4" />
                </motion.button>
              )}
            </div>
          )}
        </div>
      </motion.div>
      
      {!isAI && (
        <motion.div
          variants={iconVariants}
          className="w-10 h-10 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg"
        >
          <User className="w-6 h-6 text-white" />
        </motion.div>
      )}
    </motion.div>
  )
}

export default MessageBubble
