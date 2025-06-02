import type { TextAnimationType } from '../../types'

interface TextSettingProps {
  text: string
  setText: (v: string) => void
  animationType: TextAnimationType
  setAnimationType: (v: TextAnimationType) => void
  animationSpeed: number
  setAnimationSpeed: (v: number) => void
  animationIntensity: number
  setAnimationIntensity: (v: number) => void
}

const TEXT_ANIMATION_OPTIONS: { value: TextAnimationType; label: string }[] = [
  { value: 'slide', label: '슬라이딩' },
  { value: 'typing', label: '타이핑' },
  { value: 'rotate', label: '회전' },
  { value: 'shake', label: '진동' },
  { value: 'bounce', label: '바운스' },
  { value: 'zoom', label: '줌' },
  { value: 'fade', label: '페이드' },
  { value: 'colorChange', label: '색상변화' },
]

export function TextSetting({ 
  text, 
  setText, 
  animationType, 
  setAnimationType,
  animationSpeed,
  setAnimationSpeed,
  animationIntensity,
  setAnimationIntensity
}: TextSettingProps) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="text" className="block text-sm font-medium mb-2">텍스트 입력</label>
        <input
          type="text"
          id="text"
          value={text}
          onChange={e => setText(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="안녕하세요"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">애니메이션 효과</label>
        <div className="grid grid-cols-2 gap-2">
          {TEXT_ANIMATION_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setAnimationType(option.value)}
              className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                animationType === option.value
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="animationSpeed" className="block text-sm font-medium mb-2">
          애니메이션 속도: {animationSpeed}
        </label>
        <input
          type="range"
          id="animationSpeed"
          min="0.5"
          max="3"
          step="0.1"
          value={animationSpeed}
          onChange={e => setAnimationSpeed(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      <div>
        <label htmlFor="animationIntensity" className="block text-sm font-medium mb-2">
          애니메이션 강도: {animationIntensity}%
        </label>
        <input
          type="range"
          id="animationIntensity"
          min="10"
          max="200"
          step="10"
          value={animationIntensity}
          onChange={e => setAnimationIntensity(parseInt(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  )
} 