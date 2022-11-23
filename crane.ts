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
