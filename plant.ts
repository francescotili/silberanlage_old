import { Auftrag, AuftragSettings } from './auftrag';
import { Bath, BathSettings } from './bath';
import { Crane } from './crane';
import { Drum } from './drum';
import { defaultCraneTimes, drumsInitData } from './settings';

enum Scheduler {
  FCFS,
  FCFSPrio,
}

enum Process {
  Silver,
  Copper,
  Rework,
  PlantFilling,
  PlantEmptying,
}

enum BathStatus {
  Free,
  WaitingEmpty,
  WaitingFull,
  WaitingCrane,
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
  transferDrum: boolean;
  // priority: Priority
}

export class SilberAnlage {
  baths: Bath[];
  crane: Crane;
  auftrags: Auftrag[];
  drums: Drum[];
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
    console.log('[Plant:constructor] Baths created');

    // Initialize Crane
    this.crane = new Crane();
    console.log('[Plant:constructor] Crane initialized');

    // Intialize Drums
    this.drums = [];
    for (var i in drumsInitData) {
      this.drums.push(new Drum(drumsInitData[i].number));
    }
    for (var j in this.drums) {
      let destinationBath: number | undefined;
      destinationBath = this.searchBathForDrum();
      if (typeof destinationBath !== 'undefined') {
        this.assignDrum(this.baths[destinationBath], this.drums[j]);
      }
    }
    console.log('[Plant:constructor] Drum assigned');

    // Load Auftrags
    this.auftrags = [];
    auftragsData.forEach((auftrag) => {
      this.auftrags.push(new Auftrag(auftrag));
    });
    console.log('[Plant:constructor] Aufträge loaded');
  }

  private searchBathForDrum(): number | undefined {
    for (let i = 0; i < this.baths.length; i++) {
      if (
        this.baths[i].type === BathType.LoadingStation &&
        typeof this.baths[i].drum === 'undefined'
      ) {
        return i;
      }
    }
    for (let i = 0; i < this.baths.length; i++) {
      if (
        this.baths[i].type === BathType.Parkplatz &&
        typeof this.baths[i].drum === 'undefined'
      ) {
        return i;
      }
    }
    for (let i = 0; i < this.baths.length; i++) {
      if (
        this.baths[i].type === BathType.RinseFlow &&
        typeof this.baths[i].drum === 'undefined'
      ) {
        return i;
      }
    }
    return undefined;
  }

  private assignDrum(bath: Bath, drum: Drum): void {
    console.log(
      `[Plant:assignDrum] Drum ${drum.number} assigned to Bath ${bath.id}`
    );
    bath.drum = drum;
    bath.setStatus(BathStatus.WaitingEmpty);
  }

  public updateBaths(sampleTime: number) {
    this.baths.forEach((bath) => {
      switch (bath.getStatus()) {
        case BathStatus.Working: {
          bath.updateTime(sampleTime);
          if (bath.getTime() <= 0) {
            // Bath has worked the set time
            bath.setStatus(BathStatus.WaitingFull);

            // Append operation to Crane
            this.appendOperation(bath.id);
          }
          break;
        }
        case BathStatus.WaitingEmpty: {
          if (typeof bath.drum !== 'undefined') {
            switch (bath.type) {
              case BathType.LoadingStation: {
                // The loading station has en empty Drum, load a new Auftrag
                if (this.auftrags.length > 0) {
                  this.auftrags[0].setStatus(AuftragStatus.Loading);
                  bath.drum.loadParts(this.auftrags[0]);
                  bath.setStatus(BathStatus.Working);
                  this.auftrags.splice(0, 1); // Remove auftrag from the waiting list
                }
                break;
              }
              default: {
                // Append operation to Crane, maybe we can move the empty drum and load something
                this.appendOperation(bath.id);
                bath.setStatus(BathStatus.WaitingCrane);
                break;
              }
            }
          } else {
            console.error(
              `[Plant:updateBaths] Bath ${bath.id} error: bath is in WaitingEmpty status but Drum is undefined!`
            );
          }
        }
        case BathStatus.WaitingCrane:
        case BathStatus.WaitingFull:
        case BathStatus.Free:
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

  private transferDrum(): void {
    if (typeof this.baths[this.crane.position].drum !== 'undefined') {
      // Transfer from Bath to Crane
      console.log(
        `[Plant:updateCrane] Drum ${
          this.baths[this.crane.position].drum.number
        } transfer: Bath ${this.crane.position} -> Crane`
      );
      this.crane.drum = this.baths[this.crane.position].drum;
      this.baths[this.crane.position].setStatus(BathStatus.Free);
      this.auftrags.forEach((auftrag) => {
        if (auftrag.number === this.crane.drum.getAuftrag().number) {
          auftrag.setStatus(AuftragStatus.Moving);
        }
      });
    } else if (typeof this.crane.drum !== 'undefined') {
      // Transfer from Crane to Bath
      console.log(
        `[Plant:updateCrane] Drum ${this.crane.drum.number} transfer: Crane -> Bath`
      );
      if (typeof this.crane.drum.getAuftrag() !== 'undefined') {
        // The drum is full
        this.baths[this.crane.position].setStatus(
          BathStatus.Working,
          this.crane.drum
        );
        this.auftrags.forEach((auftrag) => {
          if (
            auftrag.number ===
            this.baths[this.crane.position].drum.getAuftrag().number
          ) {
            auftrag.setStatus(AuftragStatus.Working);
          }
        });
        this.crane.drum = undefined;
      } else {
        // The drum is empty
        this.baths[this.crane.position].setStatus(
          BathStatus.WaitingEmpty,
          this.crane.drum
        );
        this.crane.drum = undefined;
      }
    }
  }

  public updateCrane(sampleTime: number) {
    switch (this.crane.getStatus()) {
      case CraneStatus.Working: {
        this.crane.updateTime(sampleTime);

        if (this.crane.remainingTime <= 0) {
          if (this.crane.phases[0].transferDrum) {
            this.transferDrum();
          }
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
          this.scheduleOperation(Scheduler.FCFS);
        }
        break;
      }
    }
  }

  private scheduleOperation(scheduler: Scheduler): void {
    switch (scheduler) {
      case Scheduler.FCFS: {
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
                transferDrum: false,
              });
            }

            // Time to drain
            if (typeof originBath.drainTime !== 'undefined') {
              phases.push({
                origin: originBath.id,
                phase: CraneWorkingPhase.Draining,
                time: originBath.drainTime,
                transferDrum: true,
              });
            } else {
              phases.push({
                origin: originBath.id,
                phase: CraneWorkingPhase.Draining,
                time: defaultCraneTimes.drain,
                transferDrum: true,
              });
            }

            // Time to pickup
            phases.push({
              origin: originBath.id,
              phase: CraneWorkingPhase.Picking,
              time: defaultCraneTimes.pick,
              transferDrum: false,
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
                transferDrum: false,
              });
            }

            // Time to drop
            phases.push({
              origin: destinationBath.id,
              phase: CraneWorkingPhase.Dropping,
              time: defaultCraneTimes.drop,
              transferDrum: true,
            });

            // Send operation to crane
            console.log(`[Plant:updateCrane] The crane starts a new operation`);
            this.crane.setStatus(CraneStatus.Working, phases);
            this.bathsWaiting.splice(i, 1);
            break;
          }
        }
        break;
      }
      default: {
        console.error(
          `[Plant:scheduleOperation] Unhandled Scheduler specified!`
        );
        break;
      }
    }
  }

  private findDestinationBath(originBath: Bath): Bath | undefined {
    let nextBaths: number[] = [];
    let process: Process;

    // Find the process
    if (typeof originBath.drum !== 'undefined') {
      if (typeof originBath.drum.getAuftrag() !== 'undefined') {
        process = originBath.drum.getAuftrag().process;
      } else {
        // Drum is empty
        process = Process.PlantFilling;
      }
    }

    // Scan all the way we can go from this bath and select only the ones we can do
    // based on the process type
    originBath.next.forEach((way) => {
      way.process.forEach((wayProcess) => {
        if (wayProcess === process) {
          way.baths.forEach((bath) => nextBaths.push(bath));
        }
      });
    });

    // Now found the first bath that´s free and return that
    for (let i = 0; i < nextBaths.length; i++) {
      if (this.baths[nextBaths[i]].getStatus() === BathStatus.Free) {
        return this.baths[nextBaths[i]];
      }
    }
    return undefined;
  }
}
