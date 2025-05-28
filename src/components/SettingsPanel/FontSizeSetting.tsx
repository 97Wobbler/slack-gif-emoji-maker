interface FontSizeSettingProps {
  fontSize: number
  setFontSize: (v: number) => void
}

export function FontSizeSetting({ fontSize, setFontSize }: FontSizeSettingProps) {
  return (
    <div>
      <label htmlFor="fontSize" className="block text-sm font-medium mb-2">
        글자 크기: {fontSize}%
      </label>
      <input
        type="range"
        id="fontSize"
        min="50"
        max="100"
        step="1"
        value={fontSize}
        onChange={e => setFontSize(Number(e.target.value))}
        className="w-full"
      />
    </div>
  )
} 