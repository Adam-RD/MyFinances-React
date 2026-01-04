export interface ISavingGoal {
  id: number;
  name: string;
  targetAmount: number;
  targetDate: string;
  isActive: boolean;
  totalSaved?: number;
  progress?: number;
  status?: string;
}

export interface ISavingGoalCreateDto {
  name: string;
  targetAmount: number;
  targetDate: string;
}

export interface ISavingGoalUpdateDto {
  name: string;
  targetAmount: number;
  targetDate: string;
  isActive: boolean;
}

export interface ISavingGoalProgress {
  goalId: number;
  name: string;
  targetAmount: number;
  totalSaved: number;
  progress: number;
  targetDate: string;
  isOnTrack?: boolean;
}
