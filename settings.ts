import { BathType, WorkTime } from './bath';
import { CranePhase, CraneTime } from './crane';

/*
 * Hier müssen Standard Laufzeiten für Bäder eingetragen werden (falls vorhanden)
 * Messeinheit ist Sekunden
 */
export const standardWorkTimes: WorkTime[] = [
  {
    bathType: BathType.Copper,
    workTime: undefined,
  },
  {
    bathType: BathType.LoadingStation,
    workTime: 120,
  },
  {
    bathType: BathType.Parkplatz,
    workTime: undefined,
  },
  {
    bathType: BathType.PreTreatment,
    workTime: 600,
  },
  {
    bathType: BathType.RinseFlow,
    workTime: 900,
  },
  {
    bathType: BathType.RinseStand,
    workTime: 5,
  },
  {
    bathType: BathType.Silver,
    workTime: undefined,
  },
];

/*
 * Hier müssen Standard Zeiten dür die Cranephasen eingetragen werden
 * Messeinheit ist Sekunden
 */
export const defaultCraneTimes: CraneTime[] = [
  {
    /* Standard Abtropfzeit */
    phaseType: CranePhase.Drain,
    workTime: 15,
  },
  {
    /* Absenkzeit */
    phaseType: CranePhase.Drop,
    workTime: 20,
  },
  {
    /* Abholzeit */
    phaseType: CranePhase.Pick,
    workTime: 20,
  },
  {
    /* Zeit vom vorletzten Bad bis zur Position auf dem Zielbad */
    phaseType: CranePhase.Moving_endComponent,
    workTime: 6,
  },
  {
    /* Zeit vom ersten Bad bis zur zweiten Bad */
    phaseType: CranePhase.Moving_startComponent,
    workTime: 3,
  },
  {
    /* Zeit zwischen Bäder die weder Destination- noch Urpsrungsbad sind */
    phaseType: CranePhase.Moving_middleComponent,
    workTime: 2,
  },
  {
    /* Zeit wenn Destination- und Ursprungbad sind einer nach einander */
    phaseType: CranePhase.Moving_contiguousComponent,
    workTime: 5,
  },
];
