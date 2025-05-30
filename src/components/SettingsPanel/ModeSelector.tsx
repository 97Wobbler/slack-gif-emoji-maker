import type { ContentMode } from '../../types'

interface ModeSelectorProps {
  mode: ContentMode
  setMode: (mode: ContentMode) => void
}

export function ModeSelector({ mode, setMode }: ModeSelectorProps) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-3">콘텐츠 타입</h3>
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setMode('text')}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
            mode === 'text'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          📝 텍스트
        </button>
        <button
          onClick={() => setMode('image')}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
            mode === 'image'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          🖼️ 이미지
        </button>
      </div>
    </div>
  )
} 