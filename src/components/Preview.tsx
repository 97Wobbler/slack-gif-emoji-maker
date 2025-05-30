import { useEffect, useRef } from 'react';
import type { TextConfig, BackgroundConfig, ContentMode, ImageConfig } from '../types';
import { calculateOptimalVerticalOffset, getOptimalTextBaseline } from '../utils/textAlignment';

interface PreviewProps {
  mode: ContentMode;
  textConfig: TextConfig;
  imageConfig: ImageConfig;
  bgConfig: BackgroundConfig;
  displaySize?: number;
}

const CANVAS_SIZE = 128; // 실제 캔버스 크기는 항상 128px로 고정

export function Preview({ mode, textConfig, imageConfig, bgConfig, displaySize = CANVAS_SIZE }: PreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | undefined>(undefined);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // 이미지 로드
  useEffect(() => {
    if (mode === 'image' && imageConfig.dataUrl) {
      const img = new Image();
      img.onload = () => {
        imageRef.current = img;
      };
      img.src = imageConfig.dataUrl;
    } else {
      imageRef.current = null;
    }
  }, [mode, imageConfig.dataUrl]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // 캔버스 크기 설정 (항상 128x128)
    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;

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
      const fontSize = CANVAS_SIZE * (textConfig.fontSize / 100);
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

    // 이미지 애니메이션 그리기 함수
    const drawImageAnimation = (timestamp: number) => {
      if (!imageRef.current) return;

      const progress = timestamp - (startTimeRef.current || 0);
      const { animationType, speed, intensity } = imageConfig;
      
      // 애니메이션 주기 계산 (속도에 따라)
      const cycleDuration = 2000 / speed; // 기본 2초 주기를 속도로 나눔
      const cycleProgress = (progress % cycleDuration) / cycleDuration;
      
      // 애니메이션 강도를 0-1 범위로 정규화
      const normalizedIntensity = intensity / 100;

      ctx.save();
      
      // 캔버스 중심으로 이동
      ctx.translate(CANVAS_SIZE / 2, CANVAS_SIZE / 2);

      switch (animationType) {
        case 'scale': {
          // 확대/축소 애니메이션
          const scale = 1 + Math.sin(cycleProgress * Math.PI * 2) * normalizedIntensity * 0.3;
          ctx.scale(scale, scale);
          break;
        }
        case 'horizontalSlide': {
          // 좌우 슬라이딩 애니메이션
          const slideX = Math.sin(cycleProgress * Math.PI * 2) * normalizedIntensity * 20;
          ctx.translate(slideX, 0);
          break;
        }
        case 'verticalStretch': {
          // 위아래 스케일링 애니메이션
          const scaleY = 1 + Math.sin(cycleProgress * Math.PI * 2) * normalizedIntensity * 0.4;
          ctx.scale(1, scaleY);
          break;
        }
        case 'bounce': {
          // 바운스 애니메이션
          const bounceY = Math.abs(Math.sin(cycleProgress * Math.PI * 2)) * normalizedIntensity * 15;
          ctx.translate(0, -bounceY);
          break;
        }
        case 'rotate': {
          // 회전 애니메이션
          const rotation = cycleProgress * Math.PI * 2 * normalizedIntensity;
          ctx.rotate(rotation);
          break;
        }
        case 'pulse': {
          // 펄스 애니메이션 (투명도 변화)
          const alpha = 0.3 + (1 - Math.abs(Math.sin(cycleProgress * Math.PI * 2))) * normalizedIntensity * 0.7;
          ctx.globalAlpha = alpha;
          break;
        }
      }

      // 이미지를 중앙에 그리기 (이미지는 이미 128x128로 크롭됨)
      ctx.drawImage(imageRef.current, -CANVAS_SIZE / 2, -CANVAS_SIZE / 2, CANVAS_SIZE, CANVAS_SIZE);
      
      ctx.restore();
    };

    // 텍스트 애니메이션 설정
    const setupTextAnimation = () => {
      const fontSize = CANVAS_SIZE * (textConfig.fontSize / 100);
      ctx.font = `bold ${fontSize}px "${textConfig.font}"`;
      const textWidth = ctx.measureText(textConfig.text).width;
      const gapPixels = CANVAS_SIZE * (textConfig.gap / 100);
      const unitWidth = textWidth + gapPixels;
      const numCopies = Math.ceil(CANVAS_SIZE / unitWidth) + 2;

      return { textWidth, unitWidth, numCopies };
    };

    // 애니메이션 프레임 함수
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;

      // 배경 그리기
      drawBackground();

      if (mode === 'text') {
        // 텍스트 애니메이션
        const { textWidth, unitWidth, numCopies } = setupTextAnimation();
        const progress = timestamp - startTimeRef.current;
        const distance = (progress * textConfig.speed) / 1000;
        const offset = distance % unitWidth;

        for (let i = 0; i < numCopies; i++) {
          const x = i * unitWidth - offset;
          if (x > -textWidth && x < CANVAS_SIZE) {
            drawText(x);
          }
        }
      } else if (mode === 'image') {
        // 이미지 애니메이션
        drawImageAnimation(timestamp);
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
  }, [mode, textConfig, imageConfig, bgConfig]);

  // 작은 크기 (슬랙 이모지 크기)일 때와 큰 크기 (미리보기)일 때 다른 스타일 적용
  const isSmallSize = displaySize < CANVAS_SIZE;
  const canvasClassName = isSmallSize ? 'shadow-sm' : 'border rounded-lg';
  const backgroundDivClassName = isSmallSize ? 'absolute inset-0 -z-10' : 'absolute inset-0 -z-10 rounded-lg';

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className={canvasClassName}
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
          className={backgroundDivClassName}
          style={{
            background: 'repeating-comb-pattern'
          }}
        />
      )}
    </div>
  );
} 