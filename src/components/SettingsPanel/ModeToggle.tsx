import type { ContentMode } from '../../types'

interface ModeToggleProps {
  mode: ContentMode
  setMode: (mode: ContentMode) => void
}

export function ModeToggle({ mode, setMode }: ModeToggleProps) {
  return (
    <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
      <button
        onClick={() => setMode('text')}
        className={`
          flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200
          ${mode === 'text'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
          }
        `}
      >
        📝 텍스트 모드
      </button>
      <button
        onClick={() => setMode('image')}
        className={`
          flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200
          ${mode === 'image'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
          }
        `}
      >
        🖼️ 이미지 모드
      </button>
    </div>
  )
} 