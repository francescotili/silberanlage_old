import { Drum } from './drum';
import { defaultCraneTimes, standardWorkTimes } from './settings';

export interface BathSettings {
  name?: string;
  is_enabled: boolean;
  type?: BathType;
  priority?: Priority;
  drainTime?: number;
  next?: {
    process: Process[];
    baths: number[];
  }[];
}

export interface WorkTime {
  bathType: BathType;
  time: number | undefined;
}

enum Process {
  Silver,
  Copper,
  Rework,
  PlantFilling,
  PlantEmptying,
}

enum Priority {
  Low,
  Normal,
  High,
}

enum BathStatus {
  Free,
  WaitingEmpty,
  WaitingFull,
  WaitingCrane,
  Working,
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

export class Bath {
  readonly id: number;
  readonly name: string | undefined;
  readonly is_enabled: boolean;
  readonly type: BathType | undefined;
  readonly priority: Priority;
  readonly drainTime: number;

  private status: BathStatus;
  private remainingTime: number | undefined;
  public drum: Drum | undefined;
  public next: {
    process: Process[];
    baths: number[];
  }[];

  //private tempDrainTime: number;

  constructor(number: number, bath: BathSettings) {
    this.id = number;
    typeof bath.name !== 'undefined'
      ? (this.name = bath.name)
      : (this.name = undefined);
    this.is_enabled = bath.is_enabled;
    this.status = BathStatus.Free;
    if (typeof bath.next !== 'undefined') {
      this.next = bath.next;
    }
    if (typeof bath.type !== 'undefined') {
      this.type = bath.type;
    }
    typeof bath.priority !== 'undefined'
      ? (this.priority = bath.priority)
      : (this.priority = Priority.Normal);
    if (typeof bath.drainTime !== 'undefined') {
      this.drainTime = bath.drainTime;
    } else {
      this.drainTime = defaultCraneTimes.drain;
    }
  }

  public updateTime(sampleTime: number): void {
    if (typeof this.remainingTime !== 'undefined') {
      this.remainingTime -= sampleTime;
    } else {
      console.warn(
        `[Bath::updateTime] Update for bath ${this.id} requested, but time is undefined!`
      );
    }
  }

  public getTime(): number | undefined {
    return this.remainingTime;
  }

  private findStdWorkTime(bathType: BathType): number {
    let foundWorkTime: number;
    standardWorkTimes.forEach((workTime) => {
      if (workTime.bathType === bathType) {
        foundWorkTime = workTime.time;
      }
    });
    if (typeof foundWorkTime !== 'undefined') {
      return foundWorkTime;
    } else {
      return 10; // Extra time for unhandled case...
    }
  }

  public setStatus(status: BathStatus, passedDrum?: Drum) {
    console.log(
      `[Bath:setStatus] New status requested for bath ${this.id}: ${BathStatus[status]}`
    );
    this.status = status;
    switch (this.status) {
      case BathStatus.Free: {
        this.remainingTime = undefined;
        this.drum = undefined;
        break;
      }
      case BathStatus.WaitingCrane:
      case BathStatus.WaitingEmpty: {
        if (typeof passedDrum !== 'undefined') {
          // A Drum was dropped from the Crane
          this.drum = passedDrum;
          this.remainingTime = 5; // To give enough time to the crane, to make something else
        } else {
          // No Drum passed, maybe it was assigned at the initialization phase
          if (typeof this.drum !== 'undefined') {
            this.remainingTime = 0;
          } else {
            console.error(
              `[Bath:setStatus] Bath ${this.id}: was set to WaitingEmpy but there is no drum in bath, nor one was passed!`
            );
          }
        }
        break;
      }
      case BathStatus.WaitingFull: {
        this.remainingTime = 0;
        break;
      }
      case BathStatus.Working: {
        if (typeof passedDrum !== 'undefined') {
          // A new drum has been dropped on bath
          if (typeof this.drum === 'undefined') {
            this.drum = passedDrum;
          } else {
            console.error(
              `[Bath:setStatus] Conflict detected on Bath ${this.id}: the Drum ${this.drum.number} is already there and you are trying to drop the Drum ${passedDrum.number}!`
            );
          }
        } else {
          if (typeof this.drum === 'undefined') {
            console.error(
              `[Bath:setStatus] Bath ${this.id} was set to Working but no Drum was passed or is already present!`
            );
          }
        }

        // Set working time
        if (typeof this.drum !== 'undefined') {
          if (typeof this.drum.getAuftrag() !== 'undefined') {
            // Drum is full
            if (
              typeof this.drum.getAuftrag().getWorkTime(this.type) !==
              'undefined'
            ) {
              // This phase has a custom workTime specified in the Auftrag
              this.remainingTime = this.drum
                .getAuftrag()
                .getWorkTime(this.type);
            } else {
              // Load default workTime for this Bath
              this.remainingTime = this.findStdWorkTime(this.type);
            }
          } else {
            // Drum is empty, leave it for 20 second just to make sure the Crane
            // has time to make other operations
            this.remainingTime = 20;
          }
        }
        break;
      }
      default: {
        console.error(
          `[Bath:setStatus] An unhandled bathStatus (${status}) was passed to bath {${this.id}}`
        );
        break;
      }
    }
  }

  public getStatus(): BathStatus {
    return this.status;
  }
}
