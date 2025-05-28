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
    <section className="w-80 bg-white rounded-lg shadow-md p-6">
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
        <OutputInfo />
        <ExportButton
          isGenerating={isGenerating}
          handleGenerate={handleGenerate}
          text={text}
        />
      </div>
    </section>
  )
} 