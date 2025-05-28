import { TextSetting } from './SettingsPanel/TextSetting'
import { TextColorSetting } from './SettingsPanel/TextColorSetting'
import { FontSizeSetting } from './SettingsPanel/FontSizeSetting'
import { VerticalOffsetSetting } from './SettingsPanel/VerticalOffsetSetting'
import { BackgroundSetting } from './SettingsPanel/BackgroundSetting'
import { ColorRandomizer } from './SettingsPanel/ColorRandomizer'
import { SpeedSetting } from './SettingsPanel/SpeedSetting'
import { GapSetting } from './SettingsPanel/GapSetting'
import { OutputInfo } from './SettingsPanel/OutputInfo'
import { ExportButton } from './SettingsPanel/ExportButton'
import type { BackgroundConfig } from '../types'

interface SettingsPanelProps {
  text: string
  setText: (v: string) => void
  textColor: string
  setTextColor: (v: string) => void
  fontSize: number
  setFontSize: (v: number) => void
  verticalOffset: number
  setVerticalOffset: (v: number) => void
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
}

export function SettingsPanel({
  text,
  setText,
  textColor,
  setTextColor,
  fontSize,
  setFontSize,
  verticalOffset,
  setVerticalOffset,
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
  handleGenerate
}: SettingsPanelProps) {
  return (
    <div className="h-[calc(100vh-var(--header-height))] pt-[var(--header-height)]">
      <section className="bg-white shadow-md h-full flex flex-col">
        <div className="p-6 flex-1 overflow-y-auto">
          <h2 className="text-lg font-medium mb-6">설정</h2>
          <div className="space-y-6">
            <TextSetting text={text} setText={setText} />
            <TextColorSetting textColor={textColor} setTextColor={setTextColor} />
            <FontSizeSetting fontSize={fontSize} setFontSize={setFontSize} />
            <VerticalOffsetSetting verticalOffset={verticalOffset} setVerticalOffset={setVerticalOffset} />
            <BackgroundSetting
              bgType={bgType}
              setBgType={setBgType}
              bgColor={bgColor}
              setBgColor={setBgColor}
              bgGradient={bgGradient}
              setBgGradient={setBgGradient}
            />
            <ColorRandomizer
              setTextColor={setTextColor}
              setBgColor={setBgColor}
              setBgGradient={setBgGradient}
              bgType={bgType}
            />
            <SpeedSetting speed={speed} setSpeed={setSpeed} />
            <GapSetting gap={gap} setGap={setGap} />
          </div>
        </div>
        <div className="p-6 border-t border-gray-100">
          <ExportButton
            isGenerating={isGenerating}
            handleGenerate={handleGenerate}
            text={text}
          />
          <OutputInfo />
        </div>
      </section>
    </div>
  )
} 