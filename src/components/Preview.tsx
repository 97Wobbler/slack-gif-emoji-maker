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

    // 텍스트 그리기 함수 (기본 슬라이딩용)
    const drawText = (x: number, text: string = textConfig.text) => {
      const fontSize = CANVAS_SIZE * (textConfig.fontSize / 100);
      ctx.font = `bold ${fontSize}px "${textConfig.font}"`;
      ctx.fillStyle = textConfig.color;
      ctx.textBaseline = getOptimalTextBaseline(text);
      
      // 수직 오프셋 계산 (캔버스 높이의 50%에서 시작 + 사용자 오프셋 + 동적 조정)
      const baseY = CANVAS_SIZE / 2;
      const userOffset = CANVAS_SIZE * (textConfig.verticalOffset / 100);
      const dynamicOffset = calculateOptimalVerticalOffset(text, 0);
      const offsetY = baseY - userOffset + dynamicOffset;
      
      ctx.fillText(text, x, offsetY);
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

    // 텍스트 애니메이션 그리기 함수
    const drawTextAnimation = (timestamp: number) => {
      const progress = timestamp - (startTimeRef.current || 0);
      const { animationType, animationSpeed, animationIntensity, animationSettings } = textConfig;
      
      // 애니메이션 주기 계산 (설정된 지속시간 사용)
      const cycleDuration = animationSettings.duration * 1000; // 초를 밀리초로 변환
      let cycleProgress = (progress % cycleDuration) / cycleDuration;

      // 애니메이션 방향 처리
      if (animationSettings.direction === 'reverse') {
        cycleProgress = 1 - cycleProgress;
      } else if (animationSettings.direction === 'alternate') {
        const cycle = Math.floor(progress / cycleDuration);
        if (cycle % 2 === 1) {
          cycleProgress = 1 - cycleProgress;
        }
      }

      // 반복 횟수 처리
      if (animationSettings.repeat !== -1) {
        const currentCycle = Math.floor(progress / cycleDuration);
        if (currentCycle >= animationSettings.repeat) {
          // 애니메이션 완료 상태로 고정
          cycleProgress = animationSettings.direction === 'reverse' ? 0 : 1;
        }
      }

      const normalizedIntensity = animationIntensity / 100;

      ctx.save();

      switch (animationType) {
        case 'slide': {
          // 기존 슬라이딩 애니메이션
          const { textWidth, unitWidth, numCopies } = setupTextAnimation();
          const distance = (progress * textConfig.speed) / 1000;
          const offset = distance % unitWidth;

          for (let i = 0; i < numCopies; i++) {
            const x = i * unitWidth - offset;
            if (x > -textWidth && x < CANVAS_SIZE) {
              drawText(x);
            }
          }
          break;
        }
        
        case 'typing': {
          // 타이핑 효과 (개선된 버전)
          const totalChars = textConfig.text.length;
          const charsToShow = Math.floor((cycleProgress * totalChars) + 1);
          const visibleText = textConfig.text.substring(0, charsToShow);
          
          // 중앙 정렬
          const fontSize = CANVAS_SIZE * (textConfig.fontSize / 100);
          ctx.font = `bold ${fontSize}px "${textConfig.font}"`;
          const textWidth = ctx.measureText(visibleText).width;
          const x = (CANVAS_SIZE - textWidth) / 2;
          
          drawText(x, visibleText);

          // 커서 표시 (설정이 활성화된 경우)
          if (animationSettings.typing?.showCursor) {
            const cursorBlinkSpeed = animationSettings.typing.cursorBlinkSpeed ?? 1;
            const blinkProgress = (progress * cursorBlinkSpeed / 1000) % 1;
            if (blinkProgress < 0.5) {
              ctx.fillStyle = textConfig.color;
              ctx.fillRect(x + textWidth + 2, 
                          CANVAS_SIZE / 2 - fontSize / 2, 
                          2, fontSize);
            }
          }
          break;
        }
        
        case 'rotate': {
          // 회전 효과 (개선된 버전)
          const fontSize = CANVAS_SIZE * (textConfig.fontSize / 100);
          ctx.font = `bold ${fontSize}px "${textConfig.font}"`;
          const textWidth = ctx.measureText(textConfig.text).width;
          
          // 캔버스 중심으로 이동
          ctx.translate(CANVAS_SIZE / 2, CANVAS_SIZE / 2);
          
          // 회전 방향과 최대 각도 적용
          const rotateSettings = animationSettings.rotate;
          const maxRotation = (rotateSettings?.maxRotation ?? 360) * Math.PI / 180;
          let rotation = cycleProgress * maxRotation * normalizedIntensity;
          
          if (rotateSettings?.direction === 'counterclockwise') {
            rotation = -rotation;
          } else if (rotateSettings?.direction === 'alternate') {
            rotation = Math.sin(cycleProgress * Math.PI * 2) * maxRotation * normalizedIntensity;
          }
          
          ctx.rotate(rotation);
          
          // 텍스트를 중앙에 그리기
          drawText(-textWidth / 2, textConfig.text);
          break;
        }
        
        case 'shake': {
          // 진동/떨림 효과 (개선된 버전)
          const shakeSettings = animationSettings.shake;
          const frequency = shakeSettings?.frequency ?? 10;
          const damping = shakeSettings?.damping ?? 0.1;
          
          const shakeX = Math.sin(progress * frequency / 100) * normalizedIntensity * 10 * (1 - damping * cycleProgress);
          const shakeY = Math.cos(progress * frequency / 100) * normalizedIntensity * 10 * (1 - damping * cycleProgress);
          
          const fontSize = CANVAS_SIZE * (textConfig.fontSize / 100);
          ctx.font = `bold ${fontSize}px "${textConfig.font}"`;
          const textWidth = ctx.measureText(textConfig.text).width;
          const x = (CANVAS_SIZE - textWidth) / 2 + shakeX;
          
          ctx.translate(0, shakeY);
          drawText(x, textConfig.text);
          break;
        }
        
        case 'bounce': {
          // 바운스 효과 (개선된 버전)
          const bounceSettings = animationSettings.bounce;
          const height = (bounceSettings?.height ?? 50) / 100;
          const elasticity = bounceSettings?.elasticity ?? 0.8;
          
          const bounceY = Math.abs(Math.sin(cycleProgress * Math.PI * 2)) * normalizedIntensity * 30 * height * elasticity;
          
          const fontSize = CANVAS_SIZE * (textConfig.fontSize / 100);
          ctx.font = `bold ${fontSize}px "${textConfig.font}"`;
          const textWidth = ctx.measureText(textConfig.text).width;
          const x = (CANVAS_SIZE - textWidth) / 2;
          
          ctx.translate(0, -bounceY);
          drawText(x, textConfig.text);
          break;
        }
        
        case 'zoom': {
          // 줌 인/아웃 효과 (개선된 버전)
          const zoomSettings = animationSettings.zoom;
          const minScale = (zoomSettings?.minScale ?? 80) / 100;
          const maxScale = (zoomSettings?.maxScale ?? 150) / 100;
          
          const scaleRange = maxScale - minScale;
          const scale = minScale + (Math.sin(cycleProgress * Math.PI * 2) * 0.5 + 0.5) * scaleRange * normalizedIntensity;
          
          // 캔버스 중심으로 이동하고 스케일 적용
          ctx.translate(CANVAS_SIZE / 2, CANVAS_SIZE / 2);
          ctx.scale(scale, scale);
          
          const fontSize = CANVAS_SIZE * (textConfig.fontSize / 100);
          ctx.font = `bold ${fontSize}px "${textConfig.font}"`;
          const textWidth = ctx.measureText(textConfig.text).width;
          
          drawText(-textWidth / 2, textConfig.text);
          break;
        }
        
        case 'fade': {
          // 페이드 인/아웃 효과 (개선된 버전)
          const fadeSettings = animationSettings.fade;
          const minOpacity = (fadeSettings?.minOpacity ?? 30) / 100;
          const maxOpacity = (fadeSettings?.maxOpacity ?? 100) / 100;
          
          const opacityRange = maxOpacity - minOpacity;
          const alpha = minOpacity + (Math.sin(cycleProgress * Math.PI * 2) * 0.5 + 0.5) * opacityRange * normalizedIntensity;
          ctx.globalAlpha = alpha;
          
          const fontSize = CANVAS_SIZE * (textConfig.fontSize / 100);
          ctx.font = `bold ${fontSize}px "${textConfig.font}"`;
          const textWidth = ctx.measureText(textConfig.text).width;
          const x = (CANVAS_SIZE - textWidth) / 2;
          
          drawText(x, textConfig.text);
          break;
        }
        
        case 'colorChange': {
          // 색상 변화 효과 (개선된 버전)
          const colorSettings = animationSettings.colorChange;
          const colors = colorSettings?.colors ?? ['#ff0000', '#00ff00', '#0000ff'];
          const smooth = colorSettings?.smooth ?? true;
          
          if (smooth) {
            const hue = (cycleProgress * 360 * normalizedIntensity) % 360;
            ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
          } else {
            const colorIndex = Math.floor(cycleProgress * colors.length) % colors.length;
            ctx.fillStyle = colors[colorIndex];
          }
          
          const fontSize = CANVAS_SIZE * (textConfig.fontSize / 100);
          ctx.font = `bold ${fontSize}px "${textConfig.font}"`;
          const textWidth = ctx.measureText(textConfig.text).width;
          const x = (CANVAS_SIZE - textWidth) / 2;
          
          // 수직 오프셋 계산
          const baseY = CANVAS_SIZE / 2;
          const userOffset = CANVAS_SIZE * (textConfig.verticalOffset / 100);
          const dynamicOffset = calculateOptimalVerticalOffset(textConfig.text, 0);
          const offsetY = baseY - userOffset + dynamicOffset;
          
          ctx.textBaseline = getOptimalTextBaseline(textConfig.text);
          ctx.fillText(textConfig.text, x, offsetY);
          break;
        }
      }

      ctx.restore();
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

    // 애니메이션 프레임 함수
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;

      // 배경 그리기
      drawBackground();

      if (mode === 'text') {
        // 텍스트 애니메이션
        drawTextAnimation(timestamp);
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