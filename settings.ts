import { AuftragSettings } from './auftrag';
import { BathSettings, WorkTime } from './bath';

enum BathType {
  PreTreatment,
  Silver,
  Copper,
  RinseStand,
  RinseFlow,
  Parkplatz,
  LoadingStation,
}

enum Process {
  SilverElectroplating,
  Subcoppering,
  Rework,
}

export const plantSettings = {
  AgCurrent: 100, // Ampere
  CuCurrent: 100, // Ampere
  craneStartingPosition: 31,
  simulation: {
    speed: 3, // 1 is realtime, 10 is 10x and so on
    maxTime: 900, // in seconds, when to end simulation
    sampleTime: 1,
  },
};

/*
 * Hier müssen Standard Laufzeiten für Bäder eingetragen werden (falls vorhanden)
 * Messeinheit ist Sekunden
 */
export const standardWorkTimes: WorkTime[] = [
  {
    bathType: BathType.Copper,
    time: undefined,
  },
  {
    bathType: BathType.LoadingStation,
    time: 120,
  },
  {
    bathType: BathType.Parkplatz,
    time: undefined,
  },
  {
    bathType: BathType.PreTreatment,
    time: 600,
  },
  {
    bathType: BathType.RinseFlow,
    time: 900,
  },
  {
    bathType: BathType.RinseStand,
    time: 5,
  },
  {
    bathType: BathType.Silver,
    time: undefined,
  },
];

/*
 * Hier müssen Standard Zeiten dür die Cranephasen eingetragen werden
 * Messeinheit ist Sekunden
 */
export const defaultCraneTimes = {
  drain: 15, // Standard Abtropfzeit
  drop: 20, // Absenkzeit
  pick: 20, // Abholzeit
  moving: {
    start: 6, // Zeit vom ersten Bad bis zur zweiten Bad
    middle: 2, // Zeit zwischen Bäder die weder Destination- noch Urpsrungsbad sind
    end: 3, // Zeit vom vorletzten Bad bis zur Position auf dem Zielbad
    contiguous: 5, // Zeit wenn Destination- und Ursprungbad sind einer nach einander
  },
};

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
    nextBaths: [3],
  },
];

export const simulationSettings = {
  maxSimulationTime: 1800, // Seconds
  sampleTime: 1, // Seconds
};

export const aufragToWork: AuftragSettings[] = [
  {
    number: '16458719',
    material: '276.141.011',
    process: Process.SilverElectroplating,
    silverAmount: 1.299,
    quantity: 40108,
  },
  {
    number: '16364066',
    material: '307.168.011',
    process: Process.SilverElectroplating,
    silverAmount: 5.56,
    quantity: 40150,
  },
  {
    number: '16477107',
    material: '276.270.021',
    process: Process.SilverElectroplating,
    silverAmount: 0.68,
    quantity: 50390,
    workTimeOverride: [
      {
        bathType: BathType.RinseFlow,
        time: 300,
      },
    ],
  },
  {
    number: '16473799',
    material: '257.024.101',
    process: Process.SilverElectroplating,
    silverAmount: 17.345,
    quantity: 18000,
  },
  {
    number: '16473789',
    material: '279.124.011',
    process: Process.SilverElectroplating,
    silverAmount: 5.983,
    quantity: 30000,
  },
];
