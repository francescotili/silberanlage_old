import { Auftrag } from './auftrag';
import { plantSettings, defaultCraneTimes } from './settings';

export interface CraneOperation {
  originBath: number;
  destinationBath: number;
  // priority: Priority
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
  operationTime: number | undefined;
  private request_chain: CraneOperation[];

  constructor() {
    this.position = plantSettings.craneStartingPosition;
    this.request_chain = [];
    this.status = CraneStatus.Waiting;
  }

  public appendOperation(operation: CraneOperation) {
    // FIFO Logic - TODO: manage Priority
    this.request_chain.push(operation);
  }

  public updateTime(sampleTime: number): void {
    switch (this.status) {
      case CraneStatus.Working: {
        this.remainingTime -= sampleTime;

        if (this.remainingTime <= 0) {
          this.setStatus(CraneStatus.Waiting);
        } else {
          // Update crane position - TODO
        }

        /*switch (this.phase) {
          case CraneWorkingPhase.Picking:
          case CraneWorkingPhase.Draining:
          case CraneWorkingPhase.Moving:
          case CraneWorkingPhase.Dropping:
          default: {
            console.error(
              'Der Zusammenhang zwischen dem Status und der Phase des Krans ist nicht korreky'
            );
            break;
          }
        } */
      }
      case CraneStatus.Waiting: {
        if (this.request_chain.length > 0) {
          this.setStatus(CraneStatus.Working);
        }
        break;
      }
      default:
        console.error('Der Kran befindet sich in einem unerwarteter Status');
        break;
    }
  }

  public setStatus(status: CraneStatus): void {
    this.status = status;
    switch (this.status) {
      case CraneStatus.Waiting: {
        this.remainingTime = 0;
        break;
      }
      case CraneStatus.Working: {
        // FIFO
        this.startOperation(this.request_chain[0]);
      }
      default: {
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

  private startOperation(operation: CraneOperation): void {
    // Calculate total time
    let totalTime = 0;

    // Time to move from current position to origin position
    totalTime += calculateMovingTime(this.position - operation.originBath);

    // Time to pickup & drain
    // TODO: respect drainTime from the bath
    totalTime += defaultCraneTimes.drain + defaultCraneTimes.pick;

    // Time to move from origin to destination position
    totalTime += calculateMovingTime(
      operation.originBath - operation.destinationBath
    );

    // Time to drop
    totalTime += defaultCraneTimes.drop;

    function calculateMovingTime(distance: number): number {
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
}
