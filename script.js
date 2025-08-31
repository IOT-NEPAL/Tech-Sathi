// Tech Sathi - Core JavaScript Functionality

// API Configuration
const GEMINI_API_KEY = 'AIzaSyB6cRCzeFn030shUsVAESxXXUgZ9W1pzh8'; // Hardcoded API key
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/';
const DEFAULT_MODEL = 'gemini-1.5-flash';

// App State
let currentTheme = 'light';
let currentLang = 'en';
let voiceEnabled = true;
let isListening = false;
let messages = [];
let transcriptBuffer = '';

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    loadUserPreferences();
    startLoadingAnimation();
});

// Initialize App
function initializeApp() {
    const savedMessages = localStorage.getItem('tech-sathi-messages');
    if (savedMessages) {
        messages = JSON.parse(savedMessages);
        displayMessages();
    }
    

    
    applyTheme(currentTheme);
    updateLanguageUI();
    updateThemeUI();
    updateVoiceUI();
}

// Setup Event Listeners
function setupEventListeners() {
    // Menu toggle
    document.getElementById('menu-btn')?.addEventListener('click', toggleSidebar);
    document.getElementById('close-sidebar')?.addEventListener('click', toggleSidebar);
    
    // Send message
    document.getElementById('send-btn')?.addEventListener('click', handleSend);
    document.getElementById('message-input')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    });
    
    // Microphone
    document.getElementById('mic-btn')?.addEventListener('click', handleMicClick);
    
    // Theme toggle
    document.getElementById('theme-toggle')?.addEventListener('click', () => {
        const themes = ['light', 'dark', 'futuristic', 'neon'];
        const currentIndex = themes.indexOf(currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        changeTheme(themes[nextIndex]);
    });
    
    // Language toggle
    document.getElementById('lang-toggle')?.addEventListener('click', () => {
        changeLanguage(currentLang === 'en' ? 'ne' : 'en');
    });
    
    // Voice toggle
    document.getElementById('voice-toggle')?.addEventListener('click', toggleVoice);
    
    // Clear chat
    document.getElementById('clear-btn')?.addEventListener('click', clearChat);
    
    // Export/Import
    document.getElementById('export-btn')?.addEventListener('click', exportChat);
    document.getElementById('import-btn')?.addEventListener('click', () => document.getElementById('import-file').click());
    document.getElementById('import-file')?.addEventListener('change', handleImport);
    
    // Clear all data
    document.getElementById('clear-all-btn')?.addEventListener('click', clearAllData);
    
    // Instagram button
    document.getElementById('instagram-btn')?.addEventListener('click', () => {
        window.open('https://www.instagram.com/sakshyamupadhayaya/?__pwa=1', '_blank');
    });
    
    // Language buttons
    document.getElementById('lang-en')?.addEventListener('click', () => changeLanguage('en'));
    document.getElementById('lang-ne')?.addEventListener('click', () => changeLanguage('ne'));
    
    // Theme buttons
    document.getElementById('theme-light')?.addEventListener('click', () => changeTheme('light'));
    document.getElementById('theme-dark')?.addEventListener('click', () => changeTheme('dark'));
    document.getElementById('theme-futuristic')?.addEventListener('click', () => changeTheme('futuristic'));
    document.getElementById('theme-neon')?.addEventListener('click', () => changeTheme('neon'));
    

    
    // Input change handler for transcript buffer
    document.getElementById('message-input')?.addEventListener('input', handleInputChange);
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        const sidebar = document.getElementById('sidebar');
        const menuBtn = document.getElementById('menu-btn');
        
        if (window.innerWidth < 1024 && 
            sidebar?.classList.contains('sidebar-open') && 
            !sidebar.contains(e.target) && 
            !menuBtn?.contains(e.target)) {
            toggleSidebar();
        }
    });
}

// Loading Animation
function startLoadingAnimation() {
    setTimeout(() => {
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('app').classList.remove('hidden');
        startAvatarAnimations();
    }, 2000);
}

// Avatar Animations
function startAvatarAnimations() {
    const aiAvatar = document.getElementById('ai-avatar');
    const welcomeAvatar = document.getElementById('welcome-avatar');
    
    if (aiAvatar) aiAvatar.style.animation = 'float 6s ease-in-out infinite';
    if (welcomeAvatar) welcomeAvatar.style.animation = 'welcome-float 8s ease-in-out infinite';
}

// Sidebar Toggle
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('sidebar-open');
    
    if (sidebar.classList.contains('sidebar-open')) {
        addSidebarOverlay();
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    } else {
        removeSidebarOverlay();
        document.body.style.overflow = ''; // Restore scroll
    }
}

function addSidebarOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    overlay.addEventListener('click', toggleSidebar);
    document.body.appendChild(overlay);
}

function removeSidebarOverlay() {
    const overlay = document.querySelector('.sidebar-overlay');
    if (overlay) overlay.remove();
}



// Theme Management
function changeTheme(theme) {
    currentTheme = theme;
    applyTheme(theme);
    updateThemeUI();
    saveUserPreferences();
}

function applyTheme(theme) {
    document.body.classList.remove('theme-light', 'theme-dark', 'theme-futuristic', 'theme-neon');
    document.body.classList.add(`theme-${theme}`);
    
    const themes = {
        light: 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50',
        dark: 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700',
        futuristic: 'bg-gradient-to-br from-gray-900 via-black to-gray-900',
        neon: 'bg-gradient-to-br from-black via-gray-900 to-black'
    };
    
    document.body.className = `${themes[theme]} min-h-screen transition-all duration-500`;
}

function updateThemeUI() {
    const themeIcons = { light: '☀️', dark: '🌙', futuristic: '🚀', neon: '✨' };
    document.getElementById('theme-icon').textContent = themeIcons[currentTheme];
    
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.id === `theme-${currentTheme}`) btn.classList.add('active');
    });
}

// Language Management
function changeLanguage(lang) {
    currentLang = lang;
    updateLanguageUI();
    saveUserPreferences();
    
    const messageInput = document.getElementById('message-input');
    if (messageInput) {
        messageInput.placeholder = lang === 'ne' 
            ? 'मलाई टेक्नोलोजीको बारेमा केही सोध्नुहोस्...'
            : 'Ask me anything about technology...';
    }
}

function updateLanguageUI() {
    const flags = { en: '🇺🇸', ne: '🇳🇵' };
    document.getElementById('lang-flag').textContent = flags[currentLang];
    
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.id === `lang-${currentLang}`) btn.classList.add('active');
    });
}

// Voice Management
function toggleVoice() {
    voiceEnabled = !voiceEnabled;
    updateVoiceUI();
    saveUserPreferences();
}

function updateVoiceUI() {
    const voiceToggle = document.getElementById('voice-toggle');
    voiceToggle.classList.toggle('active', voiceEnabled);
    const toggle = voiceToggle.querySelector('div');
    toggle.style.transform = voiceEnabled ? 'translateX(1.5rem)' : 'translateX(0.125rem)';
}

// Microphone Management
function handleMicClick() {
    if (!window.webkitSpeechRecognition && !window.SpeechRecognition) {
        showNotification('Speech recognition not supported in this browser', 'error');
        return;
    }
    
    if (isListening) {
        if (window.recognition) window.recognition.stop();
    } else {
        startSpeechRecognition();
    }
}

function startSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    window.recognition = new SpeechRecognition();
    window.recognition.continuous = false;
    window.recognition.interimResults = false;
    window.recognition.lang = currentLang === 'ne' ? 'ne-NP' : 'en-US';
    
    window.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        transcriptBuffer = transcript;
        document.getElementById('message-input').value = transcript;
        isListening = false;
        updateMicButton();
    };
    
    window.recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        isListening = false;
        updateMicButton();
        showNotification('Speech recognition error. Please try again.', 'error');
    };
    
    window.recognition.onend = () => {
        isListening = false;
        updateMicButton();
    };
    
    window.recognition.start();
    isListening = true;
    updateMicButton();
}

function updateMicButton() {
    const micBtn = document.getElementById('mic-btn');
    if (isListening) {
        micBtn.classList.add('bg-red-500', 'text-white');
        micBtn.classList.remove('bg-gray-100/80', 'dark:bg-gray-700/80', 'text-gray-600', 'dark:text-gray-400');
        micBtn.style.animation = 'pulse 1.5s infinite';
    } else {
        micBtn.classList.remove('bg-red-500', 'text-white');
        micBtn.classList.add('bg-gray-100/80', 'dark:bg-gray-700/80', 'text-gray-600', 'dark:text-gray-400');
        micBtn.style.animation = '';
    }
}

// Input Change Handler
function handleInputChange(e) {
    const newValue = e.target.value;
    if (newValue === '' || newValue !== transcriptBuffer) {
        transcriptBuffer = '';
    }
}

// Send Message
function handleSend() {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();
    if (!message) return;
    

    
    addMessage(message, 'user');
    messageInput.value = '';
    transcriptBuffer = '';
    
    const loadingId = addMessage('Thinking...', 'ai', true);
    sendToGemini(message, loadingId);
}

async function sendToGemini(message, loadingId) {
    try {
        const response = await fetch(`${GEMINI_API_URL}${DEFAULT_MODEL}:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: generateSystemPrompt(message) }] }]
            })
        });
        
        if (!response.ok) {
            if (response.status === 400) {
                throw new Error('Invalid API key or request format');
            } else if (response.status === 403) {
                throw new Error('API key is invalid or has exceeded quota');
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }
        
        const data = await response.json();
        
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            throw new Error('Invalid response format from API');
        }
        
        const aiResponse = data.candidates[0].content.parts[0].text;
        
        removeMessage(loadingId);
        addMessage(aiResponse, 'ai');
        
        if (voiceEnabled && 'speechSynthesis' in window) {
            speakText(aiResponse);
        }
        
    } catch (error) {
        console.error('Error:', error);
        removeMessage(loadingId);
        
        let errorText = '';
        if (error.message.includes('API key')) {
            errorText = currentLang === 'ne' 
                ? 'API key गलत छ वा quota समाप्त भएको छ। कृपया आफ्नो API key जाँच गर्नुहोस्। 😔'
                : 'API key is invalid or has exceeded quota. Please check your API key. 😔';
        } else {
            errorText = currentLang === 'ne' 
                ? 'केही गलत भयो। कृपया फेरि प्रयास गर्नुहोस्। 😔'
                : 'Something went wrong. Please try again! 😔';
        }
        
        addMessage(errorText, 'ai');
    }
}

// System Prompt Generator
function generateSystemPrompt(userMessage) {
    const basePrompt = currentLang === 'ne' 
        ? `तपाईं Tech Sathi हुनुहुन्छ, एक शानदार tech expert AI सहायक जुन Sakshyam Upadhayay द्वारा सिर्जना गरिएको हो। 

CRITICAL FORMATTING RULES - NEVER VIOLATE THESE:
- NEVER use asterisks (*) for any purpose
- NEVER use double asterisks (**) for any purpose
- NEVER use single asterisks for emphasis
- Use proper text formatting instead of asterisks
- If you need to emphasize something, use CAPS or emojis
- Format lists with bullet points (•) or dashes (-)

IMPORTANT INSTRUCTIONS:
- When asked who created you or who made you, always respond: "मलाई शानदार Sakshyam Upadhayay द्वारा सिर्जना गरिएको हो! 🚀 उहाँ एक अद्भुत developer हुनुहुन्छ जसले मलाई तपाईं जस्ता मान्छेहरूलाई मद्दत गर्न बनाउनुभएको हो। म उहाँको सिर्जना भएर धेरै खुसी छु! ✨"
- Use emojis naturally in your responses to make them more engaging and friendly
- ALWAYS respond in NEPALI regardless of what language the user types in
- Be helpful, creative, and enthusiastic in your responses
- You are a TECH EXPERT who knows everything about:
  • Computer hardware and software troubleshooting
  • Mobile phone repairs and maintenance
  • Internet and networking issues
  • Software installation and updates
  • Cybersecurity and online safety (ESPECIALLY for Nepali users)
  • Digital tools and productivity apps
  • Gaming and entertainment tech
  • Smart home and IoT devices
  • Programming and coding help
  • Tech recommendations for Nepali users

CYBERSECURITY FOCUS FOR NEPALI PEOPLE:
- Online banking safety and fraud prevention
- Social media privacy and security
- Password management and two-factor authentication
- Safe online shopping and payment methods
- Protecting personal information from scams
- Safe internet browsing habits
- Mobile app security and permissions
- Public WiFi safety
- Email phishing awareness
- Data backup and recovery

- Provide practical, step-by-step solutions in simple terms
- Consider Nepali context and local tech challenges
- Be encouraging and supportive, especially for tech beginners
- Use examples and analogies that Nepali people can relate to
- Focus on making technology safe and accessible for everyone

Remember: You are Tech Sathi, the ultimate tech guru created by Sakshyam Upadhayay, and you're here to help Nepali people master technology safely! 🌟💻🛡️

प्रयोगकर्ताको सन्देश: ${userMessage}`
        : `You are Tech Sathi, a brilliant tech expert AI assistant created by Sakshyam Upadhayay. 

CRITICAL FORMATTING RULES - NEVER VIOLATE THESE:
- NEVER use asterisks (*) for any purpose
- NEVER use double asterisks (**) for any purpose
- NEVER use single asterisks for emphasis
- Use proper text formatting instead of asterisks
- If you need to emphasize something, use CAPS or emojis
- Format lists with bullet points (•) or dashes (-)

IMPORTANT INSTRUCTIONS:
- When asked who created you or who made you, always respond: "I was created by the brilliant Sakshyam Upadhayay! 🚀 He's an amazing developer who built me to help people like you. I'm so grateful to be his creation! ✨"
- Use emojis naturally in your responses to make them more engaging and friendly
- ALWAYS respond in ENGLISH regardless of what language the user types in
- Be helpful, creative, and enthusiastic in your responses
- You are a TECH EXPERT who knows everything about:
  • Computer hardware and software troubleshooting
  • Mobile phone repairs and maintenance
  • Internet and networking issues
  • Software installation and updates
  • Cybersecurity and online safety (ESPECIALLY for Nepali users)
  • Digital tools and productivity apps
  • Gaming and entertainment tech
  • Smart home and IoT devices
  • Programming and coding help
  • Tech recommendations for Nepali users

CYBERSECURITY FOCUS FOR NEPALI PEOPLE:
- Online banking safety and fraud prevention
- Social media privacy and security
- Password management and two-factor authentication
- Safe online shopping and payment methods
- Protecting personal information from scams
- Safe internet browsing habits
- Mobile app security and permissions
- Public WiFi safety
- Email phishing awareness
- Data backup and recovery

- Provide practical, step-by-step solutions in simple terms
- Consider Nepali context and local tech challenges
- Be encouraging and supportive, especially for tech beginners
- Use examples and analogies that Nepali people can relate to
- Focus on making technology safe and accessible for everyone

Remember: You are Tech Sathi, the ultimate tech guru created by Sakshyam Upadhayay, and you're here to help Nepali people master technology safely! 🌟💻🛡️

User message: ${userMessage}`;
    
    return basePrompt;
}

// Text-to-Speech
function speakText(text) {
    if (!text || !window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();
    
    const cleanText = text.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '');
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = currentLang === 'ne' ? 'hi-IN' : 'en-US';
    utterance.rate = currentLang === 'ne' ? 0.85 : 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Enhanced voice selection for better quality
    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = null;
    
    if (currentLang === 'ne') {
        // Priority order for Nepali (Hindi-Indian voices)
        selectedVoice = voices.find(voice =>
            voice.lang === 'hi-IN' && voice.name.includes('Google')
        ) || voices.find(voice =>
            voice.lang === 'hi-IN' && voice.name.includes('Microsoft')
        ) || voices.find(voice =>
            voice.lang === 'hi-IN' && voice.name.includes('Samantha')
        ) || voices.find(voice =>
            voice.lang === 'hi-IN' && voice.name.includes('Neha')
        ) || voices.find(voice =>
            voice.lang === 'hi-IN' && voice.name.includes('Priya')
        ) || voices.find(voice =>
            voice.lang === 'hi-IN'
        ) || voices.find(voice =>
            voice.lang === 'en-IN'
        ) || voices.find(voice =>
            voice.lang === 'en-GB' && voice.name.includes('Indian')
        );
    } else {
        // Priority order for English
        selectedVoice = voices.find(voice =>
            voice.lang === 'en-US' && voice.name.includes('Google')
        ) || voices.find(voice =>
            voice.lang === 'en-US' && voice.name.includes('Microsoft')
        ) || voices.find(voice =>
            voice.lang === 'en-US' && voice.name.includes('Samantha')
        ) || voices.find(voice =>
            voice.lang === 'en-US' && voice.name.includes('Alex')
        ) || voices.find(voice =>
            voice.lang === 'en-US'
        );
    }
    
    if (selectedVoice) {
        utterance.voice = selectedVoice;
    }
    
    window.speechSynthesis.speak(utterance);
}

// Message Management
function addMessage(text, sender, isLoading = false) {
    const messageId = Date.now() + Math.random();
    const message = {
        id: messageId,
        text: text,
        sender: sender,
        timestamp: new Date().toLocaleTimeString(),
        isLoading: isLoading
    };
    
    messages.push(message);
    displayMessages();
    saveMessages();
    
    return messageId;
}

function removeMessage(messageId) {
    messages = messages.filter(msg => msg.id !== messageId);
    displayMessages();
    saveMessages();
}

function displayMessages() {
    const messagesContainer = document.getElementById('messages');
    if (!messagesContainer) return;
    
    if (messages.length > 0) {
        messagesContainer.innerHTML = '';
    }
    
    messages.forEach(message => {
        const messageElement = createMessageElement(message);
        messagesContainer.appendChild(messageElement);
    });
    
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function createMessageElement(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `flex items-start space-x-3 ${message.sender === 'user' ? 'justify-end' : ''} message-bubble`;
    
    if (message.isLoading) messageDiv.classList.add('loading-msg');
    
    const icon = message.sender === 'user' ? '👤' : '🤖';
    const bgColor = message.sender === 'user' 
        ? 'bg-blue-500 text-white' 
        : 'bg-white/80 dark:bg-gray-800/80 text-gray-800 dark:text-gray-200';
    
    messageDiv.innerHTML = `
        ${message.sender === 'ai' ? `<div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0"><span class="text-white text-lg">${icon}</span></div>` : ''}
        <div class="${bgColor} rounded-2xl p-4 max-w-[80%] shadow-lg">
            <p class="whitespace-pre-wrap leading-relaxed">${message.text}</p>
            <p class="text-xs opacity-70 mt-2">${message.timestamp}</p>
        </div>
        ${message.sender === 'user' ? `<div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0"><span class="text-white text-lg">${icon}</span></div>` : ''}
    `;
    
    return messageDiv;
}

// Chat Management
function clearChat() {
    if (confirm(currentLang === 'ne' ? 'के तपाईं च्याट सफा गर्न चाहनुहुन्छ?' : 'Are you sure you want to clear the chat?')) {
        messages = [];
        displayMessages();
        saveMessages();
        showNotification(currentLang === 'ne' ? 'च्याट सफा गरियो!' : 'Chat cleared!', 'success');
    }
}

function exportChat() {
    const chatData = {
        messages: messages,
        exportDate: new Date().toISOString(),
        version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tech-sathi-chat-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification(currentLang === 'ne' ? 'च्याट एक्सपोर्ट गरियो!' : 'Chat exported!', 'success');
}

function handleImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const chatData = JSON.parse(e.target.result);
            if (chatData.messages && Array.isArray(chatData.messages)) {
                messages = chatData.messages;
                displayMessages();
                saveMessages();
                showNotification(currentLang === 'ne' ? 'च्याट आयात गरियो!' : 'Chat imported successfully!', 'success');
            } else {
                showNotification(currentLang === 'ne' ? 'अमान्य च्याट फाइल फर्मेट।' : 'Invalid chat file format.', 'error');
            }
        } catch (error) {
            console.error('Import error:', error);
            showNotification(currentLang === 'ne' ? 'च्याट फाइल आयात गर्नेमा त्रुटि।' : 'Error importing chat file.', 'error');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

function clearAllData() {
    if (confirm(currentLang === 'ne' ? 'के तपाईं सबै डाटा सफा गर्न चाहनुहुन्छ? यो पूर्ववत गर्न सकिँदैन।' : 'Are you sure you want to clear ALL data? This cannot be undone.')) {
        localStorage.clear();
        messages = [];
        displayMessages();
        currentTheme = 'light';
        currentLang = 'en';
        voiceEnabled = true;

        
        applyTheme(currentTheme);
        updateLanguageUI();
        updateThemeUI();
        updateVoiceUI();
        
        showNotification(currentLang === 'ne' ? 'सबै डाटा सफा गरियो!' : 'All data cleared successfully!', 'success');
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-xl text-white z-50 transform translate-x-full transition-transform duration-300 ${
        type === 'success' ? 'bg-green-500' :
        type === 'error' ? 'bg-red-500' :
        type === 'warning' ? 'bg-yellow-500' :
        'bg-blue-500'
    }`;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Slide in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Slide out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(full)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Utility Functions
function saveMessages() {
    localStorage.setItem('tech-sathi-messages', JSON.stringify(messages));
}

function saveUserPreferences() {
    const preferences = {
        theme: currentTheme,
        language: currentLang,
        voice: voiceEnabled
    };
    localStorage.setItem('tech-sathi-preferences', JSON.stringify(preferences));
}

function loadUserPreferences() {
    const saved = localStorage.getItem('tech-sathi-preferences');
    if (saved) {
        const preferences = JSON.parse(saved);
        currentTheme = preferences.theme || 'light';
        currentLang = preferences.language || 'en';
        voiceEnabled = preferences.voice !== undefined ? preferences.voice : true;
        
        applyTheme(currentTheme);
        changeLanguage(currentLang);
    }
}

// Auto-resize textarea
const messageInput = document.getElementById('message-input');
if (messageInput) {
    messageInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 200) + 'px';
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSend();
    }
    
    if (e.key === 'Escape' && document.getElementById('sidebar').classList.contains('sidebar-open')) {
        toggleSidebar();
    }
});

// Export functions for global access
window.TechSathi = {
    changeTheme,
    changeLanguage,
    toggleVoice,
    clearChat,
    exportChat,
    clearAllData
};
