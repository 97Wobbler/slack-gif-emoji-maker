import GIF from 'gif.js';
import type { TextConfig, BackgroundConfig, GifConfig, ImageConfig, ContentMode } from '../types';
import { calculateOptimalVerticalOffset, getOptimalTextBaseline } from './textAlignment';

export class GifGenerator {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private gif: any;

  constructor(config: GifConfig) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = config.width;
    this.canvas.height = config.height;
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true })!;
    
    this.gif = new GIF({
      workers: 1,
      quality: 10,
      width: config.width,
      height: config.height,
      workerScript: '/slack-gif-emoji-maker/gif.worker.js'
    });
  }

  private drawBackground(bg: BackgroundConfig) {
    if (bg.type === 'transparent') {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      return;
    }

    if (bg.type === 'solid') {
      this.ctx.fillStyle = bg.color;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      return;
    }

    if (bg.type === 'gradient' && bg.gradientColors) {
      const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
      gradient.addColorStop(0, bg.gradientColors[0]);
      gradient.addColorStop(1, bg.gradientColors[1]);
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  private drawText(text: TextConfig, x: number) {
    const fontSize = this.canvas.height * (text.fontSize / 100);
    this.ctx.font = `bold ${fontSize}px "${text.font}"`;
    this.ctx.fillStyle = text.color;
    this.ctx.textBaseline = getOptimalTextBaseline(text.text);
    
    // 수직 오프셋 계산 (캔버스 높이의 50%에서 시작 + 사용자 오프셋 + 동적 조정)
    const baseY = this.canvas.height / 2;
    const userOffset = this.canvas.height * (text.verticalOffset / 100);
    const dynamicOffset = calculateOptimalVerticalOffset(text.text, 0);
    const offsetY = baseY - userOffset + dynamicOffset;
    
    this.ctx.fillText(text.text, x, offsetY);
  }

  private drawImageAnimation(image: HTMLImageElement, imageConfig: ImageConfig, progress: number) {
    const { animationType, speed, intensity } = imageConfig;
    
    // 애니메이션 주기 계산 (속도에 따라)
    const cycleDuration = 2000 / speed; // 기본 2초 주기를 속도로 나눔
    const cycleProgress = (progress % cycleDuration) / cycleDuration;
    
    // 애니메이션 강도를 0-1 범위로 정규화
    const normalizedIntensity = intensity / 100;

    this.ctx.save();
    
    // 캔버스 중심으로 이동
    this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);

    switch (animationType) {
      case 'scale': {
        // 확대/축소 애니메이션
        const scale = 1 + Math.sin(cycleProgress * Math.PI * 2) * normalizedIntensity * 0.3;
        this.ctx.scale(scale, scale);
        break;
      }
      case 'horizontalSlide': {
        // 좌우 슬라이딩 애니메이션
        const slideX = Math.sin(cycleProgress * Math.PI * 2) * normalizedIntensity * 20;
        this.ctx.translate(slideX, 0);
        break;
      }
      case 'verticalStretch': {
        // 위아래 스케일링 애니메이션
        const scaleY = 1 + Math.sin(cycleProgress * Math.PI * 2) * normalizedIntensity * 0.4;
        this.ctx.scale(1, scaleY);
        break;
      }
      case 'bounce': {
        // 바운스 애니메이션
        const bounceY = Math.abs(Math.sin(cycleProgress * Math.PI * 2)) * normalizedIntensity * 15;
        this.ctx.translate(0, -bounceY);
        break;
      }
      case 'rotate': {
        // 회전 애니메이션
        const rotation = cycleProgress * Math.PI * 2 * normalizedIntensity;
        this.ctx.rotate(rotation);
        break;
      }
      case 'pulse': {
        // 펄스 애니메이션 (투명도 변화)
        const alpha = 0.3 + (1 - Math.abs(Math.sin(cycleProgress * Math.PI * 2))) * normalizedIntensity * 0.7;
        this.ctx.globalAlpha = alpha;
        break;
      }
    }

    // 이미지를 중앙에 그리기 (이미지는 이미 128x128로 크롭됨)
    this.ctx.drawImage(image, -this.canvas.width / 2, -this.canvas.height / 2, this.canvas.width, this.canvas.height);
    
    this.ctx.restore();
  }

  private getTextWidth(text: TextConfig): number {
    const fontSize = this.canvas.height * (text.fontSize / 100);
    this.ctx.font = `bold ${fontSize}px "${text.font}"`;
    return this.ctx.measureText(text.text).width;
  }

  private async loadImage(dataUrl: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = dataUrl;
    });
  }

  async generateGif(
    mode: ContentMode,
    textConfig: TextConfig,
    imageConfig: ImageConfig,
    bgConfig: BackgroundConfig,
    gifConfig?: GifConfig
  ): Promise<Blob> {
    // gifConfig가 없으면 기본값 사용
    const config = gifConfig || { width: 128, height: 128, fps: 33 };
    
    return new Promise(async (resolve, reject) => {
      try {
        if (mode === 'text') {
          // 텍스트 애니메이션 생성
          await this.generateTextGif(textConfig, bgConfig, config, resolve, reject);
        } else if (mode === 'image') {
          // 이미지 애니메이션 생성
          if (!imageConfig.dataUrl) {
            reject(new Error('이미지가 업로드되지 않았습니다.'));
            return;
          }
          await this.generateImageGif(imageConfig, bgConfig, config, resolve, reject);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  private async generateTextGif(
    textConfig: TextConfig,
    bgConfig: BackgroundConfig,
    config: GifConfig,
    resolve: (blob: Blob) => void,
    reject: (error: Error) => void
  ) {
    const textWidth = this.getTextWidth(textConfig);
    const gapPixels = this.canvas.width * (textConfig.gap / 100);
    const unitWidth = textWidth + gapPixels;
    
    // 필요한 텍스트 복사본 개수 계산 (캔버스 너비보다 넉넉하게)
    const numCopies = Math.ceil(this.canvas.width / unitWidth) + 2;
    
    // 한 사이클이 완료되는 시간 계산 (unitWidth만큼 이동하는 시간)
    const cycleDuration = unitWidth / textConfig.speed; // seconds
    const frameCount = Math.ceil(cycleDuration * config.fps);
    
    for (let i = 0; i < frameCount; i++) {
      this.drawBackground(bgConfig);
      
      // 현재 프레임의 애니메이션 오프셋
      const currentTime = (i / config.fps);
      const distance = currentTime * textConfig.speed;
      const offset = distance % unitWidth;
      
      // 텍스트 복사본들을 나열하여 렌더링
      for (let j = 0; j < numCopies; j++) {
        const x = j * unitWidth - offset;
        
        // 텍스트가 화면 범위 내에 있을 때만 그리기
        if (x > -textWidth && x < this.canvas.width) {
          this.drawText(textConfig, x);
        }
      }
      
      this.gif.addFrame(this.ctx, { copy: true, delay: 1000 / config.fps });
    }

    this.setupGifCallbacks(resolve, reject, `${textConfig.text}-emoji.gif`);
    this.gif.render();
  }

  private async generateImageGif(
    imageConfig: ImageConfig,
    bgConfig: BackgroundConfig,
    config: GifConfig,
    resolve: (blob: Blob) => void,
    reject: (error: Error) => void
  ) {
    try {
      const image = await this.loadImage(imageConfig.dataUrl!);
      
      // 애니메이션 주기 계산 (속도에 따라)
      const cycleDuration = 2000 / imageConfig.speed; // 기본 2초 주기를 속도로 나눔
      const frameCount = Math.ceil(cycleDuration * config.fps / 1000); // 밀리초를 초로 변환
      
      for (let i = 0; i < frameCount; i++) {
        this.drawBackground(bgConfig);
        
        // 현재 프레임의 진행률 계산
        const progress = (i / frameCount) * cycleDuration;
        
        // 이미지 애니메이션 그리기
        this.drawImageAnimation(image, imageConfig, progress);
        
        this.gif.addFrame(this.ctx, { copy: true, delay: 1000 / config.fps });
      }

      const fileName = `${imageConfig.animationType}-image-emoji.gif`;
      this.setupGifCallbacks(resolve, reject, fileName);
      this.gif.render();
    } catch (error) {
      reject(error instanceof Error ? error : new Error('이미지 로드 실패'));
    }
  }

  private setupGifCallbacks(
    resolve: (blob: Blob) => void,
    reject: (error: Error) => void,
    fileName: string
  ) {
    this.gif.on('finished', (blob: Blob) => {
      // 다운로드 처리
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      resolve(blob);
    });

    this.gif.on('error', (err: Error) => {
      reject(err);
    });

    this.gif.on('progress', (_progress: number) => {
      // 진행률 처리 (필요시 UI 업데이트)
    });
  }
} 