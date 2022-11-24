import { Auftrag } from './auftrag';
import { Bath } from './bath';
import { Crane } from './crane';

enum BathStatus {
  Free,
  Waiting,
  Working,
}

export interface BathView {
  name: string;
  number: string;
  full: boolean;
}

export class SilberAnlage {
  baths: Bath[];
  crane: Crane;
  auftrags: Auftrag[];

  /*
   * This function initialize the plant
   * It loads the bath settings and create all the baths as specified,
   * loading them in the memory for the simulation
   */
  constructor(bathsInitData, auftragsData) {
    // Initialize Bäder
    this.baths = [];
    for (var i in bathsInitData) {
      this.baths.push(new Bath(+i, bathsInitData[i]));
    }
    console.log('Bäder inisialisiert');

    // Initialize Crane
    this.crane = new Crane();
    console.log('Crane erstellt');

    // Load Auftrags
    this.auftrags = [];
    for (var i in auftragsData) {
      this.auftrags.push(new Auftrag(auftragsData[i]));
    }
    console.log('Aufträge geladen');
  }

  dataExportVisual(): BathView[] {
    let bathsViews: BathView[] = [];
    this.baths.forEach((bath) => {
      if (bath.id !== 0) {
        // Remove dummy bad 0
        let viewData: BathView = {
          name: bath.name,
          number: bath.id.toString(),
          full: false,
        };
        if (bath.getStatus() !== BathStatus.Free) {
          viewData.full = true;
        }
        bathsViews.push(viewData);
      }
    });
    return bathsViews;
  }
}
