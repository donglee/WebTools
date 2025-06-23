import { create } from 'zustand'

export type Language = 'zh' | 'en'

export interface Translations {
  // Page content
  pageTitle: string
  pageDescription: string
  selectImageTitle: string
  adjustCropTitle: string
  operationTips: string
  
  // Control Panel
  freeCrop: string
  squareCrop: string
  centerCrop: string
  resetCrop: string
  download: string
  downloadImage: string
  downloadAll: string
  clearAll: string
  
  // Image Upload
  uploadPrompt: string
  uploadMultiple: string
  supportedFormats: string
  fileTypeError: string
  dropImages: string
  addImage: string
  
  // Image Gallery
  imageGallery: string
  currentImage: string
  removeImage: string
  noImages: string
  images: string
}

const translations: Record<Language, Translations> = {
  zh: {
    pageTitle: 'Sprite Cutter',
    pageDescription: '专业的图片裁剪工具，支持拖拽调整、自动居中和精确裁剪。上传您的图片，轻松获得完美的裁剪效果。',
    selectImageTitle: '选择要裁剪的图片',
    adjustCropTitle: '调整裁剪区域',
    operationTips: '拖拽移动 • 拖拽角落调整大小',
    
    freeCrop: '自由裁剪',
    squareCrop: '正方形裁剪',
    centerCrop: '居中裁剪',
    resetCrop: '重置裁剪',
    download: '下载',
    downloadImage: '下载当前图片',
    downloadAll: '下载所有图片',
    clearAll: '清空所有图片',
    
    uploadPrompt: '点击上传图片 或拖拽图片到此处',
    uploadMultiple: '支持选择多张图片',
    supportedFormats: '支持 PNG, JPG, GIF 格式',
    fileTypeError: '请选择图片文件',
    dropImages: '拖拽图片到此处',
    addImage: '添加图片',
    
    imageGallery: '图片库',
    currentImage: '当前图片',
    removeImage: '删除图片',
    noImages: '暂无图片，请先上传图片',
    images: '张图片'
  },
  en: {
    pageTitle: 'Sprite Cutter',
    pageDescription: 'Professional image cropping tool with drag-and-drop adjustment, auto-centering, and precise cropping. Upload your image and easily achieve perfect cropping results.',
    selectImageTitle: 'Select Image to Crop',
    adjustCropTitle: 'Adjust Crop Area',
    operationTips: 'Drag to Move • Drag Corners to Resize',
    
    freeCrop: 'Free Crop',
    squareCrop: 'Square Crop',
    centerCrop: 'Center Crop',
    resetCrop: 'Reset Crop',
    download: 'Download',
    downloadImage: 'Download Current Image',
    downloadAll: 'Download All Images',
    clearAll: 'Clear All Images',
    
    uploadPrompt: 'Click to Upload Image or Drag Image Here',
    uploadMultiple: 'Support multiple image selection',
    supportedFormats: 'Supports PNG, JPG, GIF formats',
    fileTypeError: 'Please select an image file',
    dropImages: 'Drag Images Here',
    addImage: 'Add Image',
    
    imageGallery: 'Image Gallery',
    currentImage: 'Current Image',
    removeImage: 'Remove Image',
    noImages: 'No images yet, please upload images first',
    images: 'images'
  }
}

interface LanguageState {
  language: Language
  translations: Translations
  setLanguage: (language: Language) => void
  t: (key: keyof Translations) => string
}

// 获取初始语言设置
const getInitialLanguage = (): Language => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('sprite-cutter-language')
    if (saved === 'zh' || saved === 'en') {
      return saved
    }
    // 检测浏览器语言
    const browserLang = navigator.language.toLowerCase()
    return browserLang.startsWith('zh') ? 'zh' : 'en'
  }
  return 'zh'
}

const initialLanguage = getInitialLanguage()

export const useLanguageStore = create<LanguageState>((set, get) => ({
  language: initialLanguage,
  translations: translations[initialLanguage],
  
  setLanguage: (language: Language) => {
    // 保存到localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('sprite-cutter-language', language)
    }
    
    set({
      language,
      translations: translations[language]
    })
  },
  
  t: (key: keyof Translations) => {
    return get().translations[key]
  }
}))