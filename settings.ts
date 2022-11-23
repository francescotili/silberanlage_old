import { BathSettings, BathType, WorkTime } from './bath';
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

/*
 * Hier müssen alle die Bäder spezifiziert werden
 */
export const bathsInitData: BathSettings[] = [
  {
    // Bad 0 (Dummy Bad)
    is_enabled: false,
  },
  {
    // Bad 1
    is_enabled: false,
  },
  {
    // Bad 2
    is_enabled: false,
  },
  {
    // Bad 3
    name: 'Abkochentfettung',
    type: BathType.PreTreatment,
    is_enabled: true,
    nextBaths: [7],
  },
  {
    // Bad 4
    is_enabled: false,
  },
  {
    // Bad 5
    is_enabled: false,
  },
  {
    // Bad 6
    is_enabled: false,
  },
  {
    // Bad 7
    name: 'Elektrolitisch Entfettung',
    type: BathType.PreTreatment,
    is_enabled: true,
    drainTime: 30,
    nextBaths: [8],
  },
  {
    // Bad 8
    name: 'Standspüle (Kaskade)',
    type: BathType.RinseStand,
    is_enabled: true,
    nextBaths: [9],
  },
  {
    // Bad 9
    name: 'Standspüle (Kaskade)',
    type: BathType.RinseStand,
    is_enabled: true,
    nextBaths: [10],
  },
  {
    // Bad 10
    name: 'Fliessspüle',
    type: BathType.RinseFlow,
    is_enabled: true,
    nextBaths: [11],
  },
  {
    // Bad 11
    name: 'Dekapierung',
    type: BathType.PreTreatment,
    is_enabled: true,
    nextBaths: [12],
  },
  {
    // Bad 12
    name: 'Standspüle',
    type: BathType.RinseStand,
    is_enabled: true,
    nextBaths: [13],
  },
  {
    // Bad 13
    name: 'Fliessspule',
    type: BathType.RinseFlow,
    is_enabled: true,
    nextBaths: [14, 15, 20, 21],
  },
  {
    // Bad 14
    name: 'Kupfer Elektrolyt',
    type: BathType.Copper,
    is_enabled: true,
    nextBaths: [16],
  },
  {
    // Bad 15
    name: 'Kupfer Elektrolyt',
    type: BathType.Copper,
    is_enabled: true,
    nextBaths: [16],
  },
  {
    // Bad 16
    name: 'Standspüle (Kaskade)',
    type: BathType.RinseStand,
    is_enabled: true,
    nextBaths: [17],
  },
  {
    // Bad 17
    name: 'Standspüle (Kaskade)',
    type: BathType.RinseStand,
    is_enabled: true,
    nextBaths: [18],
  },
  {
    // Bad 18
    name: 'Standspüle',
    type: BathType.RinseFlow,
    is_enabled: true,
    nextBaths: [20, 21],
  },
  {
    // Bad 19
    name: 'Vorsilber',
    is_enabled: false,
  },
  {
    // Bad 20
    name: 'Silber Elektrolyt',
    type: BathType.Silver,
    is_enabled: true,
    nextBaths: [23],
  },
  {
    // Bad 21
    name: 'Silber Elektrolyt',
    type: BathType.Silver,
    is_enabled: true,
    nextBaths: [23],
  },
  {
    // Bad 22
    name: 'Pufferbad',
    is_enabled: false,
  },
  {
    // Bad 23
    name: 'Standspüle (Kaskade)',
    type: BathType.RinseStand,
    is_enabled: true,
    nextBaths: [24],
  },
  {
    // Bad 24
    name: 'Standspüle (Kaskade)',
    type: BathType.RinseStand,
    is_enabled: true,
    nextBaths: [26],
  },
  {
    // Bad 25
    name: 'Heißspüle',
    is_enabled: false,
  },
  {
    // Bad 26
    name: 'Fliessspüle',
    type: BathType.RinseFlow,
    is_enabled: true,
    nextBaths: [31],
  },
  {
    // Bad 27
    name: 'Parkplatz',
    type: BathType.Parkplatz,
    is_enabled: true,
    nextBaths: [31],
  },
  {
    // Bad 28
    name: 'Parkplatz',
    type: BathType.Parkplatz,
    is_enabled: true,
    nextBaths: [31],
  },
  {
    // Bad 29
    name: 'Parkplatz',
    type: BathType.Parkplatz,
    is_enabled: true,
    nextBaths: [31],
  },
  {
    // Bad 30
    name: 'Fliessspüle',
    type: BathType.RinseFlow,
    is_enabled: true,
    nextBaths: [31],
  },
  {
    // Position 31
    name: 'Abladestation',
    type: BathType.LoadingStation,
    is_enabled: true,
    nextBaths: [3, 27, 28, 29],
  },
];
