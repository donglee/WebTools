'use client'

import { useCropStore } from '@/store/cropStore'
import { useLanguageStore } from '@/store/languageStore'
import { XMarkIcon, PhotoIcon, PlusIcon } from '@heroicons/react/24/outline'
import { CheckIcon } from '@heroicons/react/24/solid'
import { useCallback, useState } from 'react'

export default function ImageGallery() {
  const { images, currentImageIndex, setCurrentImage, removeImage, clearImages, addImages } = useCropStore()
  const { t } = useLanguageStore()
  const [isDragOver, setIsDragOver] = useState(false)

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
    // 重置input值，允许重复选择同一文件
    event.target.value = ''
  }, [processFiles])

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // 检查是否包含文件
    if (e.dataTransfer.types.includes('Files')) {
      setIsDragOver(true)
    }
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // 只有当离开整个容器时才重置状态
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragOver(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      processFiles(files)
    }
  }, [processFiles])



  return (
    <div 
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`transition-all duration-200 rounded-xl p-4 ${
        isDragOver 
          ? 'bg-blue-50 border-2 border-dashed border-blue-400 shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-700">
          {images.length > 0 ? `${images.length} ${t('images') || '张图片'}` : t('imageGallery') || '图片库'}
        </span>
        {images.length > 0 && (
          <button
            onClick={clearImages}
            className="text-xs text-red-600 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
          >
            {t('clearAll')}
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2">
        {/* Add Image Button */}
        <label htmlFor="gallery-file-upload" className="cursor-pointer">
          <div className={`aspect-square relative border-2 border-dashed rounded-xl transition-all duration-200 flex items-center justify-center group ${
            isDragOver 
              ? 'border-blue-500 bg-blue-100 scale-105' 
              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
          }`}>
            <div className="text-center">
              <PlusIcon className={`h-8 w-8 mx-auto mb-1 transition-colors ${
                isDragOver 
                  ? 'text-blue-600' 
                  : 'text-gray-400 group-hover:text-blue-500'
              }`} />
              <p className={`text-xs transition-colors ${
                isDragOver 
                  ? 'text-blue-700 font-medium' 
                  : 'text-gray-500 group-hover:text-blue-600'
              }`}>
                {isDragOver ? (t('dropImages') || '拖放图片') : (t('addImage') || '添加图片')}
              </p>
            </div>
          </div>
        </label>
        
        {/* Image List */}
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`relative group cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-200 hover:shadow-lg ${
              index === currentImageIndex
                ? 'border-blue-500 ring-2 ring-blue-200 shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setCurrentImage(index)}
          >
            <div className="aspect-square relative">
              <img
                src={image.src}
                alt={image.name}
                className="w-full h-full object-cover"
              />
              
              {/* Current image indicator */}
              {index === currentImageIndex && (
                <div className="absolute top-2 left-2 bg-blue-500 text-white rounded-full p-1.5 shadow-lg">
                  <CheckIcon className="h-3 w-3" />
                </div>
              )}
              
              {/* Remove button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  console.log('Removing image at index:', index)
                  removeImage(index)
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 hover:scale-110 shadow-lg"
                title="删除图片"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
              
              {/* Image overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200" />
            </div>
            
            {/* Image name */}
            <div className="p-2 bg-white">
              <p className="text-xs text-gray-600 truncate font-medium" title={image.name}>
                {image.name}
              </p>
              <p className="text-xs text-gray-400">
                {image.naturalWidth} × {image.naturalHeight}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Hidden file input */}
      <input
        id="gallery-file-upload"
        name="gallery-file-upload"
        type="file"
        className="sr-only"
        accept="image/*"
        multiple
        onChange={handleFileChange}
      />
      
      {currentImageIndex >= 0 && images.length > 0 && (
        <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">{t('currentImage') || '当前选中'}:</span> 
            <span className="ml-1">{images[currentImageIndex]?.name}</span>
          </p>
        </div>
      )}
    </div>
  )
}