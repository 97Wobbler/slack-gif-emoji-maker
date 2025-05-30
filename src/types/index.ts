export interface TextConfig {
  text: string;
  color: string;
  font: string;
  speed: number; // px/sec
  gap: number; // 텍스트 간격 (%)
  fontSize: number; // 글자 크기 (%)
  verticalOffset: number; // 수직 오프셋 (%)
}

export interface ImageConfig {
  file: File | null;
  dataUrl: string | null;
  animationType: AnimationType;
  speed: number; // 애니메이션 속도
  intensity: number; // 애니메이션 강도 (%)
}

export type AnimationType = 
  | 'scale' // 확대/축소
  | 'horizontalSlide' // 좌우 슬라이딩
  | 'verticalStretch' // 위아래 스케일링
  | 'bounce' // 바운스
  | 'rotate' // 회전
  | 'pulse'; // 펄스

export type ContentMode = 'text' | 'image';

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