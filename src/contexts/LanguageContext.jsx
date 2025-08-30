import React, { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('tech-sathi-language')
    return saved || 'en'
  })

  const languages = {
    en: {
      code: 'en',
      name: 'English',
      flag: '🇺🇸',
      greeting: 'Hello! How can I help you today?',
      placeholder: 'Type your message here...',
      send: 'Send',
      clear: 'Clear Chat',
      settings: 'Settings',
      language: 'Language',
      theme: 'Theme',
      model: 'AI Model',
      voice: 'Voice Response',
      mic: 'Click to speak',
      listening: 'Listening...',
      thinking: 'Thinking...',
      error: 'Something went wrong. Please try again.',
      noMessages: 'No messages yet. Start a conversation!'
    },
    ne: {
      code: 'ne',
      name: 'नेपाली',
      flag: '🇳🇵',
      greeting: 'नमस्ते! म तपाईंलाई कसरी मद्दत गर्न सक्छु?',
      placeholder: 'यहाँ आफ्नो सन्देश टाइप गर्नुहोस्...',
      send: 'पठाउनुहोस्',
      clear: 'च्याट सफा गर्नुहोस्',
      settings: 'सेटिङहरू',
      language: 'भाषा',
      theme: 'थिम',
      model: 'एआई मोडेल',
      voice: 'आवाज प्रतिक्रिया',
      mic: 'बोल्न क्लिक गर्नुहोस्',
      listening: 'सुन्दैछु...',
      thinking: 'सोच्दैछु...',
      error: 'केही गलत भयो। कृपया फेरि प्रयास गर्नुहोस्।',
      noMessages: 'अहिलेसम्म कुनै सन्देश छैन। कुराकानी सुरु गर्नुहोस्!'
    }
  }

  useEffect(() => {
    localStorage.setItem('tech-sathi-language', language)
  }, [language])

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage)
  }

  const t = (key) => {
    return languages[language][key] || languages.en[key] || key
  }

  const value = {
    language,
    languages,
    currentLanguage: languages[language],
    changeLanguage,
    t
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}
