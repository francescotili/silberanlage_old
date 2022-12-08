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
    console.log(`[Plant:appendOperation] Bath ${bathId} has called the crane`);
  }

  private transferAuftrag(): void {
    if (typeof this.baths[this.crane.position].auftrag !== 'undefined') {
      console.log(
        `[Plant:updateCrane] Auftrag ${
          this.baths[this.crane.position].auftrag.number
        } transfer: Bath ${this.crane.position} -> Crane`
      );
      this.crane.auftrag = this.baths[this.crane.position].auftrag;
      this.baths[this.crane.position].setStatus(BathStatus.Free);
      this.auftrags.forEach((auftrag) => {
        if (auftrag.number === this.crane.auftrag.number) {
          auftrag.setStatus(AuftragStatus.Moving);
        }
      });
    } else if (typeof this.crane.auftrag !== 'undefined') {
      console.log(
        `[Plant:updateCrane] Auftrag ${this.crane.auftrag.number} transfer: Crane -> Bath`
      );
      this.baths[this.crane.position].setStatus(
        BathStatus.Working,
        this.crane.auftrag
      );
      this.auftrags.forEach((auftrag) => {
        if (auftrag.number === this.baths[this.crane.position].auftrag.number) {
          auftrag.setStatus(AuftragStatus.Working);
        }
      });
      this.crane.auftrag = undefined;
    }
  }

  public updateCrane(sampleTime: number) {
    switch (this.crane.getStatus()) {
      case CraneStatus.Working: {
        this.crane.updateTime(sampleTime);

        if (this.crane.remainingTime <= 0) {
          this.transferAuftrag();
          if (typeof this.crane.currentPhase !== 'undefined') {
            // Crane already in an operation, move to next phase
            this.crane.nextPhase();
          } else {
            // Do nothing, at the next cycle the Cran will be in the Waiting status
          }
        }
        break;
      }
      case CraneStatus.Waiting: {
        if (this.bathsWaiting.length > 0) {
          console.log(`[Plant:updateCrane] The crane starts a new operation`);
          // FIFS First In First Served Logic
          // Find a free destination bath
          let originBath: Bath;
          let destinationBath: Bath;
          for (let i = 0; i < this.bathsWaiting.length; i++) {
            // Determine origin and destination bath
            originBath = this.baths[this.bathsWaiting[i]];
            destinationBath = this.findDestinationBath(originBath);
            if (typeof destinationBath !== 'undefined') {
              // Found a destination bath that is free
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
    for (let i = 0; i < bath.nextBaths.length; i++) {
      if (this.baths[bath.nextBaths[i]].getStatus() === BathStatus.Free) {
        return this.baths[bath.nextBaths[i]];
      }
    }
    return undefined;
  }
}
