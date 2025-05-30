/**
 * 이미지를 정방형으로 크롭하고 지정된 크기로 리사이즈하는 함수
 */
export async function cropAndResizeImage(
  file: File, 
  targetSize: number = 128
): Promise<{ dataUrl: string; blob: Blob }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      reject(new Error('Canvas context를 생성할 수 없습니다.'))
      return
    }

    img.onload = () => {
      // 원본 이미지 크기
      const { width: originalWidth, height: originalHeight } = img

      // 정방형 크롭을 위한 크기 계산 (작은 쪽 기준)
      const cropSize = Math.min(originalWidth, originalHeight)
      
      // 크롭 시작 위치 (중앙 기준)
      const cropX = (originalWidth - cropSize) / 2
      const cropY = (originalHeight - cropSize) / 2

      // 캔버스 크기 설정
      canvas.width = targetSize
      canvas.height = targetSize

      // 이미지를 정방형으로 크롭하여 캔버스에 그리기
      ctx.drawImage(
        img,
        cropX, cropY, cropSize, cropSize, // 소스 영역 (크롭)
        0, 0, targetSize, targetSize      // 대상 영역 (리사이즈)
      )

      // 결과를 Data URL과 Blob으로 변환
      const dataUrl = canvas.toDataURL('image/png', 0.9)
      
      canvas.toBlob((blob) => {
        if (blob) {
          resolve({ dataUrl, blob })
        } else {
          reject(new Error('Blob 생성에 실패했습니다.'))
        }
      }, 'image/png', 0.9)
    }

    img.onerror = () => {
      reject(new Error('이미지 로드에 실패했습니다.'))
    }

    // 파일을 이미지로 로드
    const reader = new FileReader()
    reader.onload = (e) => {
      img.src = e.target?.result as string
    }
    reader.onerror = () => {
      reject(new Error('파일 읽기에 실패했습니다.'))
    }
    reader.readAsDataURL(file)
  })
}

/**
 * 파일이 이미지인지 확인하는 함수
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}

/**
 * 지원되는 이미지 타입인지 확인하는 함수
 */
export function isSupportedImageType(file: File): boolean {
  const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png']
  return supportedTypes.includes(file.type)
}

/**
 * 파일 크기가 유효한지 확인하는 함수 (기본 10MB 제한)
 */
export function isValidFileSize(file: File, maxSizeMB: number = 10): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxSizeBytes
}

/**
 * 이미지 파일의 실제 크기를 가져오는 함수
 */
export async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      })
    }
    
    img.onerror = () => {
      reject(new Error('이미지 크기를 가져올 수 없습니다.'))
    }
    
    const reader = new FileReader()
    reader.onload = (e) => {
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  })
} 