interface TextSettingProps {
  text: string
  setText: (v: string) => void
}

export function TextSetting({ text, setText }: TextSettingProps) {
  return (
    <div>
      <label htmlFor="text" className="block text-sm font-medium mb-2">텍스트 입력</label>
      <input
        type="text"
        id="text"
        value={text}
        onChange={e => setText(e.target.value)}
        className="w-full px-3 py-2 border rounded-md"
        placeholder="슬라이딩할 텍스트를 입력하세요"
      />
    </div>
  )
} 