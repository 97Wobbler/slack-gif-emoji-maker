import { useState, useCallback } from 'react'
import { Header } from './components/Header'
import { PreviewPanel } from './components/PreviewPanel'
import { SettingsPanel } from './components/SettingsPanel'
import type { TextConfig, BackgroundConfig, GifConfig, ImageConfig, ContentMode } from './types'
import { GifGenerator } from './utils/gifGenerator'
import { useToast } from './hooks/useToast'

const DEFAULT_CONFIG: GifConfig = {
  width: 128,
  height: 128,
  fps: 33
}

function App() {
  // 모드 관련 상태
  const [mode, setMode] = useState<ContentMode>('text')

  // 텍스트 관련 상태
  const [text, setText] = useState('')
  const [textColor, setTextColor] = useState('#000000')
  const [speed, setSpeed] = useState(200)
  const [gap, setGap] = useState(50)
  const [fontSize, setFontSize] = useState(80)
  const [verticalOffset, setVerticalOffset] = useState(0)

  // 이미지 관련 상태
  const [imageConfig, setImageConfig] = useState<ImageConfig>({
    file: null,
    dataUrl: null,
    animationType: 'scale',
    speed: 2,
    intensity: 50
  })

  // 배경 관련 상태
  const [bgType, setBgType] = useState<BackgroundConfig['type']>('solid')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [bgGradient, setBgGradient] = useState<[string, string]>(['#667eea', '#764ba2'])
  
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
    if (mode === 'text' && !text) {
      showToast('텍스트를 입력해주세요.', 'error')
      return
    }
    
    if (mode === 'image' && !imageConfig.dataUrl) {
      showToast('이미지를 업로드해주세요.', 'error')
      return
    }
    
    setIsGenerating(true)
    try {
      const generator = new GifGenerator(DEFAULT_CONFIG)
      await generator.generateGif(mode, textConfig, imageConfig, bgConfig)
      showToast('GIF가 성공적으로 생성되었습니다!', 'success')
    } catch (error) {
      console.error('GIF 생성 중 오류:', error)
      showToast('GIF 생성 중 오류가 발생했습니다.', 'error')
    } finally {
      setIsGenerating(false)
    }
  }, [mode, text, imageConfig, textConfig, bgConfig, showToast])

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden" style={{ "--header-height": "2.5rem" } as React.CSSProperties}>
      <Header />
      <main className="flex-1 flex overflow-hidden min-h-0">
        <div className="flex-1 flex justify-center items-center p-4 overflow-hidden">
          <PreviewPanel 
            mode={mode}
            textConfig={textConfig} 
            imageConfig={imageConfig}
            bgConfig={bgConfig} 
          />
        </div>
        <div className="w-80 bg-white flex-shrink-0 overflow-hidden">
          <SettingsPanel
            mode={mode}
            setMode={setMode}
            text={text}
            setText={setText}
            textColor={textColor}
            setTextColor={setTextColor}
            fontSize={fontSize}
            setFontSize={setFontSize}
            verticalOffset={verticalOffset}
            setVerticalOffset={setVerticalOffset}
            imageConfig={imageConfig}
            setImageConfig={setImageConfig}
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
            showToast={showToast}
          />
        </div>
      </main>
      {ToastComponent}
    </div>
  )
}

export default App
