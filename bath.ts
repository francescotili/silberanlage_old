import { Drum } from './drum';
import { defaultCraneTimes } from './settings';

export interface BathSettings {
  name?: string;
  is_enabled: boolean;
  type?: BathType;
  priority?: Priority;
  drainTime?: number;
  nextBaths?: number[];
}

export interface WorkTime {
  bathType: BathType;
  time: number | undefined;
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
  public nextBaths: number[];

  //private tempDrainTime: number;

  constructor(number: number, bath: BathSettings) {
    this.id = number;
    typeof bath.name !== 'undefined'
      ? (this.name = bath.name)
      : (this.name = undefined);
    this.is_enabled = bath.is_enabled;
    this.status = BathStatus.Free;
    this.nextBaths = bath.nextBaths;
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

  public setStatus(status: BathStatus, drum?: Drum) {
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
      case BathStatus.WaitingEmpty:
      case BathStatus.WaitingFull: {
        this.remainingTime = 0;
        break;
      }
      case BathStatus.Working: {
        if (typeof drum !== 'undefined') {
          this.drum = drum;
          this.remainingTime = drum.getAuftrag().getWorkTime(this.type);
        } else {
          this.remainingTime = this.drum.getAuftrag().getWorkTime(this.type);
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
