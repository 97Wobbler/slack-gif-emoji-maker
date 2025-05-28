export interface TextConfig {
  text: string;
  color: string;
  font: string;
  speed: number; // px/sec
  gap: number; // 텍스트 간격 (%)
  fontSize: number; // 글자 크기 (%)
}

export interface BackgroundConfig {
  type: 'solid' | 'gradient' | 'transparent';
  color: string;
  gradientColors?: [string, string];
}

export interface GifConfig {
  width: number;
  height: number;
  fps: number;
} 