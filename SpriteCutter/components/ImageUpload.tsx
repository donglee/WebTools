'use client'

import { useCallback } from 'react'
import { useCropStore } from '@/store/cropStore'
import { useLanguageStore } from '@/store/languageStore'
import { CloudArrowUpIcon } from '@heroicons/react/24/outline'

export default function ImageUpload() {
  const { addImages } = useCropStore()
  const { t } = useLanguageStore()

  const processFiles = useCallback((files: FileList) => {
    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'))
    
    if (imageFiles.length === 0) {
      alert(t('fileTypeError'))
      return
    }

    const processedImages: any[] = []
    let processedCount = 0

    imageFiles.forEach((file, index) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          // Calculate display size while maintaining aspect ratio
          const maxDisplaySize = 600
          const aspectRatio = img.naturalWidth / img.naturalHeight
          
          let displayWidth = img.naturalWidth
          let displayHeight = img.naturalHeight
          
          if (displayWidth > maxDisplaySize || displayHeight > maxDisplaySize) {
            if (aspectRatio > 1) {
              displayWidth = maxDisplaySize
              displayHeight = maxDisplaySize / aspectRatio
            } else {
              displayHeight = maxDisplaySize
              displayWidth = maxDisplaySize * aspectRatio
            }
          }

          processedImages[index] = {
            id: `${Date.now()}-${index}`,
            src: e.target?.result as string,
            width: displayWidth,
            height: displayHeight,
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
            name: file.name
          }
          
          processedCount++
          if (processedCount === imageFiles.length) {
            addImages(processedImages.filter(Boolean))
          }
        }
        img.src = e.target?.result as string
      }
      reader.readAsDataURL(file)
    })
  }, [addImages, t])

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return
    processFiles(files)
  }, [processFiles])

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const files = event.dataTransfer.files
    if (files && files.length > 0) {
      processFiles(files)
    }
  }, [processFiles])

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }, [])

  return (
    <div className="w-full">
      <label htmlFor="file-upload" className="cursor-pointer">
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <CloudArrowUpIcon className="mx-auto h-8 w-8 text-gray-400" />
          <div className="mt-2">
            <p className="text-sm text-gray-600">
              <span className="font-medium text-blue-600 hover:text-blue-500">
                {t('uploadPrompt')}
              </span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {t('supportedFormats')}
            </p>
          </div>
        </div>
      </label>
      <input
        id="file-upload"
        name="file-upload"
        type="file"
        className="sr-only"
        accept="image/*"
        multiple
        onChange={handleFileChange}
      />
    </div>
  )
}