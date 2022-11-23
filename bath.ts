import { Auftrag } from './auftrag';
import { Priority } from './enums';
import { standardWorkTimes } from './settings';

export interface BathSettings {
  name?: string;
  is_enabled: boolean;
  type?: BathType;
  priority?: Priority;
  drainTime?: number;
  pickupTime?: number;
  nextBaths: [number];
}

export enum BathStatus {
  Free,
  Waiting,
  Working,
}

export enum BathType {
  PreTreatment,
  Silver,
  Copper,
  RinseStand,
  RinseFlow,
  Parkplatz,
  LoadingStation,
}

export interface WorkTime {
  bathType: BathType;
  workTime: number | undefined;
}

export class Bath {
  readonly id: number;
  readonly name: string | undefined;
  readonly is_enabled: boolean;
  readonly type: BathType | undefined;
  readonly priority: Priority;

  private status: BathStatus;
  private remainingTime: number | undefined;
  public auftrag: Auftrag;
  public nextBaths: [number];

  constructor(number: number, bath: BathSettings) {
    this.id = number;
    typeof bath.name !== 'undefined'
      ? (this.name = bath.name)
      : (this.name = undefined);
    this.is_enabled = bath.is_enabled;
    this.status = BathStatus.Free;
    this.nextBaths = bath.nextBaths;
    typeof bath.priority !== 'undefined'
      ? (this.priority = bath.priority)
      : (this.priority = Priority.Normal);
  }

  public updateTime(sampleTime: number): void {
    switch (this.status) {
      case BathStatus.Working: {
        if (typeof this.remainingTime !== 'undefined') {
          this.remainingTime -= sampleTime;
          if (this.remainingTime <= 0) {
            this.setStatus(BathStatus.Waiting);
          }
        }
        break;
      }
      case BathStatus.Free:
      case BathStatus.Working: {
        break;
      }
      default: {
        break;
      }
    }
  }

  public getTime(): number | undefined {
    return this.remainingTime;
  }

  public setStatus(status: BathStatus, auftrag?: Auftrag) {
    this.status = status;
    switch (this.status) {
      case BathStatus.Free: {
        this.remainingTime = undefined;
        this.auftrag = undefined;
        break;
      }
      case BathStatus.Waiting: {
        this.remainingTime = 0;
        break;
      }
      case BathStatus.Working: {
        if (typeof auftrag !== 'undefined') {
          this.auftrag = auftrag;
          this.remainingTime = this.getWorkTime(auftrag.workTimes);
        } else {
          console.error(
            'Fehler in Bad ' + this.id + ': kein Auftrag vorhanden!'
          );
        }
        break;
      }
      default: {
        break;
      }
    }
  }

  public getStatus(): BathStatus {
    return this.status;
  }

  private getWorkTime(auftragWorkTimes: WorkTime[]): number | undefined {
    auftragWorkTimes.forEach((bath) => {
      if (bath.bathType === this.type) {
        if (typeof bath.workTime !== 'undefined') {
          return bath.workTime;
        } else {
          standardWorkTimes.forEach((stdBath) => {
            if (stdBath.bathType === this.type) {
              return stdBath.workTime;
            } else {
              console.error(
                'Fehler in Bad ' + this.id + ': kein Laufzeit vorhanden!'
              );
              return undefined;
            }
          });
        }
      } else {
        console.error(
          'Fehler in Bad ' + this.id + ': kein Laufzeit vorhanden!'
        );
        return undefined;
      }
    });
    console.error('Fehler in Bad ' + this.id + ': kein Laufzeit vorhanden!');
    return undefined;
  }
}
