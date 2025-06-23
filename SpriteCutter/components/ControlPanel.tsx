'use client'

import { ArrowPathIcon, ArrowsPointingInIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { useCropStore } from '@/store/cropStore'
import { useLanguageStore } from '@/store/languageStore'

export default function ControlPanel() {
  const { image, images, cropArea, isSquareMode, cropMode, centerCrop, resetCrop, setSquareMode, setCropMode } = useCropStore()
  const { t } = useLanguageStore()

  const downloadImage = () => {
    if (!image || !cropArea) return
    
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    canvas.width = cropArea.width * scaleX
    canvas.height = cropArea.height * scaleY

    const img = new Image()
    img.onload = () => {
      ctx.drawImage(
        img,
        cropArea.x * scaleX,
        cropArea.y * scaleY,
        cropArea.width * scaleX,
        cropArea.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
      )

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `cropped-${image.name || 'image'}.png`
          a.click()
          URL.revokeObjectURL(url)
        }
      })
    }
    img.src = image.src
  }

  const downloadAllImages = () => {
    if (images.length === 0) return
    
    images.forEach((img, index) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const scaleX = img.naturalWidth / img.width
      const scaleY = img.naturalHeight / img.height

      canvas.width = cropArea.width * scaleX
      canvas.height = cropArea.height * scaleY

      const imageElement = new Image()
      imageElement.onload = () => {
        ctx.drawImage(
          imageElement,
          cropArea.x * scaleX,
          cropArea.y * scaleY,
          cropArea.width * scaleX,
          cropArea.height * scaleY,
          0,
          0,
          canvas.width,
          canvas.height
        )

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `cropped-${img.name || `image-${index + 1}`}.png`
            setTimeout(() => {
              a.click()
              URL.revokeObjectURL(url)
            }, index * 100)
          }
        })
      }
      imageElement.src = img.src
    })
  }

  if (!image) return null

  return (
    <div className="space-y-4">
      {/* All Controls in One Row */}
      <div className="flex flex-wrap items-center gap-2 p-4 bg-gray-50 rounded-xl">
        {/* Crop Mode Selection */}
        <div className="flex gap-2">
          <button
            onClick={() => setCropMode('free')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
              cropMode === 'free'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {t('freeCrop')}
          </button>
          <button
            onClick={() => setCropMode('square')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
              cropMode === 'square'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {t('squareCrop')}
          </button>
          <button
            onClick={() => setCropMode('4:3')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
              cropMode === '4:3'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            4:3
          </button>
          <button
            onClick={() => setCropMode('3:4')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
              cropMode === '3:4'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            3:4
          </button>
          <button
            onClick={() => setCropMode('16:9')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
              cropMode === '16:9'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            16:9
          </button>
          <button
            onClick={() => setCropMode('9:16')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
              cropMode === '9:16'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            9:16
          </button>
        </div>

        {/* Separator */}
        <div className="h-6 w-px bg-gray-300 mx-2"></div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={centerCrop}
            className="flex items-center gap-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 text-base font-medium"
          >
            <ArrowsPointingInIcon className="h-4 w-4" />
            {t('centerCrop')}
          </button>
          <button
            onClick={resetCrop}
            className="flex items-center gap-1 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 text-base font-medium"
          >
            <ArrowPathIcon className="h-4 w-4" />
            {t('resetCrop')}
          </button>
        </div>

        {/* Separator */}
        <div className="h-6 w-px bg-gray-300 mx-2"></div>

        {/* Download Buttons */}
        <div className="flex gap-2 ml-auto">
          <button
            onClick={downloadImage}
            disabled={!image}
            className="flex items-center gap-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 text-xs font-semibold"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            {t('download')}
          </button>
          
          {images.length > 1 && (
            <button
              onClick={downloadAllImages}
              className="flex items-center gap-1 px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all duration-200 text-xs font-semibold"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              {t('downloadAll')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}