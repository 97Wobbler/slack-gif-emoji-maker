import GIF from 'gif.js';
import type { TextConfig, BackgroundConfig, GifConfig } from '../types';

export class GifGenerator {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private gif: any;

  constructor(config: GifConfig) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = config.width;
    this.canvas.height = config.height;
    this.ctx = this.canvas.getContext('2d')!;
    
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
      const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, 0);
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
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(text.text, x, this.canvas.height / 2);
  }

  private getTextWidth(text: TextConfig): number {
    const fontSize = this.canvas.height * (text.fontSize / 100);
    this.ctx.font = `bold ${fontSize}px "${text.font}"`;
    return this.ctx.measureText(text.text).width;
  }

  async generateGif(
    textConfig: TextConfig,
    bgConfig: BackgroundConfig,
    gifConfig: GifConfig
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const textWidth = this.getTextWidth(textConfig);
      const gapPixels = this.canvas.width * (textConfig.gap / 100);
      const unitWidth = textWidth + gapPixels;
      
      // 필요한 텍스트 복사본 개수 계산 (캔버스 너비보다 넉넉하게)
      const numCopies = Math.ceil(this.canvas.width / unitWidth) + 2;
      
      // 한 사이클이 완료되는 시간 계산 (unitWidth만큼 이동하는 시간)
      const cycleDuration = unitWidth / textConfig.speed; // seconds
      const frameCount = Math.ceil(cycleDuration * gifConfig.fps);
      
      for (let i = 0; i < frameCount; i++) {
        this.drawBackground(bgConfig);
        
        // 현재 프레임의 애니메이션 오프셋
        const currentTime = (i / gifConfig.fps);
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
        
        this.gif.addFrame(this.ctx, { copy: true, delay: 1000 / gifConfig.fps });
      }

      this.gif.on('finished', (blob: Blob) => {
        resolve(blob);
      });

      this.gif.on('error', (err: Error) => {
        reject(err);
      });

      this.gif.render();
    });
  }
} 