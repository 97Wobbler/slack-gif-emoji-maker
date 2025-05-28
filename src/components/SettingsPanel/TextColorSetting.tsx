interface TextColorSettingProps {
  textColor: string
  setTextColor: (v: string) => void
}

export function TextColorSetting({ textColor, setTextColor }: TextColorSettingProps) {
  return (
    <div>
      <label htmlFor="textColor" className="block text-sm font-medium mb-2">텍스트 색상</label>
      <input
        type="color"
        id="textColor"
        value={textColor}
        onChange={e => setTextColor(e.target.value)}
        className="w-full h-10 rounded-md cursor-pointer"
      />
    </div>
  )
} 