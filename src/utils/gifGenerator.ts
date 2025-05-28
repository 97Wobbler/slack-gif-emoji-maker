import GIF from 'gif.js';
import type { TextConfig, BackgroundConfig, GifConfig } from '../types';
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
      workers: 2,
      quality: 10,
      width: config.width,
      height: config.height,
      workerScript: '/gif.worker.js'
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

  private getTextWidth(text: TextConfig): number {
    const fontSize = this.canvas.height * (text.fontSize / 100);
    this.ctx.font = `bold ${fontSize}px "${text.font}"`;
    return this.ctx.measureText(text.text).width;
  }

  async generateGif(
    textConfig: TextConfig,
    bgConfig: BackgroundConfig,
    gifConfig?: GifConfig
  ): Promise<Blob> {
    // gifConfig가 없으면 기본값 사용
    const config = gifConfig || { width: 128, height: 128, fps: 33 };
    
    return new Promise((resolve, reject) => {
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

      this.gif.on('finished', (blob: Blob) => {
        // 다운로드 처리
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${textConfig.text}-emoji.gif`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        resolve(blob);
      });

      this.gif.on('error', (err: Error) => {
        reject(err);
      });

      this.gif.render();
    });
  }
} 