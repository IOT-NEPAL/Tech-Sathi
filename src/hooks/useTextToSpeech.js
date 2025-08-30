import { useState, useCallback } from 'react'

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false)

  const speak = useCallback((text, language) => {
    if (!text || !window.speechSynthesis) return

    // Stop any current speech
    window.speechSynthesis.cancel()

    // Remove emojis from text before speaking to avoid reading them aloud
    const cleanText = text.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '')

    const utterance = new SpeechSynthesisUtterance(cleanText)
    
    // Set language and voice for better accent - focus on tone and smoothness
    if (language === 'ne') {
      utterance.lang = 'hi-IN' // Use Hindi-India for better Nepali accent
      utterance.rate = 0.85 // Balanced speed for smoothness
      utterance.pitch = 1.0 // Natural pitch for better tone
      utterance.volume = 1.0 // Full volume for clarity
    } else {
      utterance.lang = 'en-US'
      utterance.rate = 1.0
      utterance.pitch = 1.0
      utterance.volume = 1.0
    }

    // Try to find the best voice for the language - prioritize tone quality
    const voices = window.speechSynthesis.getVoices()
    let selectedVoice = null

    if (language === 'ne') {
      // Priority order for Nepali voice selection - focus on tone quality
      selectedVoice = voices.find(voice => 
        voice.lang === 'hi-IN' && voice.name.includes('Google') // Best: Google Hindi (smooth tone)
      ) || voices.find(voice => 
        voice.lang === 'hi-IN' && voice.name.includes('Microsoft') // Good: Microsoft Hindi (natural tone)
      ) || voices.find(voice => 
        voice.lang === 'hi-IN' && voice.name.includes('Samantha') // Good: Samantha Hindi (pleasant tone)
      ) || voices.find(voice => 
        voice.lang === 'hi-IN' && voice.name.includes('Neha') // Good: Neha Hindi (smooth voice)
      ) || voices.find(voice => 
        voice.lang === 'hi-IN' && voice.name.includes('Priya') // Good: Priya Hindi (natural tone)
      ) || voices.find(voice => 
        voice.lang === 'hi-IN' // Acceptable: Any Hindi
      ) || voices.find(voice => 
        voice.lang === 'en-IN' // Fallback: Indian English (better tone)
      ) || voices.find(voice => 
        voice.lang === 'en-GB' && voice.name.includes('Indian') // Alternative: British Indian
      )
    } else {
      // Prefer US English voices with good tone
      selectedVoice = voices.find(voice => 
        voice.lang === 'en-US' && voice.name.includes('Google')
      ) || voices.find(voice => 
        voice.lang === 'en-US' && voice.name.includes('Microsoft')
      ) || voices.find(voice => 
        voice.lang === 'en-US' && voice.name.includes('Samantha')
      ) || voices.find(voice => 
        voice.lang === 'en-US'
      )
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice
      console.log(`Using voice: ${selectedVoice.name} (${selectedVoice.lang}) for ${language}`)
    } else {
      console.log(`No suitable voice found for ${language}, using default`)
    }

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error)
      setIsSpeaking(false)
    }

    window.speechSynthesis.speak(utterance)
  }, [])

  const stop = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [])

  return {
    speak,
    stop,
    isSpeaking
  }
}
