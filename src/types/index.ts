export interface TextConfig {
  text: string;
  color: string;
  font: string;
  speed: number; // px/sec
  gap: number; // 텍스트 간격 (%)
  fontSize: number; // 글자 크기 (%)
  verticalOffset: number; // 수직 오프셋 (%)
  animationType: TextAnimationType;
  animationSpeed: number; // 애니메이션 속도
  animationIntensity: number; // 애니메이션 강도 (%)
  animationSettings: TextAnimationSettings;
}

export interface TextAnimationSettings {
  duration: number; // 애니메이션 지속시간 (초)
  repeat: number; // 반복 횟수 (-1: 무한반복)
  direction: 'normal' | 'reverse' | 'alternate'; // 애니메이션 방향
  // 효과별 세부 설정
  typing?: {
    showCursor: boolean; // 커서 표시 여부
    cursorBlinkSpeed: number; // 커서 깜빡임 속도
  };
  rotate?: {
    direction: 'clockwise' | 'counterclockwise' | 'alternate';
    maxRotation: number; // 최대 회전 각도 (도)
  };
  shake?: {
    frequency: number; // 진동 주파수
    damping: number; // 감쇠율
  };
  bounce?: {
    height: number; // 바운스 높이 (%)
    elasticity: number; // 탄성력
  };
  zoom?: {
    minScale: number; // 최소 크기 (%)
    maxScale: number; // 최대 크기 (%)
  };
  fade?: {
    minOpacity: number; // 최소 투명도 (%)
    maxOpacity: number; // 최대 투명도 (%)
  };
  colorChange?: {
    colors: string[]; // 변화할 색상 목록
    smooth: boolean; // 부드러운 전환 여부
  };
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

export type TextAnimationType = 
  | 'slide' // 슬라이딩 (기존)
  | 'typing' // 타이핑 효과
  | 'rotate' // 회전
  | 'shake' // 진동/떨림
  | 'bounce' // 바운스
  | 'zoom' // 줌 인/아웃
  | 'fade' // 페이드 인/아웃
  | 'colorChange'; // 색상 변화

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