import type { ImageConfig, AnimationType } from '../../types'

interface AnimationSettingsProps {
  imageConfig: ImageConfig
  setImageConfig: (config: ImageConfig) => void
}

const ANIMATION_OPTIONS: { value: AnimationType; label: string; description: string }[] = [
  { value: 'scale', label: '확대/축소', description: '크기가 변하는 효과' },
  { value: 'horizontalSlide', label: '좌우 슬라이딩', description: '좌우로 움직이는 효과' },
  { value: 'verticalStretch', label: '위아래 스케일링', description: '세로로 늘어나는 효과' },
  { value: 'bounce', label: '바운스', description: '통통 튀는 효과' },
  { value: 'rotate', label: '회전', description: '회전하는 효과' },
  { value: 'pulse', label: '펄스', description: '깜빡이는 효과' }
]

export function AnimationSettings({ imageConfig, setImageConfig }: AnimationSettingsProps) {
  const handleAnimationTypeChange = (animationType: AnimationType) => {
    setImageConfig({
      ...imageConfig,
      animationType
    })
  }

  const handleSpeedChange = (speed: number) => {
    setImageConfig({
      ...imageConfig,
      speed
    })
  }

  const handleIntensityChange = (intensity: number) => {
    setImageConfig({
      ...imageConfig,
      intensity
    })
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700 mb-3">애니메이션 설정</h3>
      
      {/* 애니메이션 타입 선택 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          애니메이션 타입
        </label>
        <div className="grid grid-cols-1 gap-2">
          {ANIMATION_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`
                flex items-center p-3 border rounded-lg cursor-pointer transition-colors
                ${imageConfig.animationType === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <input
                type="radio"
                name="animationType"
                value={option.value}
                checked={imageConfig.animationType === option.value}
                onChange={() => handleAnimationTypeChange(option.value)}
                className="sr-only"
              />
              <div className="flex-1">
                <div className="font-medium text-sm">{option.label}</div>
                <div className="text-xs text-gray-500">{option.description}</div>
              </div>
              {imageConfig.animationType === option.value && (
                <div className="text-blue-500 text-sm">✓</div>
              )}
            </label>
          ))}
        </div>
      </div>

      {/* 속도 설정 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          애니메이션 속도: {imageConfig.speed}
        </label>
        <input
          type="range"
          min="0.5"
          max="5"
          step="0.1"
          value={imageConfig.speed}
          onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>느림</span>
          <span>빠름</span>
        </div>
      </div>

      {/* 강도 설정 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          애니메이션 강도: {imageConfig.intensity}%
        </label>
        <input
          type="range"
          min="10"
          max="100"
          step="5"
          value={imageConfig.intensity}
          onChange={(e) => handleIntensityChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>약함</span>
          <span>강함</span>
        </div>
      </div>
    </div>
  )
} 