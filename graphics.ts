import { BathView } from './plant';

export class GraphicMotor {
  readonly width: number;
  private readonly header = `<code>`;
  private readonly interline = `<br>`;
  private readonly footer = `</code>`;

  private data: string[][];
  private rendering: string;

  constructor(width: number) {
    this.width = width;
    this.rendering = '';
    this.data = [];
  }

  updateView(baths: BathView[]): string {
    this.rendering = '';
    this.rendering += this.header;

    const whitespace = '&nbsp;';
    //const whitespace = "."

    let topLine: string;
    let middleLine: string;
    let bottomLine: string;

    // Characters for every string
    const len1 = 2;
    const len2 = 2; // Bath ID placeholder
    const len3 = 3; // Separator |
    const len4 = 30; // Bath name placeholder
    const len5 = 3; // Separator >
    const len6 = 4; // Width of Bath visualization

    for (let bathID = 0; bathID < baths.length; bathID++) {
      // Top line building
      for (var i = 0; i < len1 + len2 + len3 + len4 + len5; i++) {
        this.rendering += whitespace;
      }
      this.rendering += '&#9487;&#9473;&#9473;&#9491;'; // Top bath part
      this.rendering += this.interline;

      // Middle line building
      for (var i = 0; i < len1; i++) {
        this.rendering += whitespace;
      }
      if (typeof baths[bathID].name !== 'undefined') {
        for (var i = 0; i < len4 - baths[bathID].name.length; i++) {
          this.rendering += whitespace;
        }
        this.rendering += baths[bathID].name;
      } else {
        for (var i = 0; i < len4; i++) {
          this.rendering += whitespace;
        }
      }
      if (typeof baths[bathID].name !== 'undefined') {
        this.rendering += ' | ';
      } else {
        for (var i = 0; i < len3; i++) {
          this.rendering += whitespace;
        }
      }
      baths[bathID].number.length == 1
        ? (this.rendering += '0' + baths[bathID].number)
        : (this.rendering += baths[bathID].number);
      this.rendering += ' > ';
      if (baths[bathID].full) {
        this.rendering += '&#9475;&#9608;&#9608;&#9475;';
      } else {
        this.rendering += '&#9475;&nbsp;&nbsp;&#9475;';
      }
      this.rendering += this.interline;

      // Bottom line building
      for (var i = 0; i < len1 + len2 + len3 + len4 + len5; i++) {
        this.rendering += whitespace;
      }
      this.rendering += '&#9495;&#9473&#9473;&#9499;'; // Bottom bath part
      this.rendering += this.interline;
    }

    this.rendering += this.footer;
    return this.rendering;

    /*
    const totLines = baths.length * 3;
    var bathIndex = 0;

    for (let line = 0; line < totLines; line++) {
      if (isBathTitle(line)) {
        if (typeof baths[bathIndex].name !== 'undefined') {
          console.log(baths[bathIndex].name);
          this.rendering += this.bathPlaceholderTop + this.interline;
          this.rendering += this.bathPlaceholderMid.slice(0,20) + baths[bathIndex].name + this.bathPlaceholderMid.slice(baths[bathIndex].name.length * 5 ) + this.interline;
          this.rendering += this.bathPlaceholderBot + this.interline;
        }
        bathIndex++;
      } else {
        this.rendering += this.bathPlaceholderTop + this.interline;
        this.rendering += this.bathPlaceholderMid + this.interline;
        this.rendering += this.bathPlaceholderBot + this.interline;
      }
    }

    this.rendering += this.footer; */
  }
}
