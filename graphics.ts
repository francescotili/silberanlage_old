import { Bath } from './bath';

export class GraphicMotor {
  readonly width: number;
  readonly height: number;
  private readonly header = `<code>`;
  private readonly interline = `<br>`;
  private readonly footer = `</code>`;

  private data: string[][];
  private rendering: string;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.rendering = '';
    this.data = [];
    for (let h = 0; h < this.height; h++) {
      this.data.push([]);
    }
    console.log(this.data);
    for (let h = 0; h < this.height; h++) {
      for (let w = 0; w < this.width; w++) {
        this.data[h].push('0');
      }
    }
  }

  updateView(baths: Bath): string {
    this.rendering = '';
    this.rendering += this.header;
    for (let h = 0; h < this.height; h++) {
      for (let w = 0; w < this.width; w++) {
        switch (w) {
          case 1: {
            this.rendering += '1';
            break;
          }
          default: {
            this.rendering += '&nbsp;';
            break;
          }
        }
      }
      this.rendering += this.interline;
    }
    this.rendering += this.footer;
    return this.rendering;
  }
}
