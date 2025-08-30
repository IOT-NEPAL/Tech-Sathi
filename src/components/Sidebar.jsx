import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Settings, Download, Upload, Volume2, VolumeX, Smartphone, Monitor, Zap } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { currentTheme, changeTheme } = useTheme()
  const { language, changeLanguage, t } = useLanguage()

  const themes = [
    { id: 'light', name: 'Light', icon: '☀️' },
    { id: 'dark', name: 'Dark', icon: '🌙' },
    { id: 'futuristic', name: 'Futuristic', icon: '🚀' },
    { id: 'neon', name: 'Neon', icon: '✨' }
  ]

  const models = [
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', description: 'Fast & Efficient' },
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', description: 'Most Capable' },
    { id: 'gemini-1.0-pro', name: 'Gemini 1.0 Pro', description: 'Balanced' }
  ]

  const handleThemeChange = (themeId) => {
    changeTheme(themeId)
    localStorage.setItem('tech-sathi-theme', themeId)
  }

  const handleLanguageChange = (lang) => {
    changeLanguage(lang)
    localStorage.setItem('tech-sathi-language', lang)
  }

  const handleModelChange = (modelId) => {
    localStorage.setItem('tech-sathi-model', modelId)
    window.location.reload() // Reload to apply new model
  }

  const handleVoiceToggle = () => {
    const currentVoice = localStorage.getItem('tech-sathi-voice')
    const newVoice = currentVoice === 'false' ? 'true' : 'false'
    localStorage.setItem('tech-sathi-voice', newVoice)
    window.location.reload()
  }

  const exportChat = () => {
    const chatData = localStorage.getItem('tech-sathi-chat') || '[]'
    const blob = new Blob([chatData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tech-sathi-chat-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importChat = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const chatData = JSON.parse(e.target.result)
            localStorage.setItem('tech-sathi-chat', JSON.stringify(chatData))
            window.location.reload()
          } catch (error) {
            alert('Invalid chat file format')
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      localStorage.clear()
      window.location.reload()
    }
  }

  const toggleMobileMode = () => {
    const currentMode = localStorage.getItem('tech-sathi-mobile-mode') || 'desktop'
    const newMode = currentMode === 'desktop' ? 'mobile' : 'desktop'
    localStorage.setItem('tech-sathi-mobile-mode', newMode)
    document.documentElement.classList.toggle('mobile-mode', newMode === 'mobile')
  }

  const currentVoice = localStorage.getItem('tech-sathi-voice') !== 'false'
  const currentModel = localStorage.getItem('tech-sathi-model') || 'gemini-1.5-flash'
  const mobileMode = localStorage.getItem('tech-sathi-mobile-mode') === 'mobile'

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-80 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 shadow-2xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200/50 dark:border-gray-700/50">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* Language Selection */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Language
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      language === 'en'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">🇺🇸</div>
                      <div className="font-medium">English</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleLanguageChange('ne')}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      language === 'ne'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">🇳🇵</div>
                      <div className="font-medium">नेपाली</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Theme Selection */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Theme
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => handleThemeChange(theme.id)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        currentTheme === theme.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-1">{theme.icon}</div>
                        <div className="font-medium">{theme.name}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Model Selection */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  AI Model
                </h3>
                <div className="space-y-2">
                  {models.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => handleModelChange(model.id)}
                      className={`w-full p-3 rounded-xl border-2 transition-all text-left ${
                        currentModel === model.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="font-medium">{model.name}</div>
                      <div className="text-sm opacity-75">{model.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Voice Settings */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  {currentVoice ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  Voice Response
                </h3>
                <button
                  onClick={handleVoiceToggle}
                  className={`w-full p-3 rounded-xl border-2 transition-all ${
                    currentVoice
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                      : 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    {currentVoice ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                    <span className="font-medium">
                      {currentVoice ? 'Voice Enabled' : 'Voice Disabled'}
                    </span>
                  </div>
                </button>
              </div>

              {/* Chat Management */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Chat Management
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={exportChat}
                    className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span className="font-medium">Export</span>
                  </button>
                  <button
                    onClick={importChat}
                    className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all flex items-center justify-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span className="font-medium">Import</span>
                  </button>
                </div>
              </div>

              {/* Display Mode */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  {mobileMode ? <Smartphone className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
                  Display Mode
                </h3>
                <button
                  onClick={toggleMobileMode}
                  className={`w-full p-3 rounded-xl border-2 transition-all ${
                    mobileMode
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                      : 'border-gray-500 bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    {mobileMode ? <Smartphone className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
                    <span className="font-medium">
                      {mobileMode ? 'Mobile Mode' : 'Desktop Mode'}
                    </span>
                  </div>
                </button>
              </div>

              {/* Data Management */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Data Management
                </h3>
                <button
                  onClick={clearAllData}
                  className="w-full p-3 rounded-xl border-2 border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
                >
                  <div className="font-medium">Clear All Data</div>
                  <div className="text-sm opacity-75">This will reset all settings</div>
                </button>
              </div>

              {/* Creator Info */}
              <div className="pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                  <p>Created with ❤️ by</p>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Sakshyam Upadhayay</p>
                  <p className="text-xs mt-1">Tech Sathi AI Assistant</p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Sidebar
