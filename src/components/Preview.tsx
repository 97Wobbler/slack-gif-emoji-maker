import { useEffect, useRef } from 'react';
import type { TextConfig, BackgroundConfig } from '../types';
import { calculateOptimalVerticalOffset, getOptimalTextBaseline } from '../utils/textAlignment';

interface PreviewProps {
  textConfig: TextConfig;
  bgConfig: BackgroundConfig;
  displaySize?: number;
}

const CANVAS_SIZE = 128; // 실제 캔버스 크기는 항상 128px로 고정

export function Preview({ textConfig, bgConfig, displaySize = CANVAS_SIZE }: PreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 캔버스 크기 설정 (항상 128x128)
    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;

    // 글자 크기 계산
    const fontSize = CANVAS_SIZE * (textConfig.fontSize / 100);

    // 배경 그리기 함수
    const drawBackground = () => {
      if (bgConfig.type === 'transparent') {
        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        return;
      }

      if (bgConfig.type === 'solid') {
        ctx.fillStyle = bgConfig.color;
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        return;
      }

      if (bgConfig.type === 'gradient' && bgConfig.gradientColors) {
        const gradient = ctx.createLinearGradient(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        gradient.addColorStop(0, bgConfig.gradientColors[0]);
        gradient.addColorStop(1, bgConfig.gradientColors[1]);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      }
    };

    // 텍스트 그리기 함수
    const drawText = (x: number) => {
      ctx.font = `bold ${fontSize}px "${textConfig.font}"`;
      ctx.fillStyle = textConfig.color;
      ctx.textBaseline = getOptimalTextBaseline(textConfig.text);
      
      // 수직 오프셋 계산 (캔버스 높이의 50%에서 시작 + 사용자 오프셋 + 동적 조정)
      const baseY = CANVAS_SIZE / 2;
      const userOffset = CANVAS_SIZE * (textConfig.verticalOffset / 100);
      const dynamicOffset = calculateOptimalVerticalOffset(textConfig.text, 0);
      const offsetY = baseY - userOffset + dynamicOffset;
      
      ctx.fillText(textConfig.text, x, offsetY);
    };

    // 텍스트 너비 및 간격 계산
    ctx.font = `bold ${fontSize}px "${textConfig.font}"`;
    const textWidth = ctx.measureText(textConfig.text).width;
    const gapPixels = CANVAS_SIZE * (textConfig.gap / 100); // canvas.width 기준으로 변경
    const unitWidth = textWidth + gapPixels; // 텍스트 + 간격의 전체 단위

    // 필요한 텍스트 복사본 개수 계산 (캔버스 너비보다 넉넉하게)
    const numCopies = Math.ceil(CANVAS_SIZE / unitWidth) + 2;

    // 애니메이션 프레임 함수
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = timestamp - startTimeRef.current;

      // 배경과 캔버스 초기화
      drawBackground();

      // 애니메이션 오프셋 계산
      const distance = (progress * textConfig.speed) / 1000;
      const offset = distance % unitWidth;

      // 텍스트 복사본들을 나열하여 렌더링
      for (let i = 0; i < numCopies; i++) {
        const x = i * unitWidth - offset;
        
        // 텍스트가 화면 범위 내에 있을 때만 그리기
        if (x > -textWidth && x < CANVAS_SIZE) {
          drawText(x);
        }
      }

      // 다음 프레임 요청
      animationRef.current = requestAnimationFrame(animate);
    };

    // 애니메이션 시작
    animationRef.current = requestAnimationFrame(animate);

    // 클린업 함수
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [textConfig, bgConfig]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="border rounded-lg"
        style={{
          width: displaySize,
          height: displaySize,
          imageRendering: displaySize < CANVAS_SIZE ? 'pixelated' : 'auto',
          background: bgConfig.type === 'transparent' ? 
            'repeating-comb-pattern' : undefined
        }}
      />
      {bgConfig.type === 'transparent' && (
        <div 
          className="absolute inset-0 -z-10 rounded-lg"
          style={{
            background: 'repeating-comb-pattern'
          }}
        />
      )}
    </div>
  );
} 