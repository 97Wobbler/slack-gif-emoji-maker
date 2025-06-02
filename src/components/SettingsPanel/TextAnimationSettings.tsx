import type { TextAnimationType, TextAnimationSettings } from '../../types'

interface TextAnimationSettingsProps {
  animationType: TextAnimationType
  settings: TextAnimationSettings
  setSettings: (settings: TextAnimationSettings) => void
}

export function TextAnimationSettingsPanel({ 
  animationType, 
  settings, 
  setSettings 
}: TextAnimationSettingsProps) {
  const updateSettings = (updates: Partial<TextAnimationSettings>) => {
    setSettings({ ...settings, ...updates })
  }

  const updateEffectSettings = (effectKey: keyof TextAnimationSettings, updates: any) => {
    const currentSettings = settings[effectKey] as Record<string, any> || {};
    setSettings({
      ...settings,
      [effectKey]: { ...currentSettings, ...updates }
    });
  }

  return (
    <div className="space-y-4">
      {/* 공통 설정 */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <h4 className="text-sm font-medium mb-3 text-gray-700">공통 설정</h4>
        
        <div className="space-y-3">
          <div>
            <label htmlFor="duration" className="block text-xs font-medium mb-1">
              지속시간: {settings.duration}초
            </label>
            <input
              type="range"
              id="duration"
              min="0.5"
              max="5"
              step="0.1"
              value={settings.duration}
              onChange={e => updateSettings({ duration: parseFloat(e.target.value) })}
              className="w-full h-1"
            />
          </div>

          <div>
            <label htmlFor="repeat" className="block text-xs font-medium mb-1">
              반복 횟수: {settings.repeat === -1 ? '무한' : settings.repeat}
            </label>
            <input
              type="range"
              id="repeat"
              min="-1"
              max="10"
              step="1"
              value={settings.repeat}
              onChange={e => updateSettings({ repeat: parseInt(e.target.value) })}
              className="w-full h-1"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">애니메이션 방향</label>
            <select
              value={settings.direction}
              onChange={e => updateSettings({ direction: e.target.value as 'normal' | 'reverse' | 'alternate' })}
              className="w-full text-xs px-2 py-1 border rounded"
            >
              <option value="normal">정방향</option>
              <option value="reverse">역방향</option>
              <option value="alternate">왕복</option>
            </select>
          </div>
        </div>
      </div>

      {/* 효과별 세부 설정 */}
      {animationType === 'typing' && (
        <div className="border rounded-lg p-4 bg-blue-50">
          <h4 className="text-sm font-medium mb-3 text-blue-700">타이핑 효과 설정</h4>
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showCursor"
                checked={settings.typing?.showCursor ?? true}
                onChange={e => updateEffectSettings('typing', { 
                  showCursor: e.target.checked,
                  cursorBlinkSpeed: settings.typing?.cursorBlinkSpeed ?? 1
                })}
                className="mr-2"
              />
              <label htmlFor="showCursor" className="text-xs">커서 표시</label>
            </div>
            
            {settings.typing?.showCursor && (
              <div>
                <label className="block text-xs font-medium mb-1">
                  커서 깜빡임 속도: {settings.typing?.cursorBlinkSpeed ?? 1}
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={settings.typing?.cursorBlinkSpeed ?? 1}
                  onChange={e => updateEffectSettings('typing', { 
                    showCursor: settings.typing?.showCursor ?? true,
                    cursorBlinkSpeed: parseFloat(e.target.value)
                  })}
                  className="w-full h-1"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {animationType === 'rotate' && (
        <div className="border rounded-lg p-4 bg-green-50">
          <h4 className="text-sm font-medium mb-3 text-green-700">회전 효과 설정</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1">회전 방향</label>
              <select
                value={settings.rotate?.direction ?? 'clockwise'}
                onChange={e => updateEffectSettings('rotate', { 
                  direction: e.target.value,
                  maxRotation: settings.rotate?.maxRotation ?? 360
                })}
                className="w-full text-xs px-2 py-1 border rounded"
              >
                <option value="clockwise">시계방향</option>
                <option value="counterclockwise">반시계방향</option>
                <option value="alternate">왕복</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium mb-1">
                최대 회전각: {settings.rotate?.maxRotation ?? 360}°
              </label>
              <input
                type="range"
                min="90"
                max="720"
                step="30"
                value={settings.rotate?.maxRotation ?? 360}
                onChange={e => updateEffectSettings('rotate', { 
                  direction: settings.rotate?.direction ?? 'clockwise',
                  maxRotation: parseInt(e.target.value)
                })}
                className="w-full h-1"
              />
            </div>
          </div>
        </div>
      )}

      {animationType === 'shake' && (
        <div className="border rounded-lg p-4 bg-red-50">
          <h4 className="text-sm font-medium mb-3 text-red-700">진동 효과 설정</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1">
                진동 주파수: {settings.shake?.frequency ?? 10}
              </label>
              <input
                type="range"
                min="5"
                max="30"
                step="1"
                value={settings.shake?.frequency ?? 10}
                onChange={e => updateEffectSettings('shake', { 
                  frequency: parseInt(e.target.value),
                  damping: settings.shake?.damping ?? 0.1
                })}
                className="w-full h-1"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium mb-1">
                감쇠율: {settings.shake?.damping ?? 0.1}
              </label>
              <input
                type="range"
                min="0"
                max="0.5"
                step="0.05"
                value={settings.shake?.damping ?? 0.1}
                onChange={e => updateEffectSettings('shake', { 
                  frequency: settings.shake?.frequency ?? 10,
                  damping: parseFloat(e.target.value)
                })}
                className="w-full h-1"
              />
            </div>
          </div>
        </div>
      )}

      {animationType === 'bounce' && (
        <div className="border rounded-lg p-4 bg-yellow-50">
          <h4 className="text-sm font-medium mb-3 text-yellow-700">바운스 효과 설정</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1">
                바운스 높이: {settings.bounce?.height ?? 50}%
              </label>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={settings.bounce?.height ?? 50}
                onChange={e => updateEffectSettings('bounce', { 
                  height: parseInt(e.target.value),
                  elasticity: settings.bounce?.elasticity ?? 0.8
                })}
                className="w-full h-1"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium mb-1">
                탄성력: {settings.bounce?.elasticity ?? 0.8}
              </label>
              <input
                type="range"
                min="0.3"
                max="1"
                step="0.05"
                value={settings.bounce?.elasticity ?? 0.8}
                onChange={e => updateEffectSettings('bounce', { 
                  height: settings.bounce?.height ?? 50,
                  elasticity: parseFloat(e.target.value)
                })}
                className="w-full h-1"
              />
            </div>
          </div>
        </div>
      )}

      {animationType === 'zoom' && (
        <div className="border rounded-lg p-4 bg-purple-50">
          <h4 className="text-sm font-medium mb-3 text-purple-700">줌 효과 설정</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1">
                최소 크기: {settings.zoom?.minScale ?? 80}%
              </label>
              <input
                type="range"
                min="50"
                max="100"
                step="5"
                value={settings.zoom?.minScale ?? 80}
                onChange={e => updateEffectSettings('zoom', { 
                  minScale: parseInt(e.target.value),
                  maxScale: settings.zoom?.maxScale ?? 150
                })}
                className="w-full h-1"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium mb-1">
                최대 크기: {settings.zoom?.maxScale ?? 150}%
              </label>
              <input
                type="range"
                min="100"
                max="300"
                step="10"
                value={settings.zoom?.maxScale ?? 150}
                onChange={e => updateEffectSettings('zoom', { 
                  minScale: settings.zoom?.minScale ?? 80,
                  maxScale: parseInt(e.target.value)
                })}
                className="w-full h-1"
              />
            </div>
          </div>
        </div>
      )}

      {animationType === 'fade' && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <h4 className="text-sm font-medium mb-3 text-gray-700">페이드 효과 설정</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1">
                최소 투명도: {settings.fade?.minOpacity ?? 30}%
              </label>
              <input
                type="range"
                min="0"
                max="80"
                step="5"
                value={settings.fade?.minOpacity ?? 30}
                onChange={e => updateEffectSettings('fade', { 
                  minOpacity: parseInt(e.target.value),
                  maxOpacity: settings.fade?.maxOpacity ?? 100
                })}
                className="w-full h-1"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium mb-1">
                최대 투명도: {settings.fade?.maxOpacity ?? 100}%
              </label>
              <input
                type="range"
                min="50"
                max="100"
                step="5"
                value={settings.fade?.maxOpacity ?? 100}
                onChange={e => updateEffectSettings('fade', { 
                  minOpacity: settings.fade?.minOpacity ?? 30,
                  maxOpacity: parseInt(e.target.value)
                })}
                className="w-full h-1"
              />
            </div>
          </div>
        </div>
      )}

      {animationType === 'colorChange' && (
        <div className="border rounded-lg p-4 bg-indigo-50">
          <h4 className="text-sm font-medium mb-3 text-indigo-700">색상 변화 설정</h4>
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="smoothColor"
                checked={settings.colorChange?.smooth ?? true}
                onChange={e => updateEffectSettings('colorChange', { 
                  smooth: e.target.checked,
                  colors: settings.colorChange?.colors ?? ['#ff0000', '#00ff00', '#0000ff']
                })}
                className="mr-2"
              />
              <label htmlFor="smoothColor" className="text-xs">부드러운 전환</label>
            </div>
            
            <div>
              <label className="block text-xs font-medium mb-1">색상 목록</label>
              <div className="text-xs text-gray-500">빨강 → 초록 → 파랑 순환</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 