'use client'

import { useLanguageStore } from '@/store/languageStore'
import { GlobeAltIcon } from '@heroicons/react/24/outline'

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguageStore()

  return (
    <button
      onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
      className="fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200 text-sm font-medium text-gray-700 hover:text-gray-900"
      title={language === 'zh' ? '切换到英文' : 'Switch to Chinese'}
    >
      <GlobeAltIcon className="h-4 w-4" />
      <span>{language === 'zh' ? 'EN' : '中'}</span>
    </button>
  )
}