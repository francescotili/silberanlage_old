import { Bath } from './bath';
import { Crane } from './crane';

enum BathStatus {
  Free,
  Waiting,
  Working,
}

export class GraphicMotor {
  private readonly header = `<code>`;
  private readonly interline = `<br>`;
  private readonly footer = `</code>`;
  private readonly HTML_Title = '<h1>Silberanlage Simulation</h1>';

  private rendering: string;

  constructor() {
    this.rendering = '';
  }

  updateView(baths: Bath[]): string {
    this.rendering = '';
    this.rendering += this.HTML_Title;
    this.rendering += this.header;

    const whitespace = '&nbsp;';

    // Characters for every string
    const len1 = 2;
    const len2 = 2; // Bath ID placeholder
    const len3 = 3; // Separator |
    const len4 = 30; // Bath name placeholder
    const len5 = 3; // Separator >
    const len6 = 4; // Width of Bath visualization

    // ---------
    this.rendering += 'Crane example';
    this.rendering += this.interline;
    this.rendering += '&nbsp;&nbsp;&#9582;';
    this.rendering += this.interline;
    this.rendering += '&#9608;&#9608;&#9566;';
    this.rendering += this.interline;
    this.rendering += '&nbsp;&nbsp;&#9583;';
    this.rendering += this.interline;
    // ---------

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
      // Name of the bath
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
      // Separator
      if (typeof baths[bathID].name !== 'undefined') {
        this.rendering += ' | ';
      } else {
        for (var i = 0; i < len3; i++) {
          this.rendering += whitespace;
        }
      }
      // Bath number
      baths[bathID].id.toString().length == 1
        ? (this.rendering += '0' + baths[bathID].id)
        : (this.rendering += baths[bathID].id);
      // Indicator
      this.rendering += ' > ';
      // Bath status
      if (baths[bathID].getStatus() !== BathStatus.Free ) {
        this.rendering += '&#9475;&#9608;&#9608;&#9475;';
      } else {
        this.rendering += '&#9475;&nbsp;&nbsp;&#9475;';
      }
      // EOL
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
  }
}
