import { Auftrag, AuftragSettings } from './auftrag';
import { Bath, BathSettings } from './bath';
import { Crane } from './crane';
import { defaultCraneTimes } from './settings';

enum BathStatus {
  Free,
  Waiting,
  Working,
}

enum CraneStatus {
  Waiting,
  Working,
}

enum AuftragStatus {
  Queue,
  Loading,
  Moving,
  Working,
  Waiting,
  Unloading,
  Completed,
}

enum BathType {
  PreTreatment,
  Silver,
  Copper,
  RinseStand,
  RinseFlow,
  Parkplatz,
  LoadingStation,
}

export enum CraneWorkingPhase {
  Moving,
  Dropping,
  Picking,
  Draining,
}

export interface CraneOperation {
  origin: number;
  destination?: number;
  time: number;
  phase: CraneWorkingPhase;
  transferAuftrag: boolean;
  // priority: Priority
}

export class SilberAnlage {
  baths: Bath[];
  crane: Crane;
  auftrags: Auftrag[];
  private bathsWaiting: number[];

  /*
   * This function initialize the plant
   * It loads the bath settings and create all the baths as specified,
   * loading them in the memory for the simulation
   */
  constructor(bathsInitData: BathSettings[], auftragsData: AuftragSettings[]) {
    // Initialize baths
    this.baths = [];
    for (var i in bathsInitData) {
      this.baths.push(new Bath(+i, bathsInitData[i]));
    }
    this.bathsWaiting = [];
    console.log('Bäder inisialisiert');

    // Initialize Crane
    this.crane = new Crane();
    console.log('Crane erstellt');

    // Load Auftrags
    this.auftrags = [];
    auftragsData.forEach((auftrag) => {
      this.auftrags.push(new Auftrag(auftrag));
    });
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
            this.appendOperation(bath.id);
          }
          break;
        }
        case BathStatus.Free: {
          if (bath.type === BathType.LoadingStation) {
            this.auftrags[0].setStatus(AuftragStatus.Loading);
            bath.setStatus(BathStatus.Working, this.auftrags[0]);
          }
        }
        case BathStatus.Waiting:
        default: {
          break;
        }
      }
    });
  }

  private appendOperation(bathId: number) {
    this.bathsWaiting.push(bathId);
  }

  public updateCrane(sampleTime: number) {
    switch (this.crane.getStatus()) {
      case CraneStatus.Working: {
        this.crane.updateTime(sampleTime);

        if (this.crane.remainingTime <= 0) {
          switch (this.crane.phases.length) {
            case 0: {
              console.error(
                "Krane ist in 'Working' zustand, aber Phases ist undefined"
              );
              break;
            }
            case 1: {
              // Last phase ended
              // Transfer auftrag as needed
              if (this.crane.phases[0].transferAuftrag) {
                if (
                  typeof this.baths[this.crane.position].auftrag !== 'undefined'
                ) {
                  this.crane.auftrag = this.baths[this.crane.position].auftrag;
                  this.baths[this.crane.position].auftrag = undefined;
                } else if (typeof this.crane.auftrag !== 'undefined') {
                  this.baths[this.crane.position].auftrag = this.crane.auftrag;
                  this.crane.auftrag = undefined;
                }
              }
              this.crane.phases.splice(0, 1); // Remove current elapsed operation
              this.crane.remainingTime = 0;
              this.crane.setStatus(CraneStatus.Waiting);
            }
            default: {
              // More than 1 cranephase
              if (this.crane.phases[0].transferAuftrag) {
                this.baths[this.crane.position].auftrag = this.crane.auftrag;
                this.crane.auftrag = undefined;
              }
              this.crane.phases.splice(0, 1); // Remove current elapsed operation
              this.crane.remainingTime = this.crane.phases[0].time;
            }
          }
        }
        break;
      }
      case CraneStatus.Waiting: {
        if (this.bathsWaiting.length > 0) {
          // FIFO Logic
          // Find a free destination bath
          let originBath: Bath;
          let destinationBath: Bath;
          for (let i = 0; i < this.bathsWaiting.length; i++) {
            // Determine origin and destination bath
            originBath = this.baths[this.bathsWaiting[i]];
            destinationBath = this.findDestinationBath(originBath);
            if (typeof destinationBath !== 'undefined') {
              // Found a destination bath that is free
              this.crane.setStatus(CraneStatus.Working);

              // Initialize operation's phases data
              let phases: CraneOperation[] = [];

              // Time to move from current crane position to origin position
              let tempTime = this.crane.calculateMovingTime(
                this.crane.position - originBath.id
              );
              if (tempTime > 0) {
                phases.push({
                  origin: this.crane.position,
                  destination: originBath.id,
                  phase: CraneWorkingPhase.Moving,
                  time: tempTime,
                  transferAuftrag: false,
                });
              }

              // Time to drain
              if (typeof originBath.drainTime !== 'undefined') {
                phases.push({
                  origin: originBath.id,
                  phase: CraneWorkingPhase.Draining,
                  time: originBath.drainTime,
                  transferAuftrag: true,
                });
              } else {
                phases.push({
                  origin: originBath.id,
                  phase: CraneWorkingPhase.Draining,
                  time: defaultCraneTimes.drain,
                  transferAuftrag: true,
                });
              }

              // Time to pickup
              phases.push({
                origin: originBath.id,
                phase: CraneWorkingPhase.Picking,
                time: defaultCraneTimes.pick,
                transferAuftrag: false,
              });

              // Time to move from origin to destination position
              tempTime = this.crane.calculateMovingTime(
                originBath.id - destinationBath.id
              );
              if (tempTime > 0) {
                phases.push({
                  origin: originBath.id,
                  destination: destinationBath.id,
                  phase: CraneWorkingPhase.Moving,
                  time: tempTime,
                  transferAuftrag: false,
                });
              }

              // Time to drop
              phases.push({
                origin: destinationBath.id,
                phase: CraneWorkingPhase.Dropping,
                time: defaultCraneTimes.drop,
                transferAuftrag: true,
              });

              // Send operation to crane
              this.crane.setStatus(CraneStatus.Working, phases);
              break; // Break loop
            }
          }
        }
        break;
      }
    }
  }

  private findDestinationBath(bath: Bath): Bath | undefined {
    bath.nextBaths.forEach((nextBath) => {
      if (this.baths[nextBath].getStatus() === BathStatus.Free) {
        return nextBath;
      }
    });
    return undefined;
  }
}
