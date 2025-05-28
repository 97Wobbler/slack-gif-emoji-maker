import { useState, useCallback } from 'react'
import type { TextConfig, BackgroundConfig, GifConfig } from './types'
import { GifGenerator } from './utils/gifGenerator'
import { Preview } from './components/Preview'

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
  const [speed, setSpeed] = useState(50) // px/sec
  const [gap, setGap] = useState(100) // 텍스트 간격 (%)
  const [fontSize, setFontSize] = useState(90) // 글자 크기 (%)
  const [isGenerating, setIsGenerating] = useState(false)
  
  const textConfig: TextConfig = {
    text: text || '미리보기 텍스트',
    color: textColor,
    font: 'Pretendard Variable',
    speed,
    gap,
    fontSize
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
      const blob = await generator.generateGif(textConfig, bgConfig, DEFAULT_CONFIG)
      
      // 다운로드 링크 생성
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${text}-emoji.gif`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('GIF 생성 중 오류:', error)
    } finally {
      setIsGenerating(false)
    }
  }, [text, textConfig, bgConfig])
  
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">슬랙 이모지용 슬라이딩 텍스트 GIF 생성기</h1>
        
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* 미리보기 */}
          <div className="flex flex-col items-center space-y-2">
            <h2 className="text-lg font-medium">미리보기</h2>
            <Preview textConfig={textConfig} bgConfig={bgConfig} />
            <div className="text-sm text-gray-500">실제 슬랙 이모지 크기</div>
            <Preview textConfig={textConfig} bgConfig={bgConfig} displaySize={24} />
          </div>
          
          {/* 텍스트 입력 */}
          <div>
            <label htmlFor="text" className="block text-sm font-medium mb-2">텍스트 입력</label>
            <input
              type="text"
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="슬라이딩할 텍스트를 입력하세요"
            />
          </div>
          
          {/* 텍스트 색상 */}
          <div>
            <label htmlFor="textColor" className="block text-sm font-medium mb-2">텍스트 색상</label>
            <input
              type="color"
              id="textColor"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="w-full h-10 rounded-md cursor-pointer"
            />
          </div>
          
          {/* 글자 크기 조절 */}
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
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full"
            />
          </div>
          
          {/* 배경 설정 */}
          <div>
            <label className="block text-sm font-medium mb-2">배경 타입</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={bgType === 'solid'}
                  onChange={() => setBgType('solid')}
                  className="mr-2"
                />
                단색
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={bgType === 'gradient'}
                  onChange={() => setBgType('gradient')}
                  className="mr-2"
                />
                그라디언트
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={bgType === 'transparent'}
                  onChange={() => setBgType('transparent')}
                  className="mr-2"
                />
                투명
              </label>
            </div>
          </div>
          
          {/* 배경 색상 선택 */}
          {bgType === 'solid' && (
            <div>
              <label htmlFor="bgColor" className="block text-sm font-medium mb-2">배경 색상</label>
              <input
                type="color"
                id="bgColor"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-full h-10 rounded-md cursor-pointer"
              />
            </div>
          )}
          
          {/* 그라디언트 색상 선택 */}
          {bgType === 'gradient' && (
            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="gradientStart" className="block text-sm font-medium mb-2">시작 색상</label>
                <input
                  type="color"
                  id="gradientStart"
                  value={bgGradient[0]}
                  onChange={(e) => setBgGradient([e.target.value, bgGradient[1]])}
                  className="w-full h-10 rounded-md cursor-pointer"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="gradientEnd" className="block text-sm font-medium mb-2">종료 색상</label>
                <input
                  type="color"
                  id="gradientEnd"
                  value={bgGradient[1]}
                  onChange={(e) => setBgGradient([bgGradient[0], e.target.value])}
                  className="w-full h-10 rounded-md cursor-pointer"
                />
              </div>
            </div>
          )}
          
          {/* 속도 조절 */}
          <div>
            <label htmlFor="speed" className="block text-sm font-medium mb-2">
              이동 속도: {speed}px/sec
            </label>
            <input
              type="range"
              id="speed"
              min="20"
              max="200"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full"
            />
          </div>
          
          {/* 텍스트 간격 조절 */}
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
              onChange={(e) => setGap(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-gray-500 mt-1">
              0%: 텍스트가 붙어서 반복 | 100%: 완전히 사라진 후 반복
            </div>
          </div>
          
          {/* 생성 버튼 */}
          <button
            onClick={handleGenerate}
            disabled={!text || isGenerating}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isGenerating ? '생성 중...' : 'GIF 생성하기'}
          </button>
          
          {/* 미리보기 크기 안내 */}
          <div className="text-sm text-gray-500 text-center">
            * 생성되는 GIF는 128x128 크기의 Slack 이모지 규격입니다.
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
