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
        <div>
          <label htmlFor="bgColor" className="block text-sm font-medium mb-2">배경 색상</label>
          <input
            type="color"
            id="bgColor"
            value={bgColor}
            onChange={e => setBgColor(e.target.value)}
            className="w-full h-10 rounded-md cursor-pointer"
          />
        </div>
      )}
      {bgType === 'gradient' && (
        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="gradientStart" className="block text-sm font-medium mb-2">시작 색상</label>
            <input
              type="color"
              id="gradientStart"
              value={bgGradient[0]}
              onChange={e => setBgGradient([e.target.value, bgGradient[1]])}
              className="w-full h-10 rounded-md cursor-pointer"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="gradientEnd" className="block text-sm font-medium mb-2">종료 색상</label>
            <input
              type="color"
              id="gradientEnd"
              value={bgGradient[1]}
              onChange={e => setBgGradient([bgGradient[0], e.target.value])}
              className="w-full h-10 rounded-md cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  )
} 