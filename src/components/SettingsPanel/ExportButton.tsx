interface ExportButtonProps {
  isGenerating: boolean
  handleGenerate: () => void
  text: string
}

export function ExportButton({ isGenerating, handleGenerate, text }: ExportButtonProps) {
  return (
    <button
      onClick={handleGenerate}
      disabled={!text || isGenerating}
      className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      {isGenerating ? '생성 중...' : 'GIF 생성하기'}
    </button>
  )
} 