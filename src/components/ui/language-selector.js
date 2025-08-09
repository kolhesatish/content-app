'use client'

import { Languages } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/LanguageContext'

export function LanguageSelector() {
  const { language, changeLanguage } = useLanguage()

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' }
  ]

  return (
    <div className="relative group">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center space-x-2 bg-gray-800/50 border-gray-700 hover:bg-gray-700/50"
      >
        <Languages className="w-4 h-4" />
        <span className="hidden sm:inline">
          {languages.find(lang => lang.code === language)?.nativeName || 'English'}
        </span>
      </Button>
      
      <div className="absolute right-0 mt-1 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 z-50">
        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg min-w-[120px] glass-card">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-gray-700/50 first:rounded-t-lg last:rounded-b-lg ${
                language === lang.code 
                  ? 'text-primary bg-gray-700/30' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {lang.nativeName}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}