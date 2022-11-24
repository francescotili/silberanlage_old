import { Bath } from './bath';
import { Crane } from './crane';

enum BathStatus {
  Free,
  Waiting,
  Working,
}

enum CraneStatus {
  Waiting,
  Working,
}

export class GraphicMotor {
  private readonly header = `<code>`;
  private readonly footer = `</code>`;
  private readonly HTML_Title = '<h1>Silberanlage Simulation</h1>';

  private readonly graphics = {
    eol: "<br>",
    whitespace: '&nbsp;',
    bath: {
      top: "&#9487;&#9473;&#9473;&#9491;",
      middle: {
        full: "&#9475;&#9608;&#9608;&#9475;",
        empty: "&#9475;&nbsp;&nbsp;&#9475;"
      },
      bottom: "&#9495;&#9473&#9473;&#9499;"
    },
    separator: " | ",
    indicator: " > ",
    crane: {
      top: "&nbsp;&nbsp;&#9582;",
      middle: {
        full: "&#9608;&#9608;&#9566;",
        empty: "&nbsp;&nbsp;&#9566;"
      },
      bottom: "&nbsp;&nbsp;&#9583;"
    }
  }

  private rendering: string;

  constructor() {
    this.rendering = '';
  }

  updateView(baths: Bath[], crane: Crane): string {
    this.rendering = '';
    this.rendering += this.HTML_Title;
    this.rendering += this.header;

    // Characters for every string
    const len1 = 2; // Initial whitespace
    const len2 = 2; // Bath ID placeholder
    const len3 = 3; // Separator |
    const len4 = 30; // Bath name placeholder
    const len5 = 3; // Separator >
    const len6 = 3; // Width of Bath visualization
    const len7 = 3; // Width of crane visualization
    const len8 = 5; // Whitespace

    // ---------
    this.rendering += 'Crane example';
    this.rendering += this.graphics.eol;
    this.rendering += this.graphics.crane.top;
    this.rendering += this.graphics.eol;
    this.rendering += this.graphics.crane.middle.empty;
    this.rendering += this.graphics.eol;
    this.rendering += this.graphics.crane.bottom;
    this.rendering += this.graphics.eol;
    // ---------

    for (let bathID = 0; bathID < baths.length; bathID++) {
      /* * * * * * *
       * LINE 1/3
       * * * * * * */
      // Whitespace
      for (var i = 0; i < len1 + len2 + len3 + len4 + len5; i++) {
        this.rendering += this.graphics.whitespace;
      }
      // Bath
      this.rendering += this.graphics.bath.top;
      // Whitespace
      for (var i = 0; i < len6; i++) {
        this.rendering +=  this.graphics.whitespace;
      }
      // Crane
      if (crane.position === bathID ) {
        this.rendering += this.graphics.crane.top;
        for (var i = 0; i < len8; i++) {
          this.rendering +=  this.graphics.whitespace;
        }
      } else {
        for (var i = 0; i < len7+len8; i++) {
          this.rendering +=  this.graphics.whitespace;
        }

      }
      // End of line
      this.rendering += this.graphics.eol;

      /* * * * * * *
       * LINE 2/3
       * * * * * * */
      // Whitespace
      for (var i = 0; i < len1; i++) {
        this.rendering +=  this.graphics.whitespace;
      }
      // Name of the bath
      if (typeof baths[bathID].name !== 'undefined') {
        for (var i = 0; i < len4 - baths[bathID].name.length; i++) {
          this.rendering +=  this.graphics.whitespace;
        }
        this.rendering += baths[bathID].name;
      } else {
        for (var i = 0; i < len4; i++) {
          this.rendering +=  this.graphics.whitespace;
        }
      }
      // Separator
      if (typeof baths[bathID].name !== 'undefined') {
        this.rendering += this.graphics.separator;
      } else {
        for (var i = 0; i < len3; i++) {
          this.rendering +=  this.graphics.whitespace;
        }
      }
      // Bath number
      baths[bathID].id.toString().length == 1
        ? (this.rendering += '0' + baths[bathID].id)
        : (this.rendering += baths[bathID].id);
      // Indicator
      this.rendering += this.graphics.indicator;
      // Bath status
      if (baths[bathID].getStatus() !== BathStatus.Free ) {
        this.rendering += this.graphics.bath.middle.full;
      } else {
        this.rendering += this.graphics.bath.middle.empty;
      }
      // Whitespace
      for (var i = 0; i < len6; i++) {
        this.rendering +=  this.graphics.whitespace;
      }
      // Crane
      if (crane.position === bathID ) {
        if ( crane.getStatus() !== CraneStatus.Waiting ) {
          this.rendering += this.graphics.crane.middle.full
        } else {
          this.rendering += this.graphics.crane.middle.empty
        }
      }
      // End of line
      this.rendering += this.graphics.eol;

      /* * * * * * *
       * LINE 3/3
       * * * * * * */
      // Whitespace
      for (var i = 0; i < len1 + len2 + len3 + len4 + len5; i++) {
        this.rendering +=  this.graphics.whitespace;
      }
      // Bath
      this.rendering += this.graphics.bath.bottom;
      // Whitespace
      for (var i = 0; i < len6; i++) {
        this.rendering +=  this.graphics.whitespace;
      }
      // Crane
      if (crane.position === bathID ) {
        this.rendering += this.graphics.crane.bottom;
      }
      // End of line
      this.rendering += this.graphics.eol;
    }

    this.rendering += this.footer;
    return this.rendering;
  }
}
