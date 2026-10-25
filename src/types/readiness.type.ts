export type ReadinessLevel =
  | "GETTING_STARTED"
  | "IN_PROGRESS"
  | "NEARLY_READY"
  | "READY";

export interface IReadinessItem {
  key: string;
  label: string;
  earned: number;
  max: number;
  completed: boolean;
}

export interface IReadinessResult {
  totalScore: number;
  level: ReadinessLevel;
  items: IReadinessItem[];
}
