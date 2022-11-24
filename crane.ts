import { Auftrag } from './auftrag';
import { plantSettings } from './settings';

export interface CraneTime {
  phaseType: CranePhase;
  workTime: number | undefined;
}

export interface CraneOperation {
  originBath: number;
  destinationBath: number;
}

enum CraneStatus {
  Waiting,
  Working,
}

enum CranePhase {
  Moving_startComponent,
  Moving_middleComponent,
  Moving_endComponent,
  Moving_contiguousComponent,
  Drop,
  Pick,
  Drain,
}

export class Crane {
  public position: number;
  private status: CraneStatus;
  auftrag: Auftrag | undefined;
  remainingTime: number | undefined;
  request_chain: CraneOperation[];

  constructor() {
    this.position = plantSettings.craneStartingPosition;
    this.request_chain = [];
    this.status = CraneStatus.Waiting;
  }

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

  public getStatus(): BathStatus {
    return this.status;
  }
}
