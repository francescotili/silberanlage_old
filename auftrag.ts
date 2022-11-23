import { WorkTime } from './bath';
// import { ProcessType } from "./enums"

export interface AuftragSettings {
  number: string;
  material: string;
  workTimes: WorkTime[];
  // priority: Priority
}

export enum AuftragStatus {
  Queue,
  Loading,
  Moving,
  Working,
  Waiting,
  Unloading,
  Completed,
}

export class Auftrag {
  readonly number: string;
  readonly material: string;
  readonly workTimes: WorkTime[];
  // process: ProcessType;
  public status: AuftragStatus;

  constructor(auftrag: AuftragSettings) {
    this.number = auftrag.number;
    this.material = auftrag.material;
    this.workTimes = auftrag.workTimes; // TODO: make a sistem to calculate Silver and Copper workTime
    this.status = AuftragStatus.Queue;
  }
}
