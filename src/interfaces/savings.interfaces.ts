export interface ISavingEntry {
  id: number;
  amount: number;
  date: string;
  note?: string | null;
  savingGoalId?: number | null;
}

export interface ISavingCreateDto {
  amount: number;
  date: string;
  note?: string | null;
  savingGoalId?: number | null;
}
