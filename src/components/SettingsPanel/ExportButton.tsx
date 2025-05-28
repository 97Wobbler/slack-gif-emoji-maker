interface ExportButtonProps {
  isGenerating: boolean
  handleGenerate: () => void
  text: string
}

export function ExportButton({ isGenerating, handleGenerate, text }: ExportButtonProps) {
  return (
    <button
      onClick={handleGenerate}
      disabled={isGenerating}
      className="w-full py-2 px-4 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
    >
      {isGenerating ? '생성 중...' : 'GIF 생성하기'}
    </button>
  )
} 