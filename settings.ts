import { BathType, WorkTime } from './bath';

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
