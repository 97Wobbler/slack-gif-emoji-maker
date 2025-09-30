import type { TextAnimationType, TextAnimationSettings } from '../../types'

interface TextSettingProps {
  // 기본 텍스트 설정
  text: string
  setText: (v: string) => void
  textColor: string
  setTextColor: (v: string) => void
  fontSize: number
  setFontSize: (v: number) => void
  verticalOffset: number
  setVerticalOffset: (v: number) => void
  
  // 애니메이션 설정
  animationType: TextAnimationType
  setAnimationType: (v: TextAnimationType) => void
  animationSpeed: number
  setAnimationSpeed: (v: number) => void
  animationIntensity: number
  setAnimationIntensity: (v: number) => void
  animationSettings: TextAnimationSettings
  setAnimationSettings: (v: TextAnimationSettings) => void
  
  // 슬라이딩 전용 설정
  speed: number
  setSpeed: (v: number) => void
  gap: number
  setGap: (v: number) => void
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
  textColor,
  setTextColor,
  fontSize,
  setFontSize,
  verticalOffset,
  setVerticalOffset,
  animationType, 
  setAnimationType,
  animationSpeed,
  setAnimationSpeed,
  animationIntensity,
  setAnimationIntensity,
  animationSettings,
  setAnimationSettings,
  speed,
  setSpeed,
  gap,
  setGap
}: TextSettingProps) {
  
  // 효과별 설정 업데이트 헬퍼 함수
  const updateEffectSettings = (effectKey: keyof TextAnimationSettings, updates: any) => {
    const currentSettings = animationSettings[effectKey] as Record<string, any> || {};
    setAnimationSettings({
      ...animationSettings,
      [effectKey]: { ...currentSettings, ...updates }
    });
  }

  return (
    <div className="space-y-4">
      {/* 1. 텍스트 입력 */}
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

      {/* 2. 애니메이션 효과 선택 */}
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

      {/* 3. 공통 설정 (모든 효과) */}
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

      {/* 4. 기본 텍스트 설정 */}
      {/* 텍스트 색상 (colorChange일 때 숨김) */}
      {animationType !== 'colorChange' && (
        <div>
          <label htmlFor="textColor" className="block text-sm font-medium mb-2">텍스트 색상</label>
          <input
            type="color"
            id="textColor"
            value={textColor}
            onChange={e => setTextColor(e.target.value)}
            className="w-full h-10 border rounded-md cursor-pointer"
          />
        </div>
      )}

      {/* 글자 크기 */}
      <div>
        <label htmlFor="fontSize" className="block text-sm font-medium mb-2">
          글자 크기: {fontSize}%
        </label>
        <input
          type="range"
          id="fontSize"
          min="50"
          max="200"
          step="5"
          value={fontSize}
          onChange={e => setFontSize(parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      {/* 수직 오프셋 */}
      <div>
        <label htmlFor="verticalOffset" className="block text-sm font-medium mb-2">
          수직 위치: {verticalOffset > 0 ? '+' : ''}{verticalOffset}%
        </label>
        <input
          type="range"
          id="verticalOffset"
          min="-50"
          max="50"
          step="5"
          value={verticalOffset}
          onChange={e => setVerticalOffset(parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      {/* 5. slide 전용 설정 (slide일 때만 표시) */}
      {animationType === 'slide' && (
        <>
          <div>
            <label htmlFor="speed" className="block text-sm font-medium mb-2">
              슬라이딩 속도: {speed} px/s
            </label>
            <input
              type="range"
              id="speed"
              min="20"
              max="200"
              step="10"
              value={speed}
              onChange={e => setSpeed(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="gap" className="block text-sm font-medium mb-2">
              텍스트 간격: {gap}%
            </label>
            <input
              type="range"
              id="gap"
              min="0"
              max="200"
              step="10"
              value={gap}
              onChange={e => setGap(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </>
      )}

      {/* 6. 효과별 개별 설정 */}
      {/* typing 효과 설정 */}
      {animationType === 'typing' && (
        <>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showCursor"
              checked={animationSettings.typing?.showCursor ?? true}
              onChange={e => updateEffectSettings('typing', { 
                showCursor: e.target.checked,
                cursorBlinkSpeed: animationSettings.typing?.cursorBlinkSpeed ?? 1
              })}
              className="mr-2"
            />
            <label htmlFor="showCursor" className="text-sm font-medium">커서 표시</label>
          </div>
          
          {animationSettings.typing?.showCursor && (
            <div>
              <label className="block text-sm font-medium mb-2">
                커서 깜빡임 속도: {animationSettings.typing?.cursorBlinkSpeed ?? 1}
              </label>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={animationSettings.typing?.cursorBlinkSpeed ?? 1}
                onChange={e => updateEffectSettings('typing', { 
                  showCursor: animationSettings.typing?.showCursor ?? true,
                  cursorBlinkSpeed: parseFloat(e.target.value)
                })}
                className="w-full"
              />
            </div>
          )}
        </>
      )}

      {/* rotate 효과 설정 */}
      {animationType === 'rotate' && (
        <>
          <div>
            <label className="block text-sm font-medium mb-2">회전 방향</label>
            <select
              value={animationSettings.rotate?.direction ?? 'clockwise'}
              onChange={e => updateEffectSettings('rotate', { 
                direction: e.target.value,
                maxRotation: animationSettings.rotate?.maxRotation ?? 360
              })}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="clockwise">시계방향</option>
              <option value="counterclockwise">반시계방향</option>
              <option value="alternate">왕복</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              최대 회전각: {animationSettings.rotate?.maxRotation ?? 360}°
            </label>
            <input
              type="range"
              min="90"
              max="720"
              step="30"
              value={animationSettings.rotate?.maxRotation ?? 360}
              onChange={e => updateEffectSettings('rotate', { 
                direction: animationSettings.rotate?.direction ?? 'clockwise',
                maxRotation: parseInt(e.target.value)
              })}
              className="w-full"
            />
          </div>
        </>
      )}

      {/* shake 효과 설정 */}
      {animationType === 'shake' && (
        <>
          <div>
            <label className="block text-sm font-medium mb-2">
              진동 주파수: {animationSettings.shake?.frequency ?? 10}
            </label>
            <input
              type="range"
              min="5"
              max="30"
              step="1"
              value={animationSettings.shake?.frequency ?? 10}
              onChange={e => updateEffectSettings('shake', { 
                frequency: parseInt(e.target.value),
                damping: animationSettings.shake?.damping ?? 0.1
              })}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              감쇠율: {animationSettings.shake?.damping ?? 0.1}
            </label>
            <input
              type="range"
              min="0"
              max="0.5"
              step="0.05"
              value={animationSettings.shake?.damping ?? 0.1}
              onChange={e => updateEffectSettings('shake', { 
                frequency: animationSettings.shake?.frequency ?? 10,
                damping: parseFloat(e.target.value)
              })}
              className="w-full"
            />
          </div>
        </>
      )}

      {/* bounce 효과 설정 */}
      {animationType === 'bounce' && (
        <>
          <div>
            <label className="block text-sm font-medium mb-2">
              바운스 높이: {animationSettings.bounce?.height ?? 50}%
            </label>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={animationSettings.bounce?.height ?? 50}
              onChange={e => updateEffectSettings('bounce', { 
                height: parseInt(e.target.value),
                elasticity: animationSettings.bounce?.elasticity ?? 0.8
              })}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              탄성력: {animationSettings.bounce?.elasticity ?? 0.8}
            </label>
            <input
              type="range"
              min="0.3"
              max="1"
              step="0.05"
              value={animationSettings.bounce?.elasticity ?? 0.8}
              onChange={e => updateEffectSettings('bounce', { 
                height: animationSettings.bounce?.height ?? 50,
                elasticity: parseFloat(e.target.value)
              })}
              className="w-full"
            />
          </div>
        </>
      )}

      {/* zoom 효과 설정 */}
      {animationType === 'zoom' && (
        <>
          <div>
            <label className="block text-sm font-medium mb-2">
              최소 크기: {animationSettings.zoom?.minScale ?? 80}%
            </label>
            <input
              type="range"
              min="50"
              max="100"
              step="5"
              value={animationSettings.zoom?.minScale ?? 80}
              onChange={e => updateEffectSettings('zoom', { 
                minScale: parseInt(e.target.value),
                maxScale: animationSettings.zoom?.maxScale ?? 150
              })}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              최대 크기: {animationSettings.zoom?.maxScale ?? 150}%
            </label>
            <input
              type="range"
              min="100"
              max="300"
              step="10"
              value={animationSettings.zoom?.maxScale ?? 150}
              onChange={e => updateEffectSettings('zoom', { 
                minScale: animationSettings.zoom?.minScale ?? 80,
                maxScale: parseInt(e.target.value)
              })}
              className="w-full"
            />
          </div>
        </>
      )}

      {/* fade 효과 설정 */}
      {animationType === 'fade' && (
        <>
          <div>
            <label className="block text-sm font-medium mb-2">
              최소 투명도: {animationSettings.fade?.minOpacity ?? 30}%
            </label>
            <input
              type="range"
              min="0"
              max="80"
              step="5"
              value={animationSettings.fade?.minOpacity ?? 30}
              onChange={e => updateEffectSettings('fade', { 
                minOpacity: parseInt(e.target.value),
                maxOpacity: animationSettings.fade?.maxOpacity ?? 100
              })}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              최대 투명도: {animationSettings.fade?.maxOpacity ?? 100}%
            </label>
            <input
              type="range"
              min="50"
              max="100"
              step="5"
              value={animationSettings.fade?.maxOpacity ?? 100}
              onChange={e => updateEffectSettings('fade', { 
                minOpacity: animationSettings.fade?.minOpacity ?? 30,
                maxOpacity: parseInt(e.target.value)
              })}
              className="w-full"
            />
          </div>
        </>
      )}

      {/* colorChange 효과 설정 */}
      {animationType === 'colorChange' && (
        <div className="flex items-center">
          <input
            type="checkbox"
            id="smoothColor"
            checked={animationSettings.colorChange?.smooth ?? true}
            onChange={e => updateEffectSettings('colorChange', { 
              smooth: e.target.checked,
              colors: animationSettings.colorChange?.colors ?? ['#ff0000', '#00ff00', '#0000ff']
            })}
            className="mr-2"
          />
          <label htmlFor="smoothColor" className="text-sm font-medium">부드러운 색상 전환</label>
        </div>
      )}
    </div>
  )
} 