import { useRef, useState } from 'react'
import type { ImageConfig } from '../../types'
import { cropAndResizeImage, isImageFile, isSupportedImageType, isValidFileSize } from '../../utils/imageUtils'

interface ImageUploadProps {
  imageConfig: ImageConfig
  setImageConfig: (config: ImageConfig) => void
  showToast: (message: string, type: 'success' | 'error' | 'info') => void
}

export function ImageUpload({ imageConfig, setImageConfig, showToast }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsProcessing(true)

    try {
      // 파일 유효성 검사
      if (!isImageFile(file)) {
        throw new Error('이미지 파일만 업로드 가능합니다.')
      }

      if (!isSupportedImageType(file)) {
        throw new Error('지원되지 않는 이미지 형식입니다. (JPG, PNG만 지원)')
      }

      if (!isValidFileSize(file)) {
        throw new Error('파일 크기가 10MB를 초과합니다.')
      }

      // 이미지 크롭 및 리사이즈
      const { dataUrl } = await cropAndResizeImage(file)

      // ImageConfig 업데이트
      setImageConfig({
        ...imageConfig,
        file,
        dataUrl
      })

      showToast('이미지가 성공적으로 업로드되었습니다.', 'success')

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '이미지 처리 중 오류가 발생했습니다.'
      showToast(errorMessage, 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRemoveImage = () => {
    setImageConfig({
      ...imageConfig,
      file: null,
      dataUrl: null
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-3">이미지 업로드</h3>
      
      {!imageConfig.dataUrl ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
          {isProcessing ? (
            <div className="space-y-2">
              <div className="animate-spin text-2xl">⚙️</div>
              <div className="text-sm text-gray-600">이미지 처리 중...</div>
              <div className="text-xs text-gray-500">자동 크롭 및 리사이즈 진행 중</div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-gray-400 text-2xl">📁</div>
              <div className="text-sm text-gray-600">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                  disabled={isProcessing}
                >
                  파일 선택
                </button>
                <span> 또는 드래그 앤 드롭</span>
              </div>
              <div className="text-xs text-gray-500">
                JPG, PNG (최대 10MB)
              </div>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,image/jpeg,image/png"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isProcessing}
          />
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative">
            <img
              src={imageConfig.dataUrl}
              alt="업로드된 이미지"
              className="w-full h-32 object-cover rounded-lg border border-gray-200"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="text-xs text-gray-500">
            {imageConfig.file?.name} ({Math.round((imageConfig.file?.size || 0) / 1024)}KB)
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2 px-4 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            disabled={isProcessing}
          >
            다른 이미지 선택
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,image/jpeg,image/png"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isProcessing}
          />
        </div>
      )}

      {/* 안내 텍스트 */}
      <div className="mt-3 text-xs text-gray-500">
        * 이미지는 자동으로 정방형으로 크롭되어 128x128 크기로 최적화됩니다.
      </div>
    </div>
  )
} 