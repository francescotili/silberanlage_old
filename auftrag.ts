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
  workTime: number;
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
  }

  public getWorkTime(bathType: BathType | undefined): number {
    // Calculate worktime based on Bath type, process and auftrag data
    // Use standardwork time if no override provided
    // Laufzeit = ([AgBedarf_kgPro1000]*([Stückzahl]/1000))/(0.067*100)
    return 60;
  }

  public updateStatus(status: AuftragStatus) {
    // TO DO
  }

  public getStatus(): AuftragStatus {
    return this.status;
  }
}
