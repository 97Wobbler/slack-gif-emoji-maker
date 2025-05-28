import { useState } from 'react'
import { generateRandomColorCombination, ensureGoodContrast } from '../../utils/colorUtils'
import type { BackgroundConfig } from '../../types'

interface ColorRandomizerProps {
  setTextColor: (color: string) => void
  setBgColor: (color: string) => void
  setBgGradient: (gradient: [string, string]) => void
  bgType: BackgroundConfig['type']
}

export function ColorRandomizer({ 
  setTextColor, 
  setBgColor, 
  setBgGradient, 
  bgType 
}: ColorRandomizerProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleRandomize = () => {
    setIsAnimating(true)
    
    // 애니메이션 효과를 위한 약간의 지연
    setTimeout(() => {
      const rawCombination = generateRandomColorCombination()
      const combination = ensureGoodContrast(rawCombination)
      
      // 색상 적용
      setTextColor(combination.textColor)
      setBgColor(combination.bgColor)
      setBgGradient(combination.bgGradient)
      
      setIsAnimating(false)
    }, 200)
  }

  return (
    <div className="mb-4">
      <button
        onClick={handleRandomize}
        disabled={isAnimating}
        className={`
          w-full py-3 px-4 bg-gray-200 
          text-gray-900 rounded-lg font-medium shadow-sm
          hover:bg-gray-300 
          disabled:bg-gray-100 disabled:text-gray-500
          disabled:cursor-not-allowed
          transition-all duration-200 transform
          ${isAnimating ? 'scale-95' : 'hover:scale-105'}
          flex items-center justify-center gap-2
        `}
      >
        <div className={`transition-transform duration-200 ${isAnimating ? 'animate-spin' : ''}`}>
          🎲
        </div>
        <span>
          {isAnimating ? '색상 생성 중...' : '색상 조합 주사위'}
        </span>
      </button>
      <div className="text-xs text-gray-500 mt-2 text-center">
        {bgType === 'solid' ? '텍스트 + 배경 단색' : 
         bgType === 'gradient' ? '텍스트 + 배경 그라디언트' : 
         '텍스트 색상만'} 자동 설정
      </div>
    </div>
  )
} 