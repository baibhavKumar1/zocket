export class Canvas {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
  
    constructor(canvas: HTMLCanvasElement) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d')!;
    }
  
    drawBackground(color: string): void {
      this.ctx.fillStyle = color;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
  
    drawPattern(patternUrl: string): void {
      const patternImg = new Image();
      patternImg.src = patternUrl;
      patternImg.onload = () => {
        const pattern = this.ctx.createPattern(patternImg, 'repeat')!;
        this.ctx.fillStyle = pattern;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      };
    }
  
    drawMaskStroke(maskStrokeUrl: string, x: number, y: number, width: number, height: number): void {
      const maskStrokeImg = new Image();
      maskStrokeImg.src = maskStrokeUrl;
      maskStrokeImg.onload = () => {
        this.ctx.drawImage(maskStrokeImg, x, y, width, height);
      };
    }
  
    drawText(text: string, x: number, y: number, color: string, fontSize: number, alignment: CanvasTextAlign, maxCharactersPerLine: number): void {
      this.ctx.fillStyle = color;
      this.ctx.font = `${fontSize}px Arial`;
      this.ctx.textAlign = alignment;
  
      const words = text.split(' ');
      let line = '';
      const lineHeight = fontSize * 1.1;
  
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = this.ctx.measureText(testLine);
        const testWidth = metrics.width;
  
        if (testWidth > maxCharactersPerLine * (fontSize / 2) && n > 0) {
          this.ctx.fillText(line.trim(), x, y);
          line = words[n] + ' ';
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
  
      this.ctx.fillText(line.trim(), x, y);
    }
  
    drawCTA(text: string, x: number, y: number, textColor: string, backgroundColor: string, width: number, height: number): void {
      this.ctx.fillStyle = backgroundColor;
      this.ctx.fillRect(x, y, width, height);
      this.ctx.fillStyle = textColor;
      this.ctx.font = '30px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
  
      const words = text.split(' ');
      let line = '';
      const lineHeight = 36;
  
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = this.ctx.measureText(testLine);
        const testWidth = metrics.width;
  
        if (testWidth > width && n > 0) {
          this.ctx.fillText(line.trim(), x + width / 2, y + height / 2);
          line = words[n] + ' ';
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
  
      this.ctx.fillText(line.trim(), x + width / 2, y + height / 2);
    }
  
    drawImageWithinMask(image: HTMLImageElement, maskX: number, maskY: number, maskWidth: number, maskHeight: number): void {
      if (image.complete) {
        const imageAspectRatio = image.width / image.height;
        const maskAspectRatio = maskWidth / maskHeight;
  
        let scaledWidth, scaledHeight, drawX, drawY;
        console.log(imageAspectRatio,maskAspectRatio);
        if (imageAspectRatio > maskAspectRatio) {
          scaledHeight = maskHeight;
          scaledWidth = scaledHeight * imageAspectRatio;
          drawX = maskX + (maskWidth - scaledWidth) / 2;
          drawY = maskY;
        } else {
          scaledWidth = maskWidth;
          scaledHeight = scaledWidth / imageAspectRatio;
          drawX = maskX;
          drawY = maskY + (maskHeight - scaledHeight) / 2;
        }
  
        this.ctx.save();
        this.ctx.clearRect(drawX,
            drawY,
            scaledWidth,
            scaledHeight);
        this.ctx.drawImage(
          image,
          drawX,
          drawY,
          scaledWidth,
          scaledHeight
        );
        
        this.ctx.restore();
      } else {
        console.error('Image is not fully loaded');
      }
    }
  }
  