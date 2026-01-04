import { http } from "./http";
import type { ISavingGoal, ISavingGoalCreateDto, ISavingGoalProgress, ISavingGoalUpdateDto } from "../interfaces/saving-goal.interfaces";

const mapGoal = (g: unknown): ISavingGoal => {
  const obj = (g ?? {}) as Record<string, unknown>;
  const hasIsActive = obj.isActive !== undefined || (obj as { IsActive?: unknown }).IsActive !== undefined;

  return {
    id: Number(obj.id ?? obj.Id ?? 0),
    name: String(obj.name ?? obj.Name ?? ""),
    targetAmount: Number(obj.targetAmount ?? obj.TargetAmount ?? 0),
    targetDate: String(obj.targetDate ?? obj.TargetDate ?? ""),
    isActive: hasIsActive ? Boolean(obj.isActive ?? (obj as { IsActive?: unknown }).IsActive) : true,
    totalSaved:
      obj.totalSaved !== undefined || (obj as { TotalSaved?: unknown }).TotalSaved !== undefined
        ? Number(
            (obj as { totalSaved?: unknown; TotalSaved?: unknown }).totalSaved ?? (obj as { TotalSaved?: unknown }).TotalSaved ?? 0
          )
        : undefined,
    progress:
      obj.progress !== undefined || (obj as { Progress?: unknown }).Progress !== undefined
        ? Number((obj as { progress?: unknown; Progress?: unknown }).progress ?? (obj as { Progress?: unknown }).Progress ?? 0)
        : undefined,
    status: (obj as { status?: string; Status?: string }).status ?? (obj as { Status?: string }).Status,
  };
};

const mapProgress = (p: unknown): ISavingGoalProgress => {
  const obj = (p ?? {}) as Record<string, unknown>;
  return {
    goalId: Number(obj.goalId ?? obj.GoalId ?? obj.id ?? obj.Id ?? 0),
    name: String(obj.name ?? obj.Name ?? ""),
    targetAmount: Number(obj.targetAmount ?? obj.TargetAmount ?? 0),
    totalSaved: Number(obj.totalSaved ?? obj.TotalSaved ?? 0),
    progress: Number(obj.progress ?? obj.Progress ?? 0),
    targetDate: String(obj.targetDate ?? obj.TargetDate ?? ""),
    isOnTrack:
      (obj as { isOnTrack?: boolean; IsOnTrack?: boolean }).isOnTrack ?? (obj as { IsOnTrack?: boolean }).IsOnTrack,
  };
};

export const savingGoalsService = {
  async getAll(): Promise<ISavingGoal[]> {
    const { data } = await http.get<unknown[]>("/api/SavingGoals");
    return (data ?? []).map(mapGoal);
  },
  async get(id: number): Promise<ISavingGoal> {
    const { data } = await http.get<unknown>(`/api/SavingGoals/${id}`);
    return mapGoal(data);
  },
  async getProgress(): Promise<ISavingGoalProgress[]> {
    const { data } = await http.get<unknown[]>("/api/SavingGoals/progress");
    return (data ?? []).map(mapProgress);
  },
  async create(dto: ISavingGoalCreateDto): Promise<ISavingGoal> {
    const { data } = await http.post<unknown>("/api/SavingGoals", dto);
    return mapGoal(data);
  },
  async update(id: number, dto: ISavingGoalUpdateDto): Promise<void> {
    await http.put(`/api/SavingGoals/${id}`, dto);
  },
  async remove(id: number): Promise<void> {
    await http.delete(`/api/SavingGoals/${id}`);
  },
};
