import { Auftrag } from './auftrag';
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

  public updateBaths(sampleTime: number) {
    this.baths.forEach((bath) => {
      switch (bath.getStatus()) {
        case BathStatus.Working: {
          bath.updateTime(sampleTime);

          if (bath.getTime() <= 0) {
            // Bath has worked the set time
            bath.setStatus(BathStatus.Waiting);

            // Append operation to Crane
          }
          break;
        }
        case BathStatus.Free:
        case BathStatus.Waiting: {
          break;
        }
      }
    });
  }

  public updateCrane(sampleTime: number) {
    switch (this.crane.getStatus()) {
      case CraneStatus.Working: {
        this.crane.updateTime(sampleTime);
        /* countdown crane.remainingTime
           if crane.remainingTime still > 0
           > update currentPosition (TO BE STUDIED)
           else
           > set current Bath to "Working"
             set bath.remainingTime
             set crane to "Waiting"
             transfer Auftrag from Crane to Bath
             set crane.remainingTime = 0 */
        break;
      }
      case CraneStatus.Waiting: {
        /* read operation list
           filter out impossible operations (destination bath not free)
           if we have = 0 operation left
           > do nothing
           if we have = 1 operation left
           > calculate needed time per the operation based on:
             > currentPos, pickupPos, pickupTimes, dropPos, dropTimes
             do the operation
             > set crane.remainingTime
               set crane to "Working"
           if we have > 1 but <= 3 operations left (TO BE BETTER IMPLEMENTED)
           > calculate every order-combination and corresponding times to execute all
             choose the order to follow based on the shorter time
             start doing the first operation of the order
             > set crane.remainingTime
               set crane to "Working" */
      }
    }
  }
}
