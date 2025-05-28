interface ExportButtonProps {
  isGenerating: boolean
  handleGenerate: () => void
}

export function ExportButton({ isGenerating, handleGenerate }: ExportButtonProps) {
  return (
    <button
      onClick={handleGenerate}
      disabled={isGenerating}
      className={`
        w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 
        text-white rounded-lg font-medium shadow-sm
        hover:from-purple-600 hover:to-pink-600 
        disabled:from-gray-400 disabled:to-gray-500
        disabled:cursor-not-allowed
        transition-all duration-200 transform
        ${isGenerating ? 'scale-95' : 'hover:scale-105'}
        flex items-center justify-center gap-2
      `}
    >
      <div className={`transition-transform duration-200 ${isGenerating ? 'animate-spin' : ''}`}>
        🎬
      </div>
      <span>
        {isGenerating ? '생성 중...' : 'GIF 생성하기'}
      </span>
    </button>
  )
} 