import { useState, useCallback, useEffect } from 'react'

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState(null)

  const recognition = window.SpeechRecognition || window.webkitSpeechRecognition

  const startListening = useCallback((language = 'en') => {
    if (!recognition) {
      setError('Speech recognition not supported in this browser')
      return
    }

    try {
      const recognitionInstance = new recognition()
      
      // Configure recognition
      recognitionInstance.continuous = false
      recognitionInstance.interimResults = false
      recognitionInstance.lang = language === 'ne' ? 'ne-NP' : 'en-US'
      
      recognitionInstance.onstart = () => {
        setIsListening(true)
        setError(null)
        setTranscript('')
      }

      recognitionInstance.onresult = (event) => {
        const result = event.results[0]
        if (result.isFinal) {
          setTranscript(result[0].transcript)
          setIsListening(false)
        }
      }

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setError(event.error)
        setIsListening(false)
      }

      recognitionInstance.onend = () => {
        setIsListening(false)
      }

      recognitionInstance.start()
    } catch (err) {
      console.error('Error starting speech recognition:', err)
      setError('Failed to start speech recognition')
    }
  }, [recognition])

  const stopListening = useCallback(() => {
    if (recognition) {
      try {
        const recognitionInstance = new recognition()
        recognitionInstance.stop()
      } catch (err) {
        console.error('Error stopping speech recognition:', err)
      }
    }
    setIsListening(false)
  }, [recognition])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognition) {
        try {
          const recognitionInstance = new recognition()
          recognitionInstance.stop()
        } catch (err) {
          console.error('Error cleaning up speech recognition:', err)
        }
      }
    }
  }, [recognition])

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    isSupported: !!recognition
  }
}
