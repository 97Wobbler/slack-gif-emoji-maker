interface GapSettingProps {
  gap: number
  setGap: (v: number) => void
}

export function GapSetting({ gap, setGap }: GapSettingProps) {
  return (
    <div>
      <label htmlFor="gap" className="block text-sm font-medium mb-2">
        텍스트 간격: {gap}%
      </label>
      <input
        type="range"
        id="gap"
        min="0"
        max="100"
        value={gap}
        onChange={e => setGap(Number(e.target.value))}
        className="w-full"
      />
      <div className="text-xs text-gray-500 mt-1">
        0%: 텍스트가 붙어서 반복 | 100%: 완전히 사라진 후 반복
      </div>
    </div>
  )
} 