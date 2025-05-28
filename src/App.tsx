import { useState, useCallback } from 'react'
import { Header } from './components/Header'
import { PreviewPanel } from './components/PreviewPanel'
import { SettingsPanel } from './components/SettingsPanel'
import type { TextConfig, BackgroundConfig, GifConfig } from './types'
import { GifGenerator } from './utils/gifGenerator'

const DEFAULT_CONFIG: GifConfig = {
  width: 128,
  height: 128,
  fps: 15
}

function App() {
  const [text, setText] = useState('')
  const [textColor, setTextColor] = useState('#000000')
  const [bgType, setBgType] = useState<BackgroundConfig['type']>('solid')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [bgGradient, setBgGradient] = useState<[string, string]>(['#ff0000', '#0000ff'])
  const [speed, setSpeed] = useState(50)
  const [gap, setGap] = useState(50)
  const [fontSize, setFontSize] = useState(80)
  const [verticalOffset, setVerticalOffset] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)

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
    if (!text) return
    
    setIsGenerating(true)
    try {
      const generator = new GifGenerator(DEFAULT_CONFIG)
      await generator.generateGif(textConfig, bgConfig)
    } catch (error) {
      console.error('GIF 생성 중 오류:', error)
    } finally {
      setIsGenerating(false)
    }
  }, [text, textConfig, bgConfig])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex flex-row items-start w-full min-h-[600px] justify-center gap-12 px-10 py-12">
        <PreviewPanel textConfig={textConfig} bgConfig={bgConfig} />
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
      </main>
    </div>
  )
}

export default App
