import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, Send, Mic, MicOff, Trash2, Bot, User, Sun, Moon, Globe, Heart, Instagram } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'
import MessageBubble from './MessageBubble'
import { useChat } from '../hooks/useChat'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'
import { useTextToSpeech } from '../hooks/useTextToSpeech'

const ChatWindow = ({ onMenuClick }) => {
  const { theme, changeTheme } = useTheme()
  const { language, changeLanguage, t } = useLanguage()
  const [inputValue, setInputValue] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [transcriptBuffer, setTranscriptBuffer] = useState('') // Keep transcript when toggling
  const messagesEndRef = useRef(null)
  
  const { messages, sendMessage, isLoading, clearChat } = useChat()
  const { startListening, stopListening, transcript, isListening: speechListening } = useSpeechRecognition()
  const { speak, isSpeaking } = useTextToSpeech()

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Handle speech recognition - keep transcript when toggling
  useEffect(() => {
    if (transcript && !isListening) {
      // Add new transcript to existing buffer
      setTranscriptBuffer(prev => {
        const newBuffer = prev ? `${prev} ${transcript}` : transcript
        setInputValue(newBuffer)
        return newBuffer
      })
      setIsListening(false)
    }
  }, [transcript, isListening])

  // Clear transcript buffer when user manually types/deletes
  const handleInputChange = (e) => {
    const newValue = e.target.value
    setInputValue(newValue)
    
    // If user manually deletes or changes text, clear the transcript buffer
    if (newValue === '' || newValue !== transcriptBuffer) {
      setTranscriptBuffer('')
    }
  }

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return
    
    const message = inputValue.trim()
    setInputValue('')
    setTranscriptBuffer('') // Clear buffer after sending
    
    await sendMessage(message, language)
  }

  const handleMicClick = () => {
    if (isListening) {
      stopListening()
      setIsListening(false)
      // Don't clear transcript buffer - keep it for user to edit
    } else {
      startListening(language)
      setIsListening(true)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleVoiceResponse = (text) => {
    if (localStorage.getItem('tech-sathi-voice') !== 'false') {
      speak(text, language)
    }
  }

  const toggleTheme = () => {
    changeTheme(theme === 'light' ? 'dark' : 'light')
  }

  const toggleLanguage = () => {
    changeLanguage(language === 'en' ? 'ne' : 'en')
  }

  const handleInstagramClick = () => {
    window.open('https://www.instagram.com/sakshyamupadhayaya/?__pwa=1', '_blank')
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between p-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg"
      >
        <button
          onClick={onMenuClick}
          className="p-2 rounded-xl hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-300 lg:hidden"
        >
          <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1],
              y: [0, -2, 0]
            }}
            transition={{ 
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            className="w-12 h-12 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl"
          >
            <Bot className="w-7 h-7 text-white" />
          </motion.div>
          <div className="text-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Tech Sathi
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">AI Assistant</p>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="flex items-center justify-center gap-1 text-xs text-gray-400 dark:text-gray-500 mt-1"
            >
              <span>Made with</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Heart className="w-3 h-3 text-red-500 fill-red-500" />
              </motion.div>
              <span>by Sakshyam Upadhayay</span>
            </motion.div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Instagram Follow Button */}
          <motion.button
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleInstagramClick}
            className="p-3 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300"
            title="Follow me on Instagram!"
          >
            <Instagram className="w-4 h-4" />
            <span className="text-xs ml-1">Follow</span>
          </motion.button>

          {/* Language Toggle */}
          <motion.button
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleLanguage}
            className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
            title={`Switch to ${language === 'en' ? 'Nepali' : 'English'}`}
          >
            <Globe className="w-4 h-4" />
            <span className="text-xs ml-1">{language === 'en' ? '🇳🇵' : '🇺🇸'}</span>
          </motion.button>

          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="p-3 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} mode`}
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </motion.button>

          {/* Clear Chat */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearChat}
            className="p-3 rounded-xl hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-300 text-gray-600 dark:text-gray-400"
            title={t('clear')}
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br from-gray-50/50 to-blue-50/50 dark:from-gray-900/50 dark:to-gray-800/50">
        <AnimatePresence>
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full text-center space-y-8"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                  y: [0, -10, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-40 h-40 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl"
              >
                <Bot className="w-20 h-20 text-white" />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="max-w-md space-y-6"
              >
                <h3 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {t('greeting')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  {t('noMessages')}
                </p>
                <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                  <span className="flex items-center gap-1">✨ AI Powered</span>
                  <span className="flex items-center gap-1">🌍 Multilingual</span>
                  <span className="flex items-center gap-1">🎨 Beautiful Themes</span>
                  <span className="flex items-center gap-1">🛡️ Cybersecurity</span>
                </div>
              </motion.div>
            </motion.div>
          )}

          {messages.map((message, index) => (
            <MessageBubble
              key={index}
              message={message}
              onVoiceResponse={handleVoiceResponse}
              isLast={index === messages.length - 1}
            />
          ))}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 p-4 bg-white/80 dark:bg-gray-800/80 rounded-2xl max-w-xs backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
              >
                <Bot className="w-6 h-6 text-white" />
              </motion.div>
              <div className="flex space-x-1">
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                  className="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full"
                />
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                  className="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full"
                />
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                  className="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full"
                />
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t('thinking')}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg"
      >
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={t('placeholder')}
              className="w-full p-4 pr-12 rounded-2xl border border-gray-200/50 dark:border-gray-600/50 bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 min-h-[60px] max-h-32 backdrop-blur-xl"
              rows="1"
            />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleMicClick}
            disabled={isLoading || isSpeaking}
            className={`p-4 rounded-2xl transition-all duration-300 ${
              isListening || speechListening
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/50'
                : 'bg-gray-100/80 dark:bg-gray-700/80 text-gray-600 dark:text-gray-400 hover:bg-gray-200/80 dark:hover:bg-gray-600/80'
            } ${isLoading || isSpeaking ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={isListening ? t('listening') : t('mic')}
          >
            {isListening || speechListening ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className={`p-4 rounded-2xl transition-all duration-300 ${
              inputValue.trim() && !isLoading
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/50'
                : 'bg-gray-100/80 dark:bg-gray-700/80 text-gray-400 cursor-not-allowed'
            }`}
            title={t('send')}
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

export default ChatWindow 
