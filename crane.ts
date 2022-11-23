import { Auftrag } from './auftrag';
import { defaultCraneTimes } from './settings';

export enum CraneStatus {
  Waiting,
  Working,
}

export enum CranePhase {
  Moving_startComponent,
  Moving_middleComponent,
  Moving_endComponent,
  Moving_contiguousComponent,
  Drop,
  Pick,
  Drain,
}

export interface CraneTime {
  phaseType: CranePhase;
  workTime: number | undefined;
}

export class Crane {
  public position: number;
  private status: CraneStatus;
  auftrag: Auftrag | undefined;
  remainingTime: number;
  // request_chain:

  public updateTime(sampleTime: number): void {
    switch (this.status) {
      case CraneStatus.Working: {
        this.remainingTime -= sampleTime;
        if (this.remainingTime <= 0) {
          this.status = CraneStatus.Waiting;
        }
      }
      case CraneStatus.Waiting: {
        break;
      }
      default:
        break;
    }
  }

  public getTime(): number | undefined {
    return this.remainingTime;
  }
}
