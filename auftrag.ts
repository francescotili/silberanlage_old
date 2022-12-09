import { standardWorkTimes } from './settings';

enum Process {
  Silver,
  Copper,
  Rework,
  PlantFilling,
  PlantEmptying,
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

  public getWorkTime(bathType: BathType | undefined): number | undefined {
    if (typeof bathType !== 'undefined') {
      switch (bathType) {
        case BathType.Copper: {
          // TODO
          console.warn(
            '[Auftrag:getWorkTime] Calculation of copper working time not implemented'
          );
          return undefined;
        }
        case BathType.Silver: {
          return ((this.silverAmount * (this.quantity / 1000)) / 6.7) * 60;
        }
        case BathType.PreTreatment:
        case BathType.RinseFlow:
        case BathType.RinseStand:
        case BathType.LoadingStation:
          {
            if (typeof this.workTimeOverride !== 'undefined') {
              this.workTimeOverride.forEach((workTime) => {
                if (workTime.bathType === bathType) {
                  return workTime.time;
                } else {
                  return undefined;
                }
              });
            } else {
              return undefined;
            }
          }
          {
            return 60;
          }
        case BathType.Parkplatz:
        default: {
          console.warn(
            '[Auftrag:getWorkTime] Function called with an unhandled bathType'
          );
          return undefined;
        }
      }
    } else {
      console.warn(
        '[Auftrag:getWorkTime] Function called with an undefined bathType'
      );
      return undefined;
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
