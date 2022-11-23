import { Bath } from './bath';
import { Crane } from './crane';

export class SilberAnlage {
  baths: Bath[] = [];
  crane: Crane;

  /*
   * This function initialize the plant
   * It loads the bath settings and create all the baths as specified,
   * loading them in the memory for the simulation
   */
  constructor(bathsInitData, auftragsData) {
    // Initialize Bäder
    for (var i in bathsInitData) {
      this.baths.push(new Bath(i, bathsInitData[i]));
    }
    console.log('Bäder inisialisiert');

    // Initialize Crane
    this.crane = new Crane();
    console.log('Crane erstellt');
  }
}
