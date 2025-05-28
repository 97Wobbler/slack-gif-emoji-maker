import { useState, useEffect } from 'react'

interface ColorInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  id?: string
  className?: string
}

export function ColorInput({ label, value, onChange, id, className = "" }: ColorInputProps) {
  const [hexInput, setHexInput] = useState(value)

  // value가 변경되면 hexInput도 동기화
  useEffect(() => {
    setHexInput(value)
  }, [value])

  const handleHexChange = (inputValue: string) => {
    setHexInput(inputValue)
    
    // HEX 색상 코드 유효성 검사 (3자리 또는 6자리)
    const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
    if (hexPattern.test(inputValue)) {
      onChange(inputValue)
    }
  }

  const handleColorPickerChange = (pickerValue: string) => {
    onChange(pickerValue)
    setHexInput(pickerValue)
  }

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium mb-2">{label}</label>
      <div className="flex gap-2">
        <input
          type="color"
          id={id}
          value={value}
          onChange={e => handleColorPickerChange(e.target.value)}
          className="w-16 h-10 rounded-md cursor-pointer border"
        />
        <input
          type="text"
          value={hexInput}
          onChange={e => handleHexChange(e.target.value)}
          placeholder="#000000"
          className="flex-1 px-3 py-2 border rounded-md text-sm font-mono"
          maxLength={7}
        />
      </div>
    </div>
  )
} 