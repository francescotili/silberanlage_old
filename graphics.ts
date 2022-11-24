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
  private readonly HTML_Title =
    '<h1>Silberanlage Simulation &middot; 00:00:00</h1>';

  private readonly graphics = {
    eol: '<br>',
    //whitespace: '&middot;',
    whitespace: '&nbsp;',
    bath: {
      label: 'Bad',
      top: '&#9487;&#9473;&#9473;&#9491;',
      middle: {
        full: '&#9475;&#9608;&#9608;&#9475;',
        empty: '&#9475;&nbsp;&nbsp;&#9475;',
        disabled: '&#9475;&#9587;&#9587;&#9475;',
      },
      bottom: '&#9507;&#9473&#9473;&#9515;',
    },
    id: {
      label: 'Nr.',
    },
    separator: ' | ',
    indicator: ' > ',
    crane: {
      label: 'Krane',
      top: '&nbsp;&nbsp;&#9582;',
      middle: {
        full: '&#9608;&#9608;&#9566;',
        empty: '&nbsp;&nbsp;&#9566;',
      },
      bottom: '&nbsp;&nbsp;&#9583;',
    },
    time: {
      label: 'Zeit',
    },
    auftrag: {
      label: 'Auftrag',
    },
  };

  private readonly lenghts = {
    white1: 2, // Initial whitespace
    bathName: 30, // Bath name placeholder
    sep1: 3, // Separator |
    bathID: 2, // Bath ID placeholder
    sep2: 3, // Separator >
    bathVis: 4, // Width of Bath visualization
    white2: 2, // Whitespace
    crane: 3, // Width of crane visualization
    white3: 5, // Whitespace
    time: 8, // Time visualization
    sep3: 3, // Separator
    auftrag: 8, // Auftrag visualization
    sep4: 3, // Separator
  };

  private rendering: string;

  constructor() {
    this.rendering = '';
  }

  updateView(baths: Bath[], crane: Crane): string {
    this.rendering = '';
    this.rendering += this.HTML_Title;
    this.rendering += this.header;

    /* * * * * * *
     * HEADER
     * * * * * * */
    for (
      var i = 0;
      i <
      this.lenghts.bathName -
        this.graphics.bath.label.length +
        this.lenghts.white1;
      i++
    ) {
      this.rendering += this.graphics.whitespace;
    }
    this.rendering += this.graphics.bath.label;
    this.rendering += this.graphics.separator;
    this.rendering += this.graphics.id.label;
    for (
      var i = 0;
      i <
      this.lenghts.sep2 +
        this.lenghts.bathVis +
        this.lenghts.white2 +
        (this.lenghts.bathID - this.graphics.id.label.length);
      i++
    ) {
      this.rendering += this.graphics.whitespace;
    }
    this.rendering += this.graphics.crane.label;
    for (
      var i = 0;
      i <
      this.lenghts.white3 +
        (this.lenghts.crane - this.graphics.crane.label.length);
      i++
    ) {
      this.rendering += this.graphics.whitespace;
    }
    this.rendering += this.graphics.time.label;
    for (
      var i = 0;
      i < this.lenghts.time - this.graphics.time.label.length;
      i++
    ) {
      this.rendering += this.graphics.whitespace;
    }
    this.rendering += this.graphics.auftrag.label;
    for (
      var i = 0;
      i < this.lenghts.auftrag - this.graphics.auftrag.label.length;
      i++
    ) {
      this.rendering += this.graphics.whitespace;
    }
    for (var i = 0; i < this.lenghts.sep4; i++) {
      this.rendering += this.graphics.whitespace;
    }
    // End of line
    this.rendering += this.graphics.eol;

    // FIRST BATH LINE
    for (
      var i = 0;
      i <
      this.lenghts.white1 +
        this.lenghts.bathName +
        this.lenghts.sep1 +
        this.lenghts.bathID +
        this.lenghts.sep2;
      i++
    ) {
      this.rendering += this.graphics.whitespace;
    }
    this.rendering += this.graphics.bath.top;
    // Whitespace
    for (var i = 0; i < this.lenghts.white2; i++) {
      this.rendering += this.graphics.whitespace;
    }
    // Crane
    if (crane.position === 1) {
      this.rendering += this.graphics.crane.top;
      for (var i = 0; i < this.lenghts.white3; i++) {
        this.rendering += this.graphics.whitespace;
      }
    } else {
      for (var i = 0; i < this.lenghts.crane + this.lenghts.white3; i++) {
        this.rendering += this.graphics.whitespace;
      }
    }
    for (var i = 0; i < this.lenghts.time; i++) {
      this.rendering += this.graphics.whitespace;
    }
    // Auftrag
    for (var i = 0; i < this.lenghts.auftrag; i++) {
      this.rendering += this.graphics.whitespace;
    }
    for (var i = 0; i < this.lenghts.sep4; i++) {
      this.rendering += this.graphics.whitespace;
    }
    this.rendering += this.graphics.eol;

    // BATHS
    for (let bathID = 1; bathID < baths.length; bathID++) {
      /* * * * * * *
       * LINE 1/2
       * * * * * * */
      // Whitespace
      for (var i = 0; i < this.lenghts.white1; i++) {
        this.rendering += this.graphics.whitespace;
      }
      // Name of the bath
      if (typeof baths[bathID].name !== 'undefined') {
        for (
          var i = 0;
          i < this.lenghts.bathName - baths[bathID].name.length;
          i++
        ) {
          this.rendering += this.graphics.whitespace;
        }
        this.rendering += baths[bathID].name;
      } else {
        for (var i = 0; i < this.lenghts.bathName; i++) {
          this.rendering += this.graphics.whitespace;
        }
      }
      // Separator
      if (typeof baths[bathID].name !== 'undefined') {
        this.rendering += this.graphics.separator;
      } else {
        for (var i = 0; i < this.lenghts.sep1; i++) {
          this.rendering += this.graphics.whitespace;
        }
      }
      // Bath number
      baths[bathID].id.toString().length == 1
        ? (this.rendering += '0' + baths[bathID].id)
        : (this.rendering += baths[bathID].id);
      // Indicator
      this.rendering += this.graphics.indicator;
      // Bath status
      if (baths[bathID].getStatus() !== BathStatus.Free) {
        this.rendering += this.graphics.bath.middle.full;
      } else if (baths[bathID].is_enabled === false) {
        this.rendering += this.graphics.bath.middle.disabled;
      } else {
        this.rendering += this.graphics.bath.middle.empty;
      }
      // Whitespace
      for (var i = 0; i < this.lenghts.white2; i++) {
        this.rendering += this.graphics.whitespace;
      }
      // Crane
      if (crane.position === bathID) {
        if (crane.getStatus() !== CraneStatus.Waiting) {
          this.rendering += this.graphics.crane.middle.full;
        } else {
          this.rendering += this.graphics.crane.middle.empty;
        }
        for (var i = 0; i < this.lenghts.white3; i++) {
          this.rendering += this.graphics.whitespace;
        }
      } else {
        for (var i = 0; i < this.lenghts.crane + this.lenghts.white3; i++) {
          this.rendering += this.graphics.whitespace;
        }
      }
      // Time
      const timeRemaining = baths[bathID].getTime();
      if (typeof timeRemaining !== 'undefined') {
        this.rendering += timeRemaining;
        for (
          var i = 0;
          i < this.lenghts.time - timeRemaining.toString.length;
          i++
        ) {
          this.rendering += this.graphics.whitespace;
        }
      } else {
        for (var i = 0; i < this.lenghts.time; i++) {
          this.rendering += this.graphics.whitespace;
        }
      }
      // Auftrag
      if (typeof baths[bathID].auftrag !== 'undefined') {
        this.rendering += baths[bathID].auftrag.number.length;
        for (
          var i = 0;
          i < this.lenghts.auftrag - baths[bathID].auftrag.number.length;
          i++
        ) {
          this.rendering += this.graphics.whitespace;
        }
      } else {
        for (var i = 0; i < this.lenghts.auftrag; i++) {
          this.rendering += this.graphics.whitespace;
        }
      }
      for (var i = 0; i < this.lenghts.sep4; i++) {
        this.rendering += this.graphics.whitespace;
      }
      this.rendering += this.graphics.eol;
      /* * * * * * *
       * LINE 2/2
       * * * * * * */
      for (
        var i = 0;
        i <
        this.lenghts.white1 +
          this.lenghts.bathName +
          this.lenghts.sep1 +
          this.lenghts.bathID +
          this.lenghts.sep2;
        i++
      ) {
        this.rendering += this.graphics.whitespace;
      }
      // Bath
      this.rendering += this.graphics.bath.bottom;
      // Whitespace
      for (var i = 0; i < this.lenghts.white2; i++) {
        this.rendering += this.graphics.whitespace;
      }
      // Crane
      if (crane.position === bathID) {
        this.rendering += this.graphics.crane.bottom;
        for (var i = 0; i < this.lenghts.white3; i++) {
          this.rendering += this.graphics.whitespace;
        }
      } else if (crane.position === bathID + 1) {
        this.rendering += this.graphics.crane.top;
        for (var i = 0; i < this.lenghts.white3; i++) {
          this.rendering += this.graphics.whitespace;
        }
      } else {
        for (var i = 0; i < this.lenghts.crane + this.lenghts.white3; i++) {
          this.rendering += this.graphics.whitespace;
        }
      }
      // Time
      for (var i = 0; i < this.lenghts.time; i++) {
        this.rendering += this.graphics.whitespace;
      }
      // Auftrag
      for (var i = 0; i < this.lenghts.auftrag; i++) {
        this.rendering += this.graphics.whitespace;
      }
      for (var i = 0; i < this.lenghts.sep4; i++) {
        this.rendering += this.graphics.whitespace;
      }
      this.rendering += this.graphics.eol;
    }

    this.rendering += this.footer;
    return this.rendering;
  }
}
