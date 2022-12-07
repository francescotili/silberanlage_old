import { Auftrag } from './auftrag';
import { plantSettings, defaultCraneTimes } from './settings';

enum CraneStatus {
  Waiting,
  Working,
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

export class Crane {
  public position: number;
  private status: CraneStatus;
  auftrag: Auftrag | undefined;
  remainingTime: number | undefined;
  phases: CraneOperation[];

  constructor() {
    this.position = plantSettings.craneStartingPosition;
    this.status = CraneStatus.Waiting;
    this.phases = [];
  }

  public updateTime(sampleTime: number): void {
    this.remainingTime -= sampleTime;
    this.updatePosition();
  }

  private updatePosition(): void {
    switch (this.getPhase()) {
      case CraneWorkingPhase.Draining:
      case CraneWorkingPhase.Picking:
      case CraneWorkingPhase.Dropping: {
        this.position = this.phases[0].origin;
        break;
      }
      case CraneWorkingPhase.Moving: {
        this.position = Math.round(
          (this.phases[0].time - this.remainingTime) /
            (this.phases[0].time /
              (this.phases[0].destination - this.phases[0].origin)) +
            this.phases[0].origin
        );
        break;
      }
      case undefined: {
        console.warn(
          `[Crane:updatePosition] Was called but Crane status is undefined`
        );
        break;
      }
      default: {
        console.warn(
          `[Crane:updatePosition] Was called, but the Crane is in an unhandled phase: ${this.getPhase()}`
        );
        break;
      }
    }
  }

  public getPhase(): CraneWorkingPhase | undefined {
    if (this.phases.length > 0) {
      return this.phases[0].phase;
    } else {
      console.log(`[Crane:getPhase] The crane phase is undefined`);
      return undefined;
    }
  }

  public setStatus(status: CraneStatus, phases?: CraneOperation[]): void {
    console.log(
      `[Crane:setStatus] New status requested for the crane: ${CraneStatus[status]}`
    );
    this.status = status;
    switch (this.status) {
      case CraneStatus.Waiting: {
        this.remainingTime = 0;
        break;
      }
      case CraneStatus.Working: {
        if (typeof phases !== 'undefined') {
          this.phases = phases;
          this.remainingTime = 0;
          this.phases.forEach((phase) => {
            this.remainingTime += phase.time;
          });
        } else {
          console.error(
            `[Crane:setStatus] The crane was set to "Working" but no Operation was passed!`
          );
        }
        break;
      }
      default: {
        console.error(
          `[Crane:setStatus] An unhandled craneStatus (${status}) was passed to the crane`
        );
        break;
      }
    }
  }

  public getTime(): number | undefined {
    return this.remainingTime;
  }

  public getStatus(): CraneStatus {
    return this.status;
  }

  public calculateMovingTime(distance: number): number {
    switch (Math.abs(distance)) {
      case 0: {
        // Already in position
        return 0;
      }
      case 1: {
        // Adiacent bath
        return defaultCraneTimes.moving.contiguous;
      }
      case 2: {
        return defaultCraneTimes.moving.start + defaultCraneTimes.moving.end;
      }
      default: {
        return (
          defaultCraneTimes.moving.start +
          defaultCraneTimes.moving.middle * (Math.abs(distance) - 2) +
          defaultCraneTimes.moving.end
        );
      }
    }
  }
}
