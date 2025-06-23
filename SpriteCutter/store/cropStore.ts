import { create } from 'zustand'

export interface CropArea {
  x: number
  y: number
  width: number
  height: number
}

export interface ImageData {
  id: string
  src: string
  width: number
  height: number
  naturalWidth: number
  naturalHeight: number
  name: string
}

interface CropState {
  images: ImageData[]
  currentImageIndex: number
  image: ImageData | null
  cropArea: CropArea
  cropAreas: Record<string, CropArea> // 存储每张图片的裁剪区域
  isDragging: boolean
  isResizing: boolean
  dragStart: { x: number; y: number } | null
  resizeHandle: string | null
  isSquareMode: boolean
  cropMode: 'free' | 'square' | '4:3' | '3:4' | '16:9' | '9:16'
  
  // Actions
  addImages: (images: ImageData[]) => void
  setCurrentImage: (index: number) => void
  removeImage: (index: number) => void
  clearImages: () => void
  setImage: (image: ImageData) => void
  setCropArea: (area: CropArea) => void
  setIsDragging: (dragging: boolean) => void
  setIsResizing: (resizing: boolean) => void
  setDragStart: (start: { x: number; y: number } | null) => void
  setResizeHandle: (handle: string | null) => void
  setSquareMode: (isSquare: boolean) => void
  setCropMode: (mode: 'free' | 'square' | '4:3' | '3:4' | '16:9' | '9:16') => void
  resetCrop: () => void
  centerCrop: () => void
  fitImageCrop: () => void
}

const initialCropArea: CropArea = {
  x: 50,
  y: 50,
  width: 200,
  height: 200
}

export const useCropStore = create<CropState>((set, get) => ({
  images: [],
  currentImageIndex: -1,
  image: null,
  cropArea: initialCropArea,
  cropAreas: {}, // 初始化为空对象
  isDragging: false,
  isResizing: false,
  dragStart: null,
  resizeHandle: null,
  isSquareMode: true,
  cropMode: 'free' as 'free' | 'square' | '4:3' | '3:4' | '16:9' | '9:16',

  addImages: (newImages) => {
    const { images } = get()
    const updatedImages = [...images, ...newImages]
    set({ 
      images: updatedImages,
      currentImageIndex: images.length === 0 ? 0 : get().currentImageIndex,
      image: images.length === 0 ? updatedImages[0] : get().image
    })
    if (images.length === 0 && updatedImages.length > 0) {
      get().centerCrop()
    }
  },

  setCurrentImage: (index) => {
    const { images, cropAreas, image: currentImage } = get()
    if (index >= 0 && index < images.length) {
      // 保存当前图片的裁剪区域
      if (currentImage) {
        const currentCropArea = get().cropArea
        set(state => ({
          cropAreas: {
            ...state.cropAreas,
            [currentImage.id]: currentCropArea
          }
        }))
      }
      
      const newImage = images[index]
      // 获取新图片的裁剪区域，如果没有则使用默认值
      const newCropArea = cropAreas[newImage.id] || initialCropArea
      
      set({ 
        currentImageIndex: index,
        image: newImage,
        cropArea: newCropArea
      })
    }
  },

  removeImage: (index) => {
    const { images, currentImageIndex } = get()
    const updatedImages = images.filter((_, i) => i !== index)
    let newCurrentIndex = currentImageIndex
    
    if (index === currentImageIndex) {
      newCurrentIndex = index < updatedImages.length ? index : updatedImages.length - 1
    } else if (index < currentImageIndex) {
      newCurrentIndex = currentImageIndex - 1
    }
    
    set({ 
      images: updatedImages,
      currentImageIndex: newCurrentIndex,
      image: updatedImages.length > 0 ? updatedImages[newCurrentIndex] : null
    })
  },

  clearImages: () => {
    set({ 
      images: [],
      currentImageIndex: -1,
      image: null
    })
  },

  setImage: (image) => {
    set({ image })
    // Auto-center crop when new image is loaded
    get().centerCrop()
  },

  setCropArea: (area) => {
    const { image } = get()
    set({ cropArea: area })
    // 同时更新cropAreas中对应图片的裁剪区域
    if (image) {
      set(state => ({
        cropAreas: {
          ...state.cropAreas,
          [image.id]: area
        }
      }))
    }
  },

  setIsDragging: (dragging) => set({ isDragging: dragging }),

  setIsResizing: (resizing) => set({ isResizing: resizing }),

  setDragStart: (start) => set({ dragStart: start }),

  setResizeHandle: (handle) => set({ resizeHandle: handle }),

  setSquareMode: (isSquare) => {
    set({ isSquareMode: isSquare })
    if (isSquare) {
      const { cropArea } = get()
      const size = Math.min(cropArea.width, cropArea.height)
      get().setCropArea({
        ...cropArea,
        width: size,
        height: size
      })
    }
  },

  setCropMode: (mode) => {
    set({ cropMode: mode })
    const { cropArea } = get()
    
    if (mode === 'square') {
      set({ isSquareMode: true })
      const size = Math.min(cropArea.width, cropArea.height)
      get().setCropArea({
        ...cropArea,
        width: size,
        height: size
      })
    } else if (mode === '16:9') {
      set({ isSquareMode: false })
      const aspectRatio = 16 / 9
      const currentAspectRatio = cropArea.width / cropArea.height
      
      if (currentAspectRatio > aspectRatio) {
        const newWidth = cropArea.height * aspectRatio
        get().setCropArea({
          ...cropArea,
          width: newWidth,
          x: cropArea.x + (cropArea.width - newWidth) / 2
        })
      } else {
        const newHeight = cropArea.width / aspectRatio
        get().setCropArea({
          ...cropArea,
          height: newHeight,
          y: cropArea.y + (cropArea.height - newHeight) / 2
        })
      }
    } else if (mode === '9:16') {
      set({ isSquareMode: false })
      const aspectRatio = 9 / 16
      const currentAspectRatio = cropArea.width / cropArea.height
      
      if (currentAspectRatio > aspectRatio) {
        const newWidth = cropArea.height * aspectRatio
        get().setCropArea({
          ...cropArea,
          width: newWidth,
          x: cropArea.x + (cropArea.width - newWidth) / 2
        })
      } else {
        const newHeight = cropArea.width / aspectRatio
        get().setCropArea({
          ...cropArea,
          height: newHeight,
          y: cropArea.y + (cropArea.height - newHeight) / 2
        })
      }
    } else if (mode === '4:3') {
      set({ isSquareMode: false })
      const aspectRatio = 4 / 3
      const currentAspectRatio = cropArea.width / cropArea.height
      
      if (currentAspectRatio > aspectRatio) {
        const newWidth = cropArea.height * aspectRatio
        get().setCropArea({
          ...cropArea,
          width: newWidth,
          x: cropArea.x + (cropArea.width - newWidth) / 2
        })
      } else {
        const newHeight = cropArea.width / aspectRatio
        get().setCropArea({
          ...cropArea,
          height: newHeight,
          y: cropArea.y + (cropArea.height - newHeight) / 2
        })
      }
    } else if (mode === '3:4') {
      set({ isSquareMode: false })
      const aspectRatio = 3 / 4
      const currentAspectRatio = cropArea.width / cropArea.height
      
      if (currentAspectRatio > aspectRatio) {
        const newWidth = cropArea.height * aspectRatio
        get().setCropArea({
          ...cropArea,
          width: newWidth,
          x: cropArea.x + (cropArea.width - newWidth) / 2
        })
      } else {
        const newHeight = cropArea.width / aspectRatio
        get().setCropArea({
          ...cropArea,
          height: newHeight,
          y: cropArea.y + (cropArea.height - newHeight) / 2
        })
      }
    } else {
      // free mode
      set({ isSquareMode: false })
    }
  },

  resetCrop: () => set({ cropArea: initialCropArea }),

  centerCrop: () => {
    const { image, isSquareMode } = get()
    if (!image) return

    // Create a temporary canvas to analyze the image
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Create an image element to load the source
    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    img.onload = () => {
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      ctx.drawImage(img, 0, 0)
      
      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data
        
        let minX = canvas.width, minY = canvas.height
        let maxX = 0, maxY = 0
        let hasContent = false
        
        // Scan for non-transparent pixels
        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            const alpha = data[(y * canvas.width + x) * 4 + 3]
            if (alpha > 0) { // Non-transparent pixel
              hasContent = true
              minX = Math.min(minX, x)
              minY = Math.min(minY, y)
              maxX = Math.max(maxX, x)
              maxY = Math.max(maxY, y)
            }
          }
        }
        
        if (!hasContent) {
          // If no content found, fallback to full image
          minX = 0
          minY = 0
          maxX = canvas.width - 1
          maxY = canvas.height - 1
        }
        
        // Calculate content bounds
        const contentWidth = maxX - minX + 1
        const contentHeight = maxY - minY + 1
        
        // Scale to display dimensions
        const scaleX = image.width / canvas.width
        const scaleY = image.height / canvas.height
        
        const scaledX = minX * scaleX
        const scaledY = minY * scaleY
        const scaledWidth = contentWidth * scaleX
        const scaledHeight = contentHeight * scaleY
        
        let cropWidth, cropHeight, cropX, cropY
        
        if (isSquareMode) {
          // For square mode, use the larger dimension and center it
          const size = Math.max(scaledWidth, scaledHeight)
          cropWidth = size
          cropHeight = size
          cropX = scaledX + (scaledWidth - size) / 2
          cropY = scaledY + (scaledHeight - size) / 2
        } else {
          cropWidth = scaledWidth
          cropHeight = scaledHeight
          cropX = scaledX
          cropY = scaledY
        }
        
        const fitCrop: CropArea = {
          x: Math.max(0, cropX),
          y: Math.max(0, cropY),
          width: Math.min(cropWidth, image.width - Math.max(0, cropX)),
          height: Math.min(cropHeight, image.height - Math.max(0, cropY))
        }
        
        set({ cropArea: fitCrop })
      } catch (error) {
        console.warn('无法分析图片内容，使用默认包围:', error)
        // Fallback to original behavior
        let cropWidth, cropHeight
        if (isSquareMode) {
          const size = Math.min(image.width, image.height)
          cropWidth = size
          cropHeight = size
        } else {
          cropWidth = image.width
          cropHeight = image.height
        }

        const fitCrop: CropArea = {
          x: (image.width - cropWidth) / 2,
          y: (image.height - cropHeight) / 2,
          width: cropWidth,
          height: cropHeight
        }
        
        set({ cropArea: fitCrop })
      }
    }
    
    img.onerror = () => {
      console.warn('无法加载图片进行内容分析，使用默认包围')
      // Fallback to original behavior
      let cropWidth, cropHeight
      if (isSquareMode) {
        const size = Math.min(image.width, image.height)
        cropWidth = size
        cropHeight = size
      } else {
        cropWidth = image.width
        cropHeight = image.height
      }

      const fitCrop: CropArea = {
        x: (image.width - cropWidth) / 2,
        y: (image.height - cropHeight) / 2,
        width: cropWidth,
        height: cropHeight
      }
      
      set({ cropArea: fitCrop })
    }
    
    img.src = image.src
  },

  fitImageCrop: () => {
    const { image, isSquareMode } = get()
    if (!image) return

    // Create a temporary canvas to analyze the image
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Create an image element to load the source
    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    img.onload = () => {
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      ctx.drawImage(img, 0, 0)
      
      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data
        
        let minX = canvas.width, minY = canvas.height
        let maxX = 0, maxY = 0
        let hasContent = false
        
        // Scan for non-transparent pixels
        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            const alpha = data[(y * canvas.width + x) * 4 + 3]
            if (alpha > 0) { // Non-transparent pixel
              hasContent = true
              minX = Math.min(minX, x)
              minY = Math.min(minY, y)
              maxX = Math.max(maxX, x)
              maxY = Math.max(maxY, y)
            }
          }
        }
        
        if (!hasContent) {
          // If no content found, fallback to full image
          minX = 0
          minY = 0
          maxX = canvas.width - 1
          maxY = canvas.height - 1
        }
        
        // Calculate content bounds
        const contentWidth = maxX - minX + 1
        const contentHeight = maxY - minY + 1
        
        // Scale to display dimensions
        const scaleX = image.width / canvas.width
        const scaleY = image.height / canvas.height
        
        const scaledX = minX * scaleX
        const scaledY = minY * scaleY
        const scaledWidth = contentWidth * scaleX
        const scaledHeight = contentHeight * scaleY
        
        let cropWidth, cropHeight, cropX, cropY
        
        if (isSquareMode) {
          // For square mode, use the larger dimension and center it
          const size = Math.max(scaledWidth, scaledHeight)
          cropWidth = size
          cropHeight = size
          cropX = scaledX + (scaledWidth - size) / 2
          cropY = scaledY + (scaledHeight - size) / 2
        } else {
          cropWidth = scaledWidth
          cropHeight = scaledHeight
          cropX = scaledX
          cropY = scaledY
        }
        
        const fitCrop: CropArea = {
          x: Math.max(0, cropX),
          y: Math.max(0, cropY),
          width: Math.min(cropWidth, image.width - Math.max(0, cropX)),
          height: Math.min(cropHeight, image.height - Math.max(0, cropY))
        }
        
        set({ cropArea: fitCrop })
      } catch (error) {
        console.warn('无法分析图片内容，使用默认包围:', error)
        // Fallback to original behavior
        let cropWidth, cropHeight
        if (isSquareMode) {
          const size = Math.min(image.width, image.height)
          cropWidth = size
          cropHeight = size
        } else {
          cropWidth = image.width
          cropHeight = image.height
        }

        const fitCrop: CropArea = {
          x: (image.width - cropWidth) / 2,
          y: (image.height - cropHeight) / 2,
          width: cropWidth,
          height: cropHeight
        }
        
        set({ cropArea: fitCrop })
      }
    }
    
    img.onerror = () => {
      console.warn('无法加载图片进行内容分析，使用默认包围')
      // Fallback to original behavior
      let cropWidth, cropHeight
      if (isSquareMode) {
        const size = Math.min(image.width, image.height)
        cropWidth = size
        cropHeight = size
      } else {
        cropWidth = image.width
        cropHeight = image.height
      }

      const fitCrop: CropArea = {
        x: (image.width - cropWidth) / 2,
        y: (image.height - cropHeight) / 2,
        width: cropWidth,
        height: cropHeight
      }
      
      set({ cropArea: fitCrop })
    }
    
    img.src = image.src
  }
}))