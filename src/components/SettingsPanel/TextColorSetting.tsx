import { ColorInput } from './ColorInput'

interface TextColorSettingProps {
  textColor: string
  setTextColor: (v: string) => void
}

export function TextColorSetting({ textColor, setTextColor }: TextColorSettingProps) {
  return (
    <ColorInput
      label="텍스트 색상"
      value={textColor}
      onChange={setTextColor}
      id="textColor"
    />
  )
} 