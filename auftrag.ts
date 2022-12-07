import { standardWorkTimes } from './settings';

enum Process {
  SilverElectroplating,
  Subcoppering,
  Rework,
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

interface WorkTime {
  bathType: BathType;
  time: number;
}

export interface AuftragSettings {
  number: string;
  material: string;
  process: Process;
  silverAmount: number; // Ag Bedarf in g/1000 Stück
  copperAmount?: number; // Cu Bedarf in g/1000 Stück
  quantity: number; // Stückzahl
  workTimeOverride?: WorkTime[];
}

export class Auftrag {
  readonly number: string;
  readonly material: string;
  readonly process: Process;
  readonly silverAmount: number; // Ag Bedarf in g/1000 Stück
  readonly copperAmount: number; // Cu Bedarf in g/1000 Stück
  readonly quantity: number; // Stückzahl
  readonly workTimeOverride: WorkTime[];
  private status: AuftragStatus;

  constructor(auftrag: AuftragSettings) {
    this.number = auftrag.number;
    this.material = auftrag.material;
    this.process = auftrag.process;
    this.status = AuftragStatus.Queue;
    this.silverAmount = auftrag.silverAmount;
    if (typeof auftrag.copperAmount !== 'undefined') {
      this.copperAmount = auftrag.copperAmount;
    }
    this.quantity = auftrag.quantity;
    if (typeof auftrag.workTimeOverride !== 'undefined') {
      this.workTimeOverride = auftrag.workTimeOverride;
    }
  }

  public getWorkTime(bathType: BathType | undefined): number {
    if (typeof bathType !== 'undefined') {
      switch (bathType) {
        case BathType.Copper: {
          // TODO
          console.warn(
            '[Auftrag:getWorkTime] Calculation of copper working time not implemented'
          );
          return 0;
        }
        case BathType.Silver: {
          return ((this.silverAmount * (this.quantity / 1000)) / 6.7) * 60;
        }
        case BathType.PreTreatment:
        case BathType.RinseFlow:
        case BathType.RinseStand: {
          if (typeof this.workTimeOverride !== 'undefined') {
            this.workTimeOverride.forEach((workTime) => {
              if (workTime.bathType === bathType) {
                return workTime.time;
              } else {
                standardWorkTimes.forEach((stdWorkTime) => {
                  if (stdWorkTime.bathType === bathType) {
                    return stdWorkTime.time;
                  } else {
                    return 0;
                  }
                });
              }
            });
          } else {
            standardWorkTimes.forEach((stdWorkTime) => {
              if (stdWorkTime.bathType === bathType) {
                return stdWorkTime.time;
              } else {
                return 0;
              }
            });
          }
        }
        case BathType.LoadingStation: {
          return 60;
        }
        case BathType.Parkplatz:
        default: {
          console.warn(
            '[Auftrag:getWorkTime] Function called with an unhandled bathType'
          );
          return 604800; // Infinite time (1 week)
        }
      }
    } else {
      console.warn(
        '[Auftrag:getWorkTime] Function called with an undefined bathType'
      );
      return 0;
    }
  }

  public setStatus(status: AuftragStatus): void {
    console.log(
      `[Auftrag:setStatus] New status for Auftrag ${this.number}: ${AuftragStatus[status]}`
    );
    this.status = status;
  }

  public getStatus(): AuftragStatus {
    console.log(
      `[Auftrag:setStatus] Auftrag ${this.number} has status: ${this.status}`
    );
    return this.status;
  }
}
