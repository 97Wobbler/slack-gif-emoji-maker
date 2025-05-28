import type { TextConfig, BackgroundConfig } from '../types'
import { Preview } from './Preview'

interface PreviewPanelProps {
  textConfig: TextConfig
  bgConfig: BackgroundConfig
}

export function PreviewPanel({ textConfig, bgConfig }: PreviewPanelProps) {
  return (
    <section className="flex flex-col items-center w-80">
      <h2 className="text-lg font-medium mb-2">미리보기</h2>
      <Preview textConfig={textConfig} bgConfig={bgConfig} />
      <div className="text-sm text-gray-500 mt-2">실제 슬랙 이모지 크기</div>
      <Preview textConfig={textConfig} bgConfig={bgConfig} displaySize={24} />
    </section>
  )
} 