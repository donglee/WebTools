'use client'

import { useCallback, useRef, useEffect } from 'react'
import { useCropStore, CropArea } from '@/store/cropStore'

export default function ImageCropper() {
  const {
    images,
    currentImageIndex,
    cropArea,
    isDragging,
    isResizing,
    dragStart,
    resizeHandle,
    isSquareMode,
    cropMode,
    setCropArea,
    setIsDragging,
    setIsResizing,
    setDragStart,
    setResizeHandle
  } = useCropStore()

  // 获取当前选中的图片
  const image = images[currentImageIndex] || null

  const containerRef = useRef<HTMLDivElement>(null)

  const constrainCropArea = useCallback((area: CropArea): CropArea => {
    if (!image) return area

    let constrainedArea = {
      x: Math.max(0, Math.min(area.x, image.width - area.width)),
      y: Math.max(0, Math.min(area.y, image.height - area.height)),
      width: Math.max(50, Math.min(area.width, image.width - area.x)),
      height: Math.max(50, Math.min(area.height, image.height - area.y))
    }

    // 根据裁剪模式约束比例
    if (cropMode === 'square') {
      const size = Math.min(constrainedArea.width, constrainedArea.height)
      constrainedArea.width = size
      constrainedArea.height = size
      
      // 重新约束位置以确保正方形不超出边界
      constrainedArea.x = Math.max(0, Math.min(constrainedArea.x, image.width - size))
      constrainedArea.y = Math.max(0, Math.min(constrainedArea.y, image.height - size))
    } else if (cropMode === '16:9') {
      const aspectRatio = 16 / 9
      const currentAspectRatio = constrainedArea.width / constrainedArea.height
      
      if (currentAspectRatio > aspectRatio) {
        constrainedArea.width = constrainedArea.height * aspectRatio
      } else {
        constrainedArea.height = constrainedArea.width / aspectRatio
      }
      
      // 重新约束位置
      constrainedArea.x = Math.max(0, Math.min(constrainedArea.x, image.width - constrainedArea.width))
      constrainedArea.y = Math.max(0, Math.min(constrainedArea.y, image.height - constrainedArea.height))
    } else if (cropMode === '9:16') {
      const aspectRatio = 9 / 16
      const currentAspectRatio = constrainedArea.width / constrainedArea.height
      
      if (currentAspectRatio > aspectRatio) {
        constrainedArea.width = constrainedArea.height * aspectRatio
      } else {
        constrainedArea.height = constrainedArea.width / aspectRatio
      }
      
      // 重新约束位置
      constrainedArea.x = Math.max(0, Math.min(constrainedArea.x, image.width - constrainedArea.width))
      constrainedArea.y = Math.max(0, Math.min(constrainedArea.y, image.height - constrainedArea.height))
    } else if (cropMode === '4:3') {
      const aspectRatio = 4 / 3
      const currentAspectRatio = constrainedArea.width / constrainedArea.height
      
      if (currentAspectRatio > aspectRatio) {
        constrainedArea.width = constrainedArea.height * aspectRatio
      } else {
        constrainedArea.height = constrainedArea.width / aspectRatio
      }
      
      // 重新约束位置
      constrainedArea.x = Math.max(0, Math.min(constrainedArea.x, image.width - constrainedArea.width))
      constrainedArea.y = Math.max(0, Math.min(constrainedArea.y, image.height - constrainedArea.height))
    } else if (cropMode === '3:4') {
      const aspectRatio = 3 / 4
      const currentAspectRatio = constrainedArea.width / constrainedArea.height
      
      if (currentAspectRatio > aspectRatio) {
        constrainedArea.width = constrainedArea.height * aspectRatio
      } else {
        constrainedArea.height = constrainedArea.width / aspectRatio
      }
      
      // 重新约束位置
      constrainedArea.x = Math.max(0, Math.min(constrainedArea.x, image.width - constrainedArea.width))
      constrainedArea.y = Math.max(0, Math.min(constrainedArea.y, image.height - constrainedArea.height))
    }
    // 自由模式不需要额外约束

    return constrainedArea
  }, [image, cropMode])

  const handleMouseDown = useCallback((event: React.MouseEvent, type: 'drag' | 'resize', handle?: string) => {
    event.preventDefault()
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    setDragStart({ x, y })
    
    if (type === 'drag') {
      setIsDragging(true)
    } else {
      setIsResizing(true)
      setResizeHandle(handle || null)
    }
  }, [setDragStart, setIsDragging, setIsResizing, setResizeHandle])

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!dragStart || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const currentX = event.clientX - rect.left
    const currentY = event.clientY - rect.top
    const deltaX = currentX - dragStart.x
    const deltaY = currentY - dragStart.y

    if (isDragging) {
      const newArea = {
        ...cropArea,
        x: cropArea.x + deltaX,
        y: cropArea.y + deltaY
      }
      setCropArea(constrainCropArea(newArea))
      setDragStart({ x: currentX, y: currentY })
    } else if (isResizing && resizeHandle) {
      let newArea = { ...cropArea }

      if (isSquareMode) {
        // 正方形模式下，使用较大的变化量来保持正方形
        const delta = Math.max(Math.abs(deltaX), Math.abs(deltaY))
        const signX = deltaX >= 0 ? 1 : -1
        const signY = deltaY >= 0 ? 1 : -1
        
        switch (resizeHandle) {
          case 'nw':
            newArea.x += delta * -signX
            newArea.y += delta * -signY
            newArea.width -= delta * -signX
            newArea.height -= delta * -signY
            break
          case 'ne':
            newArea.y += delta * -signY
            newArea.width += delta * signX
            newArea.height -= delta * -signY
            break
          case 'sw':
            newArea.x += delta * -signX
            newArea.width -= delta * -signX
            newArea.height += delta * signY
            break
          case 'se':
            newArea.width += delta * signX
            newArea.height += delta * signY
            break
        }
      } else {
        // 自由模式下的原始逻辑
        switch (resizeHandle) {
          case 'nw':
            newArea.x += deltaX
            newArea.y += deltaY
            newArea.width -= deltaX
            newArea.height -= deltaY
            break
          case 'ne':
            newArea.y += deltaY
            newArea.width += deltaX
            newArea.height -= deltaY
            break
          case 'sw':
            newArea.x += deltaX
            newArea.width -= deltaX
            newArea.height += deltaY
            break
          case 'se':
            newArea.width += deltaX
            newArea.height += deltaY
            break
        }
      }

      setCropArea(constrainCropArea(newArea))
      setDragStart({ x: currentX, y: currentY })
    }
  }, [dragStart, isDragging, isResizing, resizeHandle, cropArea, setCropArea, constrainCropArea, setDragStart])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setIsResizing(false)
    setDragStart(null)
    setResizeHandle(null)
  }, [setIsDragging, setIsResizing, setDragStart, setResizeHandle])

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp])

  if (!image) return null

  return (
    <div className="flex justify-center">
      <div
        ref={containerRef}
        className="crop-container relative inline-block"
        style={{
          width: image.width,
          height: image.height
        }}
      >
        <img
          src={image.src}
          alt="Crop preview"
          className="block max-w-none"
          style={{
            width: image.width,
            height: image.height
          }}
          draggable={false}
        />
        
        {/* Crop overlay */}
        <div
          className="crop-overlay"
          style={{
            left: cropArea.x,
            top: cropArea.y,
            width: cropArea.width,
            height: cropArea.height
          }}
          onMouseDown={(e) => handleMouseDown(e, 'drag')}
        >
          {/* Resize handles */}
          <div
            className="crop-handle nw"
            onMouseDown={(e) => {
              e.stopPropagation()
              handleMouseDown(e, 'resize', 'nw')
            }}
          />
          <div
            className="crop-handle ne"
            onMouseDown={(e) => {
              e.stopPropagation()
              handleMouseDown(e, 'resize', 'ne')
            }}
          />
          <div
            className="crop-handle sw"
            onMouseDown={(e) => {
              e.stopPropagation()
              handleMouseDown(e, 'resize', 'sw')
            }}
          />
          <div
            className="crop-handle se"
            onMouseDown={(e) => {
              e.stopPropagation()
              handleMouseDown(e, 'resize', 'se')
            }}
          />
        </div>
      </div>
    </div>
  )
}