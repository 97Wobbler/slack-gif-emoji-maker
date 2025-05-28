interface VerticalOffsetSettingProps {
  verticalOffset: number
  setVerticalOffset: (v: number) => void
}

export function VerticalOffsetSetting({ verticalOffset, setVerticalOffset }: VerticalOffsetSettingProps) {
  return (
    <div>
      <label htmlFor="verticalOffset" className="block text-sm font-medium mb-2">
        수직 위치 조정: {verticalOffset > 0 ? '+' : ''}{verticalOffset}%
      </label>
      <input
        type="range"
        id="verticalOffset"
        min="-20"
        max="20"
        step="1"
        value={verticalOffset}
        onChange={e => setVerticalOffset(Number(e.target.value))}
        className="w-full"
      />
      <div className="text-xs text-gray-500 mt-1">
        음수: 아래로 이동 | 양수: 위로 이동
      </div>
    </div>
  )
} 