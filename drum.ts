import { Auftrag } from "./auftrag";

export interface DrumSettings {
  number: number;
  // type: DrumType
}

enum DrumStatus {
  Full,
  Empty
}

/* enum DrumType {
  Siebstopf,
  Gebohrte
} 8 trommel */

export class Drum {
  readonly number: number;
  private status: DrumStatus;
  private auftrag: Auftrag | undefined;

  constructor(number: number) {
    this.number = number;
  }

  public setStatus(status: DrumStatus): void {
    this.status = status;
    console.log(`[Drum:setStatus] Drum ${this.number} is now ${DrumStatus[this.status]}`)
  }

  public getStatus(): DrumStatus {
    return this.status;
  }

  public loadParts(auftrag: Auftrag): void {
    this.auftrag = auftrag;
    this.status = DrumStatus.Full;
  }

  public getAuftrag(): Auftrag {
    return this.auftrag;
  }

  public unloadParts(): void {
    this.auftrag = undefined;
    this.status = DrumStatus.Empty;
  }
}