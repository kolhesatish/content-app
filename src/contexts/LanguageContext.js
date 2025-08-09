'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

// Translations for English and Marathi
const translations = {
  en: {
    // Navigation
    home: 'Home',
    instagram: 'Instagram',
    linkedin: 'LinkedIn',
    getStarted: 'Get Started',
    logout: 'Logout',
    credits: 'credits',
    
    // Home page
    hero: {
      title: 'AI-Powered Social Media Content Generator',
      subtitle: 'Create engaging Instagram posts, LinkedIn content, and social media captions in seconds with our advanced AI tools.',
      cta: 'Start Creating Now',
      features: 'Key Features'
    },
    
    // Instagram Generator
    instagramGenerator: {
      title: 'Instagram Content Generator',
      contentType: 'Content Type',
      post: 'Post',
      reel: 'Reel',
      story: 'Story',
      topic: 'What topic do you want to create content about?',
      topicPlaceholder: 'Enter your topic (e.g., fitness tips, travel adventure, food recipe)',
      caption: 'Do you want a caption?',
      yes: 'Yes',
      no: 'No',
      styles: 'Choose content styles (optional)',
      wordCount: 'Caption Word Count',
      generate: 'Generate Content',
      regenerate: 'Generate New Content',
      copyContent: 'Copy Content',
      copied: 'Copied!',
      generating: 'Generating...'
    },
    
    // LinkedIn Generator
    linkedinGenerator: {
      title: 'LinkedIn Content Generator',
      topic: 'What topic do you want to write about?',
      topicPlaceholder: 'Enter your topic (e.g., leadership tips, industry insights, career advice)',
      style: 'Content Style',
      professional: 'Professional',
      casual: 'Casual',
      inspirational: 'Inspirational',
      wordCount: 'Content Word Count',
      generate: 'Generate Content',
      regenerate: 'Generate New Content',
      copyContent: 'Copy Content',
      copied: 'Copied!',
      generating: 'Generating...'
    },
    
    // Auth
    auth: {
      login: 'Login',
      register: 'Register',
      username: 'Username',
      password: 'Password',
      loginButton: 'Login',
      registerButton: 'Register',
      switchToRegister: "Don't have an account? Register",
      switchToLogin: 'Already have an account? Login'
    },
    
    // Word count options
    wordCounts: {
      50: '50 words',
      100: '100 words',
      200: '200 words',
      300: '300 words',
      500: '500 words'
    }
  },
  mr: {
    // Navigation
    home: 'मुख्यपृष्ठ',
    instagram: 'इन्स्टाग्राम',
    linkedin: 'लिंक्डइन',
    getStarted: 'सुरुवात करा',
    logout: 'बाहेर पडा',
    credits: 'क्रेडिट',
    
    // Home page
    hero: {
      title: 'AI-संचालित सोशल मीडिया कंटेंट जेनेरेटर',
      subtitle: 'आमच्या प्रगत AI टूल्सच्या साहाय्याने सेकंदांत आकर्षक इन्स्टाग्राम पोस्ट, लिंक्डइन कंटेंट आणि सोशल मीडिया कॅप्शन तयार करा.',
      cta: 'आता तयार करणे सुरू करा',
      features: 'मुख्य वैशिष्ट्ये'
    },
    
    // Instagram Generator
    instagramGenerator: {
      title: 'इन्स्टाग्राम कंटेंट जेनेरेटर',
      contentType: 'कंटेंट प्रकार',
      post: 'पोस्ट',
      reel: 'रील',
      story: 'स्टोरी',
      topic: 'तुम्हाला कोणत्या विषयावर कंटेंट तयार करायचे आहे?',
      topicPlaceholder: 'तुमचा विषय प्रविष्ट करा (उदा. फिटनेस टिप्स, प्रवास साहस, खाद्य पदार्थ)',
      caption: 'तुम्हाला कॅप्शन हवे आहे का?',
      yes: 'होय',
      no: 'नाही',
      styles: 'कंटेंट शैली निवडा (पर्यायी)',
      wordCount: 'कॅप्शन शब्द संख्या',
      generate: 'कंटेंट तयार करा',
      regenerate: 'नवीन कंटेंट तयार करा',
      copyContent: 'कंटेंट कॉपी करा',
      copied: 'कॉपी केले!',
      generating: 'तयार करत आहे...'
    },
    
    // LinkedIn Generator
    linkedinGenerator: {
      title: 'लिंक्डइन कंटेंट जेनेरेटर',
      topic: 'तुम्हाला कोणत्या विषयावर लिहायचे आहे?',
      topicPlaceholder: 'तुमचा विषय प्रविष्ट करा (उदा. नेतृत्व टिप्स, उद्योग अंतर्दृष्टी, करिअर सल्ला)',
      style: 'कंटेंट शैली',
      professional: 'व्यावसायिक',
      casual: 'अनौपचारिक',
      inspirational: 'प्रेरणादायी',
      wordCount: 'कंटेंट शब्द संख्या',
      generate: 'कंटेंट तयार करा',
      regenerate: 'नवीन कंटेंट तयार करा',
      copyContent: 'कंटेंट कॉपी करा',
      copied: 'कॉपी केले!',
      generating: 'तयार करत आहे...'
    },
    
    // Auth
    auth: {
      login: 'लॉगिन',
      register: 'नोंदणी',
      username: 'वापरकर्ता नाव',
      password: 'पासवर्ड',
      loginButton: 'लॉगिन',
      registerButton: 'नोंदणी',
      switchToRegister: 'खाते नाही आहे? नोंदणी करा',
      switchToLogin: 'आधीपासूनच खाते आहे? लॉगिन करा'
    },
    
    // Word count options
    wordCounts: {
      50: '५० शब्द',
      100: '१०० शब्द',
      200: '२०० शब्द',
      300: '३०० शब्द',
      500: '५०० शब्द'
    }
  }
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en')

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('contentcraft-language')
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Save language to localStorage when it changes
  const changeLanguage = (newLanguage) => {
    if (translations[newLanguage]) {
      setLanguage(newLanguage)
      localStorage.setItem('contentcraft-language', newLanguage)
    }
  }

  const t = (key) => {
    const keys = key.split('.')
    let value = translations[language]
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k]
      } else {
        return key // Return the key if translation not found
      }
    }
    
    return value || key
  }

  const value = {
    language,
    changeLanguage,
    t
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}