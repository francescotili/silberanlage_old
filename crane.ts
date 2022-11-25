import { Auftrag } from './auftrag';
import { plantSettings } from './settings';

export interface CraneOperation {
  originBath: number;
  destinationBath: number;
}

enum CraneStatus {
  Waiting,
  Working,
}

enum CraneWorkingPhase {
  Moving,
  Dropping,
  Picking,
  Draining,
  Waiting,
}

export class Crane {
  public position: number;
  private status: CraneStatus;
  private phase: CraneWorkingPhase;
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
        switch (this.phase) {
          case CraneWorkingPhase.Picking:
          case CraneWorkingPhase.Draining:
          case CraneWorkingPhase.Moving:
          case CraneWorkingPhase.Dropping:
          default: {
            console.error("Der Zusammenhang zwischen dem Status und der Phase des Krans ist nicht korrekt")
            break;
          }
        }
      }
      case CraneStatus.Waiting: {
        break;
      }
      default:
        console.error("Der Kran befindet sich in einem unerwarteter Status")
        break;
    }
  }

  public getTime(): number | undefined {
    return this.remainingTime;
  }

  public getStatus(): CraneStatus {
    return this.status;
  }
}
