import { ColorInput } from './ColorInput'
import type { BackgroundConfig } from '../../types'

interface BackgroundSettingProps {
  bgType: BackgroundConfig['type']
  setBgType: (v: BackgroundConfig['type']) => void
  bgColor: string
  setBgColor: (v: string) => void
  bgGradient: [string, string]
  setBgGradient: (v: [string, string]) => void
}

export function BackgroundSetting({ bgType, setBgType, bgColor, setBgColor, bgGradient, setBgGradient }: BackgroundSettingProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">배경 타입</label>
      <div className="flex gap-4 mb-2">
        <label className="flex items-center">
          <input
            type="radio"
            checked={bgType === 'solid'}
            onChange={() => setBgType('solid')}
            className="mr-2"
          />
          단색
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            checked={bgType === 'gradient'}
            onChange={() => setBgType('gradient')}
            className="mr-2"
          />
          그라디언트
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            checked={bgType === 'transparent'}
            onChange={() => setBgType('transparent')}
            className="mr-2"
          />
          투명
        </label>
      </div>
      {bgType === 'solid' && (
        <ColorInput
          label="배경 색상"
          value={bgColor}
          onChange={setBgColor}
          id="bgColor"
        />
      )}
      {bgType === 'gradient' && (
        <div className="flex flex-col gap-4">
          <ColorInput
            label="시작 색상"
            value={bgGradient[0]}
            onChange={value => setBgGradient([value, bgGradient[1]])}
            id="gradientStart"
          />
          <ColorInput
            label="종료 색상"
            value={bgGradient[1]}
            onChange={value => setBgGradient([bgGradient[0], value])}
            id="gradientEnd"
          />
        </div>
      )}
    </div>
  )
} 