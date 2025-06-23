'use client'

import { useCropStore } from '@/store/cropStore'
import ImageCropper from '@/components/ImageCropper'
import ImageGallery from '@/components/ImageGallery'
import ControlPanel from '@/components/ControlPanel'
import { useLanguageStore } from '@/store/languageStore'
import { ScissorsIcon } from '@heroicons/react/24/outline'

export default function Home() {
  const { images, currentImageIndex } = useCropStore()
  const { t } = useLanguageStore()
  
  const hasImages = images.length > 0
  const currentImage = images[currentImageIndex] || null

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-6">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <ScissorsIcon className="h-7 w-7 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              {t('pageTitle')}
            </h1>
          </div>
          <p className="text-gray-600 text-sm max-w-2xl mx-auto">
            {t('pageDescription')}
          </p>
        </div>

        {/* Main Content */}
        {/* Processing Layout */}
        <div className="space-y-6">
          {/* Image Gallery Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <ImageGallery />
          </div>
            
          {/* Image Cropper */}
          {currentImage && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <ImageCropper />
            </div>
          )}
          
          {/* Control Panel */}
          {currentImage && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <ControlPanel />
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-blue-600 mb-3">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">智能居中</h3>
            <p className="text-gray-600 text-sm">
              一键自动居中裁剪区域，快速获得最佳构图效果
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-blue-600 mb-3">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">精确裁剪</h3>
            <p className="text-gray-600 text-sm">
              支持拖拽移动和调整大小，精确控制裁剪区域
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-blue-600 mb-3">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">高质量输出</h3>
            <p className="text-gray-600 text-sm">
              保持原图质量，支持PNG格式下载，无损裁剪
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}