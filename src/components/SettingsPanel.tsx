import { TextSetting } from './SettingsPanel/TextSetting'
import { TextAnimationSettingsPanel } from './SettingsPanel/TextAnimationSettings'
import { TextColorSetting } from './SettingsPanel/TextColorSetting'
import { FontSizeSetting } from './SettingsPanel/FontSizeSetting'
import { VerticalOffsetSetting } from './SettingsPanel/VerticalOffsetSetting'
import { BackgroundSetting } from './SettingsPanel/BackgroundSetting'
import { ColorRandomizer } from './SettingsPanel/ColorRandomizer'
import { SpeedSetting } from './SettingsPanel/SpeedSetting'
import { GapSetting } from './SettingsPanel/GapSetting'
import { OutputInfo } from './SettingsPanel/OutputInfo'
import { ExportButton } from './SettingsPanel/ExportButton'
import { ModeSelector } from './SettingsPanel/ModeSelector'
import { ImageUpload } from './SettingsPanel/ImageUpload'
import { AnimationSettings } from './SettingsPanel/AnimationSettings'
import type { BackgroundConfig, ContentMode, ImageConfig, TextAnimationType, TextAnimationSettings } from '../types'

interface SettingsPanelProps {
  mode: ContentMode
  setMode: (mode: ContentMode) => void
  text: string
  setText: (v: string) => void
  textColor: string
  setTextColor: (v: string) => void
  fontSize: number
  setFontSize: (v: number) => void
  verticalOffset: number
  setVerticalOffset: (v: number) => void
  textAnimationType: TextAnimationType
  setTextAnimationType: (v: TextAnimationType) => void
  textAnimationSpeed: number
  setTextAnimationSpeed: (v: number) => void
  textAnimationIntensity: number
  setTextAnimationIntensity: (v: number) => void
  textAnimationSettings: TextAnimationSettings
  setTextAnimationSettings: (v: TextAnimationSettings) => void
  imageConfig: ImageConfig
  setImageConfig: (config: ImageConfig) => void
  bgType: BackgroundConfig['type']
  setBgType: (v: BackgroundConfig['type']) => void
  bgColor: string
  setBgColor: (v: string) => void
  bgGradient: [string, string]
  setBgGradient: (v: [string, string]) => void
  speed: number
  setSpeed: (v: number) => void
  gap: number
  setGap: (v: number) => void
  isGenerating: boolean
  handleGenerate: () => void
  showToast: (message: string, type: 'success' | 'error' | 'info') => void
}

export function SettingsPanel({
  mode,
  setMode,
  text,
  setText,
  textColor,
  setTextColor,
  fontSize,
  setFontSize,
  verticalOffset,
  setVerticalOffset,
  textAnimationType,
  setTextAnimationType,
  textAnimationSpeed,
  setTextAnimationSpeed,
  textAnimationIntensity,
  setTextAnimationIntensity,
  textAnimationSettings,
  setTextAnimationSettings,
  imageConfig,
  setImageConfig,
  bgType,
  setBgType,
  bgColor,
  setBgColor,
  bgGradient,
  setBgGradient,
  speed,
  setSpeed,
  gap,
  setGap,
  isGenerating,
  handleGenerate,
  showToast
}: SettingsPanelProps) {
  return (
    <div className="h-full">
      <section className="bg-white shadow-md h-full flex flex-col">
        <div className="p-6 flex-1 overflow-y-auto min-h-[calc(100vh-var(--header-height)-5rem)] relative">
          <div className="max-w-[calc(100vw-2rem)] space-y-6">
            <h2 className="text-lg font-medium mb-6">설정</h2>
            <div className="space-y-6">
              {/* 모드 선택 */}
              <ModeSelector mode={mode} setMode={setMode} />
              
              {/* 텍스트 모드 설정 */}
              {mode === 'text' && (
                <>
                  <TextSetting 
                    text={text} 
                    setText={setText}
                    animationType={textAnimationType}
                    setAnimationType={setTextAnimationType}
                    animationSpeed={textAnimationSpeed}
                    setAnimationSpeed={setTextAnimationSpeed}
                    animationIntensity={textAnimationIntensity}
                    setAnimationIntensity={setTextAnimationIntensity}
                  />
                  <TextAnimationSettingsPanel
                    animationType={textAnimationType}
                    settings={textAnimationSettings}
                    setSettings={setTextAnimationSettings}
                  />
                  <TextColorSetting textColor={textColor} setTextColor={setTextColor} />
                  <FontSizeSetting fontSize={fontSize} setFontSize={setFontSize} />
                  <VerticalOffsetSetting verticalOffset={verticalOffset} setVerticalOffset={setVerticalOffset} />
                  <SpeedSetting speed={speed} setSpeed={setSpeed} />
                  <GapSetting gap={gap} setGap={setGap} />
                </>
              )}
              
              {/* 이미지 모드 설정 */}
              {mode === 'image' && (
                <>
                  <ImageUpload 
                    imageConfig={imageConfig} 
                    setImageConfig={setImageConfig}
                    showToast={showToast}
                  />
                  <AnimationSettings imageConfig={imageConfig} setImageConfig={setImageConfig} />
                </>
              )}
              
              {/* 공통 설정 */}
              <BackgroundSetting
                bgType={bgType}
                setBgType={setBgType}
                bgColor={bgColor}
                setBgColor={setBgColor}
                bgGradient={bgGradient}
                setBgGradient={setBgGradient}
              />
              
              {mode === 'text' && (
                <ColorRandomizer
                  setTextColor={setTextColor}
                  setBgColor={setBgColor}
                  setBgGradient={setBgGradient}
                  bgType={bgType}
                />
              )}
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-gray-100 flex-shrink-0 bg-white">
          <ExportButton
            isGenerating={isGenerating}
            handleGenerate={handleGenerate}
          />
          <OutputInfo />
        </div>
      </section>
    </div>
  )
} 