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
    // Use requestAnimationFrame for smooth initialization
    requestAnimationFrame(() => {
        const savedMessages = localStorage.getItem('tech-sathi-messages');
        if (savedMessages) {
            messages = JSON.parse(savedMessages);
            displayMessages();
        }
        
        // Load user preferences
        loadUserPreferences();
        
        applyTheme(currentTheme);
        updateLanguageUI();
        updateThemeUI();
        updateVoiceUI();
        
        // Update UI text based on current language
        updateAllUIText();
        
        // Start loading animation after app is ready
        startLoadingAnimation();
    });
}

// Setup Event Listeners
function setupEventListeners() {
    // Skip loading button (emergency escape)
    document.getElementById('skip-loading')?.addEventListener('click', () => {
        const loadingScreen = document.getElementById('loading-screen');
        const app = document.getElementById('app');
        if (loadingScreen) loadingScreen.style.display = 'none';
        if (app) app.classList.remove('hidden');
    });
    
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
        const newLang = currentLang === 'en' ? 'ne' : 'en';
        changeLanguage(newLang);
        
        // Immediately update all UI text
        setTimeout(() => {
            updateAllUIText();
        }, 100);
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

// Load user preferences from localStorage
function loadUserPreferences() {
    const savedTheme = localStorage.getItem('tech-sathi-theme');
    const savedLang = localStorage.getItem('tech-sathi-language');
    const savedVoice = localStorage.getItem('tech-sathi-voice');
    
    if (savedTheme) currentTheme = savedTheme;
    if (savedLang) currentLang = savedLang;
    if (savedVoice !== null) voiceEnabled = savedVoice === 'true';
}

// Save user preferences to localStorage
function saveUserPreferences() {
    localStorage.setItem('tech-sathi-theme', currentTheme);
    localStorage.setItem('tech-sathi-language', currentLang);
    localStorage.setItem('tech-sathi-voice', voiceEnabled.toString());
}

// Save messages to localStorage
function saveMessages() {
    localStorage.setItem('tech-sathi-messages', JSON.stringify(messages));
}

// Load messages from localStorage
function loadMessages() {
    const savedMessages = localStorage.getItem('tech-sathi-messages');
    if (savedMessages) {
        messages = JSON.parse(savedMessages);
    }
}

// Display messages in the chat
function displayMessages() {
    const messagesContainer = document.getElementById('messages');
    if (!messagesContainer) return;
    
    // Clear existing messages
    messagesContainer.innerHTML = '';
    
    if (messages.length === 0) {
        // Show welcome message
        messagesContainer.innerHTML = `
            <div class="flex items-center justify-center h-full">
                <div class="text-center space-y-8">
                    <div id="welcome-avatar" class="w-32 h-32 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl mx-auto">
                        <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                    </div>
                    
                    <div class="max-w-md space-y-6">
                        <h3 class="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            ${currentLang === 'ne' ? 'टेक साथीमा स्वागत छ!' : 'Welcome to Tech Sathi!'}
                        </h3>
                        <p class="text-gray-600 dark:text-gray-400 text-lg">
                            ${currentLang === 'ne' ? 'साक्ष्यम उपाध्यायद्वारा सिर्जना गरिएको तपाईंको एआई टेक विशेषज्ञ सहायक' : 'Your AI tech expert assistant created by Sakshyam Upadhayay'}
                        </p>
                        <div class="flex items-center justify-center gap-4 text-sm text-gray-500 flex-wrap">
                            <span class="flex items-center gap-1">✨ ${currentLang === 'ne' ? 'एआई द्वारा संचालित' : 'AI Powered'}</span>
                            <span class="flex items-center gap-1">🌍 ${currentLang === 'ne' ? 'बहुभाषिक' : 'Multilingual'}</span>
                            <span class="flex items-center gap-1">🎨 ${currentLang === 'ne' ? 'सुन्दर थिमहरू' : 'Beautiful Themes'}</span>
                            <span class="flex items-center gap-1">🛡️ ${currentLang === 'ne' ? 'साइबर सुरक्षा' : 'Cybersecurity'}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        return;
    }
    
    // Display chat messages
    messages.forEach((message, index) => {
        const messageElement = createMessageElement(message, index);
        messagesContainer.appendChild(messageElement);
    });
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Create message element
function createMessageElement(message, index) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message-bubble flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`;
    
    if (message.role === 'user') {
        messageDiv.innerHTML = `
            <div class="max-w-xs lg:max-w-md p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
                <p class="text-sm">${message.content}</p>
            </div>
            <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-lg">
                U
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-lg">
                AI
            </div>
            <div class="max-w-xs lg:max-w-md p-4 rounded-2xl bg-white/90 dark:bg-gray-800/90 border border-gray-200/50 dark:border-gray-600/50 shadow-lg backdrop-blur-xl">
                <p class="text-sm text-gray-900 dark:text-white">${message.content}</p>
            </div>
        `;
    }
    
    return messageDiv;
}

// Add message to chat
function addMessage(content, role) {
    const message = { content, role, timestamp: new Date().toISOString() };
    messages.push(message);
    saveMessages();
    displayMessages();
}

// Theme Management
function changeTheme(theme) {
    currentTheme = theme;
    applyTheme(theme);
    updateThemeUI();
    saveUserPreferences();
}

// Loading Animation
function startLoadingAnimation() {
    console.log('Starting loading animation...');
    
    // Ensure all elements are ready
    const loadingScreen = document.getElementById('loading-screen');
    const app = document.getElementById('app');
    
    console.log('Loading screen element:', loadingScreen);
    console.log('App element:', app);
    
    if (loadingScreen && app) {
        console.log('Both elements found, starting transition...');
        
        // Show loading for a shorter time and ensure smooth transition
        setTimeout(() => {
            console.log('Starting fade out...');
            loadingScreen.style.opacity = '0';
            loadingScreen.style.transition = 'opacity 0.5s ease-out';
            
            setTimeout(() => {
                console.log('Hiding loading screen and showing app...');
                loadingScreen.style.display = 'none';
                app.classList.remove('hidden');
                app.style.opacity = '0';
                app.style.transition = 'opacity 0.5s ease-in';
                
                // Trigger reflow
                app.offsetHeight;
                
                app.style.opacity = '1';
                startAvatarAnimations();
                console.log('App should now be visible!');
            }, 500);
        }, 1500);
        
        // Fallback timeout: force hide loading screen after 5 seconds
        setTimeout(() => {
            if (loadingScreen.style.display !== 'none') {
                console.log('Fallback: forcing loading screen to hide');
                loadingScreen.style.display = 'none';
                if (app) app.classList.remove('hidden');
            }
        }, 5000);
    } else {
        console.log('Elements not found, using fallback...');
        // Fallback: immediately show app if elements not found
        if (loadingScreen) loadingScreen.style.display = 'none';
        if (app) app.classList.remove('hidden');
    }
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
    
    // Apply theme-specific background with proper contrast
    const themes = {
        light: 'bg-white',
        dark: 'bg-gray-900',
        futuristic: 'bg-black',
        neon: 'bg-black'
    };
    
    // Remove old background classes and apply new ones
    document.body.className = `min-h-screen transition-all duration-500 ${themes[theme]}`;
    
    // Force CSS variable update
    document.documentElement.style.setProperty('--current-theme', theme);
    
    // Apply theme-specific styling to main elements
    applyThemeToElements(theme);
    
    // Force text color updates for better readability
    forceTextColorUpdate(theme);
    
    // Handle futuristic theme matrix rain effect
    const matrixRain = document.querySelector('.matrix-rain');
    if (matrixRain) {
        if (theme === 'futuristic') {
            matrixRain.style.display = 'block';
            startMatrixRain();
        } else {
            matrixRain.style.display = 'none';
            stopMatrixRain();
        }
    }
}

// Apply theme-specific styling to main UI elements
function applyThemeToElements(theme) {
    const themeStyles = {
        light: {
            header: 'bg-white/95 border-gray-200/50',
            sidebar: 'bg-white/95 border-gray-200/50',
            chatArea: 'bg-gray-50/50',
            inputArea: 'bg-white/95 border-gray-200/50',
            messageBubble: 'bg-white/90 border-gray-200/50',
            textColor: '#000000',
            bgColor: '#ffffff',
            secondaryBg: '#f8fafc'
        },
        dark: {
            header: 'bg-gray-900/95 border-gray-700/50',
            sidebar: 'bg-gray-900/95 border-gray-700/50',
            chatArea: 'bg-gray-800/50',
            inputArea: 'bg-gray-900/95 border-gray-700/50',
            messageBubble: 'bg-gray-800/90 border-gray-600/50',
            textColor: '#ffffff',
            bgColor: '#111827',
            secondaryBg: '#1f2937'
        },
        futuristic: {
            header: 'bg-black/95 border-green-500/50',
            sidebar: 'bg-black/95 border-green-500/50',
            chatArea: 'bg-gray-900/50',
            inputArea: 'bg-black/95 border-green-500/50',
            messageBubble: 'bg-gray-900/90 border-green-500/50',
            textColor: '#00ff88',
            bgColor: '#000000',
            secondaryBg: '#0a0a0a'
        },
        neon: {
            header: 'bg-black/95 border-pink-500/50',
            sidebar: 'bg-black/95 border-pink-500/50',
            chatArea: 'bg-gray-900/50',
            inputArea: 'bg-black/95 border-pink-500/50',
            messageBubble: 'bg-gray-900/90 border-pink-500/50',
            textColor: '#ffffff',
            bgColor: '#000000',
            secondaryBg: '#0a0a0a'
        }
    };
    
    const style = themeStyles[theme];
    
    // Update header
    const header = document.querySelector('header');
    if (header) {
        header.className = `sticky top-0 z-40 backdrop-blur-xl border-b shadow-lg ${style.header}`;
    }
    
    // Update sidebar
    const sidebar = document.querySelector('#sidebar');
    if (sidebar) {
        sidebar.className = sidebar.className.replace(/bg-\w+\/\d+/, style.sidebar.split(' ')[0]);
        sidebar.className = sidebar.className.replace(/border-\w+\/\d+/, style.sidebar.split(' ')[1]);
    }
    
    // Update chat area
    const chatArea = document.querySelector('#messages');
    if (chatArea) {
        chatArea.className = chatArea.className.replace(/bg-\w+\/\d+/, style.chatArea);
    }
    
    // Update input area
    const inputArea = document.querySelector('.p-4.border-t');
    if (inputArea) {
        inputArea.className = inputArea.className.replace(/bg-\w+\/\d+/, style.inputArea.split(' ')[0]);
        inputArea.className = inputArea.className.replace(/border-\w+\/\d+/, style.inputArea.split(' ')[1]);
    }
    
    // Update message input
    const messageInput = document.getElementById('message-input');
    if (messageInput) {
        messageInput.style.backgroundColor = style.bgColor;
        messageInput.style.color = style.textColor;
        messageInput.style.borderColor = style.textColor === '#00ff88' ? '#00ff88' : '#6b7280';
    }
    
    // Update welcome message styling
    updateWelcomeMessageStyling(theme, style);
}

// Update welcome message styling based on theme
function updateWelcomeMessageStyling(theme, style) {
    const welcomeAvatar = document.querySelector('#welcome-avatar');
    const welcomeTitle = document.querySelector('.text-3xl.font-bold');
    const welcomeSubtitle = document.querySelector('.text-gray-600.dark\\:text-gray-400.text-lg');
    const featureElements = document.querySelectorAll('.flex.items-center.justify-center.gap-4.text-sm.text-gray-500.flex-wrap span');
    
    if (welcomeAvatar) {
        if (theme === 'futuristic') {
            welcomeAvatar.style.background = 'linear-gradient(135deg, #00ff88, #00ffaa)';
        } else if (theme === 'neon') {
            welcomeAvatar.style.background = 'linear-gradient(135deg, #ff00ff, #ff66ff)';
        } else if (theme === 'dark') {
            welcomeAvatar.style.background = 'linear-gradient(135deg, #3b82f6, #8b5cf6)';
        } else {
            welcomeAvatar.style.background = 'linear-gradient(135deg, #3b82f6, #8b5cf6)';
        }
    }
    
    if (welcomeTitle) {
        welcomeTitle.style.color = style.textColor;
    }
    
    if (welcomeSubtitle) {
        welcomeSubtitle.style.color = style.textColor;
    }
    
    featureElements.forEach(element => {
        element.style.color = style.textColor;
    });
}

// Force text color updates for better readability
function forceTextColorUpdate(theme) {
    const textColors = {
        light: '#000000',
        dark: '#ffffff',
        futuristic: '#00ff88',
        neon: '#ffffff'
    };
    
    const color = textColors[theme];
    
    // Update all text elements that might have gray colors
    const grayTextElements = document.querySelectorAll('[class*="text-gray-"]');
    grayTextElements.forEach(element => {
        element.style.color = color;
    });
    
    // Update specific problematic elements
    const problematicElements = document.querySelectorAll('p, span, div, button, h1, h2, h3, h4, h5, h6');
    problematicElements.forEach(element => {
        if (element.classList.contains('text-gray-500') || 
            element.classList.contains('text-gray-400') || 
            element.classList.contains('text-gray-300') ||
            element.classList.contains('text-gray-600') ||
            element.classList.contains('text-gray-700') ||
            element.classList.contains('text-gray-800') ||
            element.classList.contains('text-gray-900')) {
            element.style.color = color;
        }
    });
    
    // Force update for buttons without background
    const buttons = document.querySelectorAll('button:not([class*="bg-"])');
    buttons.forEach(button => {
        button.style.color = color;
    });
    
    // Force sidebar text to always be white
    forceSidebarTextWhite();
}

// Force sidebar text to always be white
function forceSidebarTextWhite() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    
    // Get all text elements in sidebar
    const sidebarTextElements = sidebar.querySelectorAll('h3, h4, p, span, div, button, label');
    
    sidebarTextElements.forEach(element => {
        // Skip elements that should keep their colors (like buttons with backgrounds)
        if (element.classList.contains('bg-') || 
            element.classList.contains('gradient-') ||
            element.classList.contains('text-white') ||
            element.classList.contains('text-blue-') ||
            element.classList.contains('text-green-') ||
            element.classList.contains('text-red-') ||
            element.classList.contains('text-yellow-')) {
            return;
        }
        
        // Force white color for all other text
        element.style.color = '#ffffff';
    });
    
    // Specific elements that must be white
    const settingsTitle = sidebar.querySelector('h3.text-lg.font-semibold');
    if (settingsTitle) settingsTitle.style.color = '#ffffff';
    
    const sectionHeaders = sidebar.querySelectorAll('h4');
    sectionHeaders.forEach(header => {
        header.style.color = '#ffffff';
    });
    
    const creatorDesc = sidebar.querySelector('.creator-description');
    if (creatorDesc) creatorDesc.style.color = '#ffffff';
    
    const languageButtons = sidebar.querySelectorAll('.lang-btn');
    languageButtons.forEach(btn => {
        btn.style.color = '#ffffff';
    });
    
    const themeButtons = sidebar.querySelectorAll('.theme-btn');
    themeButtons.forEach(btn => {
        btn.style.color = '#ffffff';
    });
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
    
    // Update all UI text based on language
    updateAllUIText();
}

function updateAllUIText() {
    const translations = {
        en: {
            // Header
            'app-title': 'Tech Sathi',
            'made-by': 'Made with ❤️ by Sakshyam',
            'clear-chat': 'Clear Chat',
            'ai-assistant': 'AI Assistant',
            
            // Sidebar
            'settings': 'Settings',
            'language': 'Language',
            'theme': 'Theme',
            'voice': 'Voice Response',
            'chat-management': 'Chat Management',
            'export-chat': 'Export Chat',
            'import-chat': 'Import Chat',
            'data-management': 'Data Management',
            'clear-all-data': 'Clear All Data',
            'creator-info': 'Creator Info',
            'creator-description': 'Tech Sathi was created by Sakshyam Upadhayay as a tech expert AI assistant specifically designed to help Nepali people with technology, cybersecurity, and digital guidance.',
            
            // Welcome
            'welcome-title': 'Welcome to Tech Sathi!',
            'welcome-subtitle': 'Your AI tech expert assistant created by Sakshyam Upadhayay',
            'feature-ai': '✨ AI Powered',
            'feature-multilingual': '🌍 Multilingual',
            'feature-themes': '🎨 Beautiful Themes',
            'feature-security': '🛡️ Cybersecurity',
            
            // Input
            'placeholder': 'Ask me anything about technology...',
            'send': 'Send',
            
            // Notifications
            'chat-cleared': 'Chat cleared!',
            'chat-exported': 'Chat exported!',
            'chat-imported': 'Chat imported successfully!',
            'invalid-format': 'Invalid chat file format.',
            'import-error': 'Error importing chat file.',
            'all-data-cleared': 'All data cleared successfully!',
            'confirm-clear-all': 'Are you sure you want to clear ALL data? This cannot be undone.',
            
            // Theme names
            'theme-light': 'Light',
            'theme-dark': 'Dark',
            'theme-futuristic': 'Futuristic',
            'theme-neon': 'Neon',
            
            // Loading
            'loading-text': 'AI Assistant Loading...',
            'skip-loading': 'Click here if loading takes too long',
            
            // Features
            'feature-ai-powered': '✨ AI Powered',
            'feature-multilingual': '🌍 Multilingual',
            'feature-themes': '🎨 Beautiful Themes',
            'feature-security': '🛡️ Cybersecurity'
        },
        ne: {
            // Header
            'app-title': 'टेक साथी',
            'made-by': 'साक्ष्यम उपाध्यायद्वारा ❤️ सँग बनाइएको',
            'clear-chat': 'च्याट सफा गर्नुहोस्',
            'ai-assistant': 'एआई सहायक',
            
            // Sidebar
            'settings': 'सेटिङहरू',
            'language': 'भाषा',
            'theme': 'थिम',
            'voice': 'आवाज प्रतिक्रिया',
            'chat-management': 'च्याट व्यवस्थापन',
            'export-chat': 'च्याट निर्यात गर्नुहोस्',
            'import-chat': 'च्याट आयात गर्नुहोस्',
            'data-management': 'डाटा व्यवस्थापन',
            'clear-all-data': 'सबै डाटा सफा गर्नुहोस्',
            'creator-info': 'सिर्जनाकर्ता जानकारी',
            'creator-description': 'टेक साथी साक्ष्यम उपाध्यायद्वारा नेपाली मानिसहरूलाई टेक्नोलोजी, साइबर सुरक्षा र डिजिटल मार्गदर्शनमा मद्दत गर्न विशेष रूपमा डिजाइन गरिएको एआई टेक विशेषज्ञ सहायक हो।',
            
            // Welcome
            'welcome-title': 'टेक साथीमा स्वागत छ!',
            'welcome-subtitle': 'साक्ष्यम उपाध्यायद्वारा सिर्जना गरिएको तपाईंको एआई टेक विशेषज्ञ सहायक',
            'feature-ai': '✨ एआई द्वारा संचालित',
            'feature-multilingual': '🌍 बहुभाषिक',
            'feature-themes': '🎨 सुन्दर थिमहरू',
            'feature-security': '🛡️ साइबर सुरक्षा',
            
            // Input
            'placeholder': 'मलाई टेक्नोलोजीको बारेमा केही सोध्नुहोस्...',
            'send': 'पठाउनुहोस्',
            
            // Notifications
            'chat-cleared': 'च्याट सफा गरियो!',
            'chat-exported': 'च्याट निर्यात गरियो!',
            'chat-imported': 'च्याट सफलतापूर्वक आयात गरियो!',
            'invalid-format': 'अमान्य च्याट फाइल फर्मेट।',
            'import-error': 'च्याट फाइल आयात गर्नेमा त्रुटि।',
            'all-data-cleared': 'सबै डाटा सफलतापूर्वक सफा गरियो!',
            'confirm-clear-all': 'के तपाईं सबै डाटा सफा गर्न चाहनुहुन्छ? यो पूर्ववत गर्न सकिँदैन।',
            
            // Theme names
            'theme-light': 'उज्यालो',
            'theme-dark': 'अँध्यारो',
            'theme-futuristic': 'भविष्यवादी',
            'theme-neon': 'नियोन',
            
            // Loading
            'loading-text': 'एआई सहायक लोड हुँदैछ...',
            'skip-loading': 'यदि लोडिङ धेरै लामो लाग्छ भने यहाँ क्लिक गर्नुहोस्',
            
            // Features
            'feature-ai-powered': '✨ एआई द्वारा संचालित',
            'feature-multilingual': '🌍 बहुभाषिक',
            'feature-themes': '🎨 सुन्दर थिमहरू',
            'feature-security': '🛡️ साइबर सुरक्षा'
        }
    };
    
    const lang = translations[currentLang];
    
    // Update header
    const appTitle = document.querySelector('.text-xl.font-bold');
    if (appTitle) appTitle.textContent = lang['app-title'];
    
    const madeBy = document.querySelector('.text-xs.text-gray-500');
    if (madeBy) madeBy.textContent = lang['made-by'];
    
    const aiAssistant = document.querySelector('.text-xs.text-gray-400');
    if (aiAssistant) aiAssistant.textContent = lang['ai-assistant'];
    
    // Update sidebar
    const settingsTitle = document.querySelector('h3.text-lg.font-semibold');
    if (settingsTitle) settingsTitle.textContent = lang['settings'];
    
    // Update all h4 elements with proper text
    const h4Elements = document.querySelectorAll('h4');
    h4Elements.forEach(h4 => {
        const text = h4.textContent.trim();
        if (text.includes('Language') || text.includes('भाषा')) {
            h4.textContent = lang['language'];
        } else if (text.includes('Theme') || text.includes('थिम')) {
            h4.textContent = lang['theme'];
        } else if (text.includes('Voice') || text.includes('आवाज')) {
            h4.textContent = lang['voice'];
        } else if (text.includes('Chat Management') || text.includes('च्याट व्यवस्थापन')) {
            h4.textContent = lang['chat-management'];
        } else if (text.includes('Data Management') || text.includes('डाटा व्यवस्थापन')) {
            h4.textContent = lang['data-management'];
        } else if (text.includes('Creator Info') || text.includes('सिर्जनाकर्ता')) {
            h4.textContent = lang['creator-info'];
        }
    });
    
    // Update buttons
    const exportBtn = document.getElementById('export-btn');
    if (exportBtn) {
        exportBtn.innerHTML = `
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            ${lang['export-chat']}
        `;
    }
    
    const importBtn = document.getElementById('import-btn');
    if (importBtn) {
        importBtn.innerHTML = `
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            ${lang['import-chat']}
        `;
    }
    
    const clearAllBtn = document.getElementById('clear-all-btn');
    if (clearAllBtn) {
        clearAllBtn.innerHTML = `
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            ${lang['clear-all-data']}
        `;
    }
    
    // Update welcome message
    const welcomeTitle = document.querySelector('.text-3xl.font-bold');
    if (welcomeTitle) welcomeTitle.textContent = lang['welcome-title'];
    
    const welcomeSubtitle = document.querySelector('.text-gray-600.dark\\:text-gray-400.text-lg');
    if (welcomeSubtitle) welcomeSubtitle.textContent = lang['welcome-subtitle'];
    
    // Update feature texts
    const featureElements = document.querySelectorAll('.flex.items-center.justify-center.gap-4.text-sm.text-gray-500.flex-wrap span');
    if (featureElements.length >= 4) {
        featureElements[0].innerHTML = lang['feature-ai-powered'];
        featureElements[1].innerHTML = lang['feature-multilingual'];
        featureElements[2].innerHTML = lang['feature-themes'];
        featureElements[3].innerHTML = lang['feature-security'];
    }
    
    // Update input placeholder
    const messageInput = document.getElementById('message-input');
    if (messageInput) {
        messageInput.placeholder = lang['placeholder'];
    }
    
    // Update loading screen text
    const loadingText = document.querySelector('#loading-screen p.text-xl');
    if (loadingText) loadingText.textContent = lang['loading-text'];
    
    const skipLoadingBtn = document.getElementById('skip-loading');
    if (skipLoadingBtn) skipLoadingBtn.textContent = lang['skip-loading'];
    
    // Update creator description
    const creatorDesc = document.querySelector('.creator-description');
    if (creatorDesc) {
        creatorDesc.textContent = lang['creator-description'];
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
        const message = currentLang === 'ne' ? 'च्याट सफा गरियो!' : 'Chat cleared!';
        showNotification(message, 'success');
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
    
        const message = currentLang === 'ne' ? 'च्याट एक्सपोर्ट गरियो!' : 'Chat exported!';
        showNotification(message, 'success');
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
                const message = currentLang === 'ne' ? 'च्याट आयात गरियो!' : 'Chat imported successfully!';
                showNotification(message, 'success');
            } else {
                const message = currentLang === 'ne' ? 'अमान्य च्याट फाइल फर्मेट।' : 'Invalid chat file format.';
                showNotification(message, 'error');
            }
        } catch (error) {
            console.error('Import error:', error);
            const message = currentLang === 'ne' ? 'च्याट फाइल आयात गर्नेमा त्रुटि।' : 'Error importing chat file.';
            showNotification(message, 'error');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

function clearAllData() {
    const confirmMessage = currentLang === 'ne' ? 'के तपाईं सबै डाटा सफा गर्न चाहनुहुन्छ? यो पूर्ववत गर्न सकिँदैन।' : 'Are you sure you want to clear ALL data? This cannot be undone.';
    if (confirm(confirmMessage)) {
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
        
        const message = currentLang === 'ne' ? 'सबै डाटा सफा गरियो!' : 'All data cleared successfully!';
        showNotification(message, 'success');
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
    
    // Emergency escape from loading screen
    if (e.key === 'Escape') {
        const loadingScreen = document.getElementById('loading-screen');
        const app = document.getElementById('app');
        if (loadingScreen && loadingScreen.style.display !== 'none') {
            console.log('Emergency escape: hiding loading screen');
            loadingScreen.style.display = 'none';
            if (app) app.classList.remove('hidden');
        }
    }
});

// Matrix Rain Effect Functions
let matrixRainInterval;

function startMatrixRain() {
    const matrixRain = document.querySelector('.matrix-rain');
    if (!matrixRain) return;
    
    // Clear any existing interval
    if (matrixRainInterval) clearInterval(matrixRainInterval);
    
    // Create matrix rain effect
    matrixRainInterval = setInterval(() => {
        createMatrixDrop();
    }, 100);
}

function stopMatrixRain() {
    if (matrixRainInterval) {
        clearInterval(matrixRainInterval);
        matrixRainInterval = null;
    }
    
    // Clear existing drops
    const matrixRain = document.querySelector('.matrix-rain');
    if (matrixRain) {
        matrixRain.innerHTML = '';
    }
}

function createMatrixDrop() {
    const matrixRain = document.querySelector('.matrix-rain');
    if (!matrixRain) return;
    
    const drop = document.createElement('div');
    drop.className = 'matrix-drop';
    drop.style.cssText = `
        position: absolute;
        top: -20px;
        left: ${Math.random() * 100}%;
        color: #00ff88;
        font-family: 'Courier New', monospace;
        font-size: 14px;
        text-shadow: 0 0 5px #00ff88;
        animation: matrix-drop 3s linear forwards;
        z-index: -1;
        pointer-events: none;
    `;
    
    // Random matrix characters
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    drop.textContent = chars[Math.floor(Math.random() * chars.length)];
    
    matrixRain.appendChild(drop);
    
    // Remove drop after animation
    setTimeout(() => {
        if (drop.parentNode) {
            drop.parentNode.removeChild(drop);
        }
    }, 3000);
}

// Export functions for global access
window.TechSathi = {
    changeTheme,
    changeLanguage,
    toggleVoice,
    clearChat,
    exportChat,
    clearAllData
};

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, setting up Tech Sathi...');
    setupEventListeners();
    initializeApp();
    
    // Start continuous text color monitoring
    startTextColorMonitoring();
});

// Continuous text color monitoring to ensure readability
function startTextColorMonitoring() {
    setInterval(() => {
        const currentTheme = document.body.className.match(/theme-(\w+)/)?.[1] || 'light';
        forceTextColorUpdate(currentTheme);
        
        // Also continuously ensure sidebar text is white
        forceSidebarTextWhite();
    }, 1000); // Check every second
}

// Sidebar Management
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    if (sidebar.classList.contains('sidebar-open')) {
        sidebar.classList.remove('sidebar-open');
        overlay.classList.add('hidden');
    } else {
        sidebar.classList.add('sidebar-open');
        overlay.classList.remove('hidden');
    }
}

// Handle Send Message
async function handleSend() {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();
    
    if (!message) return;
    
    addMessage(message, 'user');
    messageInput.value = '';
    transcriptBuffer = '';
    
    // Show typing indicator
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message-bubble flex gap-3 justify-start';
    typingDiv.innerHTML = `
        <div class="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-lg">
            AI
        </div>
        <div class="max-w-xs lg:max-w-md p-4 rounded-2xl bg-white/90 dark:bg-gray-800/90 border border-gray-200/50 dark:border-gray-600/50 shadow-lg backdrop-blur-xl">
            <div class="loading-dots text-gray-500">Thinking...</div>
        </div>
    `;
    
    const messagesContainer = document.getElementById('messages');
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    try {
        const response = await fetch(`${GEMINI_API_URL}${DEFAULT_MODEL}:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `You are Tech Sathi, an AI tech expert assistant created by Sakshyam Upadhayay. You are specifically designed to help Nepali people with technology, cybersecurity, and digital guidance. Always respond in ${currentLang === 'ne' ? 'Nepali' : 'English'} language. Never use asterisks (*) for formatting. Be helpful, knowledgeable, and focus on cybersecurity for Nepali users. User message: ${message}`
                    }]
                }]
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const aiResponse = data.candidates[0].content.parts[0].text;
        
        // Remove typing indicator
        messagesContainer.removeChild(typingDiv);
        
        // Add AI response
        addMessage(aiResponse, 'assistant');
        
        // Speak response if voice is enabled
        if (voiceEnabled) {
            speakText(aiResponse);
        }
        
    } catch (error) {
        console.error('Error:', error);
        
        // Remove typing indicator
        messagesContainer.removeChild(typingDiv);
        
        // Show error message
        const errorMessage = currentLang === 'ne' ? 'माफ गर्नुहोस्, एरर भयो। कृपया पुनः प्रयास गर्नुहोस्।' : 'Sorry, an error occurred. Please try again.';
        addMessage(errorMessage, 'assistant');
    }
}

// Text-to-Speech function
function speakText(text) {
    if (!voiceEnabled || !window.speechSynthesis) return;
    
    // Remove emojis for better speech
    const cleanText = text.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '');
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = currentLang === 'ne' ? 'hi-IN' : 'en-US';
    utterance.rate = currentLang === 'ne' ? 0.8 : 1.0;
    utterance.pitch = currentLang === 'ne' ? 0.9 : 1.0;
    
    // Select best voice for Nepali
    if (currentLang === 'ne') {
        const voices = window.speechSynthesis.getVoices();
        const hindiVoice = voices.find(voice => 
            voice.lang.includes('hi-IN') || 
            voice.lang.includes('hi') || 
            voice.name.toLowerCase().includes('hindi') ||
            voice.name.toLowerCase().includes('indian')
        );
        if (hindiVoice) {
            utterance.voice = hindiVoice;
        }
    }
    
    window.speechSynthesis.speak(utterance);
}
