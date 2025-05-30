import type { TextConfig, BackgroundConfig, ContentMode, ImageConfig } from '../types'
import { Preview } from './Preview'

interface PreviewPanelProps {
  mode: ContentMode
  textConfig: TextConfig
  imageConfig: ImageConfig
  bgConfig: BackgroundConfig
}

export function PreviewPanel({ mode, textConfig, imageConfig, bgConfig }: PreviewPanelProps) {
  return (
    <section className="flex flex-col items-center w-80">
      <h2 className="text-lg font-medium mb-2">미리보기</h2>
      <Preview mode={mode} textConfig={textConfig} imageConfig={imageConfig} bgConfig={bgConfig} />
      <div className="text-sm text-gray-500 mt-2">실제 슬랙 이모지 크기</div>
      <Preview mode={mode} textConfig={textConfig} imageConfig={imageConfig} bgConfig={bgConfig} displaySize={24} />
    </section>
  )
} 