import { useState, useCallback } from 'react'
import { Header } from './components/Header'
import { PreviewPanel } from './components/PreviewPanel'
import { SettingsPanel } from './components/SettingsPanel'
import type { TextConfig, BackgroundConfig, GifConfig } from './types'
import { GifGenerator } from './utils/gifGenerator'
import { useToast } from './hooks/useToast'

const DEFAULT_CONFIG: GifConfig = {
  width: 128,
  height: 128,
  fps: 33
}

function App() {
  const [text, setText] = useState('')
  const [textColor, setTextColor] = useState('#000000')
  const [bgType, setBgType] = useState<BackgroundConfig['type']>('solid')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [bgGradient, setBgGradient] = useState<[string, string]>(['#667eea', '#764ba2'])
  const [speed, setSpeed] = useState(200)
  const [gap, setGap] = useState(50)
  const [fontSize, setFontSize] = useState(80)
  const [verticalOffset, setVerticalOffset] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)

  const { showToast, ToastComponent } = useToast()

  const textConfig: TextConfig = {
    text: text || '안녕하세요',
    color: textColor,
    font: 'Pretendard Variable',
    speed,
    gap,
    fontSize,
    verticalOffset
  }

  const bgConfig: BackgroundConfig = {
    type: bgType,
    color: bgColor,
    gradientColors: bgType === 'gradient' ? bgGradient : undefined
  }

  const handleGenerate = useCallback(async () => {
    if (!text) {
      showToast('텍스트를 입력해주세요.', 'error')
      return
    }
    
    setIsGenerating(true)
    try {
      const generator = new GifGenerator(DEFAULT_CONFIG)
      await generator.generateGif(textConfig, bgConfig)
    } catch (error) {
      console.error('GIF 생성 중 오류:', error)
    } finally {
      setIsGenerating(false)
    }
  }, [text, textConfig, bgConfig, showToast])

  return (
    <div className="min-h-screen bg-gray-50" style={{ "--header-height": "2.5rem" } as React.CSSProperties}>
      <Header />
      <main className="pt-[var(--header-height)] flex">
        <div className="flex-1 flex justify-center items-center">
          <PreviewPanel textConfig={textConfig} bgConfig={bgConfig} />
        </div>
        <div className="w-80 bg-white">
          <SettingsPanel
            text={text}
            setText={setText}
            textColor={textColor}
            setTextColor={setTextColor}
            fontSize={fontSize}
            setFontSize={setFontSize}
            verticalOffset={verticalOffset}
            setVerticalOffset={setVerticalOffset}
            bgType={bgType}
            setBgType={setBgType}
            bgColor={bgColor}
            setBgColor={setBgColor}
            bgGradient={bgGradient}
            setBgGradient={setBgGradient}
            speed={speed}
            setSpeed={setSpeed}
            gap={gap}
            setGap={setGap}
            isGenerating={isGenerating}
            handleGenerate={handleGenerate}
          />
        </div>
      </main>
      {ToastComponent}
    </div>
  )
}

export default App
