import { http } from "./http";
import type { ISavingCreateDto, ISavingEntry } from "../interfaces/savings.interfaces";

interface ISavingResponseDto {
  id: number;
  amount: number;
  date: string;
  note?: string | null;
  savingGoalId?: number | null;
}

const mapSaving = (item: ISavingResponseDto | Record<string, unknown>): ISavingEntry => {
  const note = (item as ISavingResponseDto).note ?? (item as { Note?: string | null }).Note ?? null;
  const savingGoalId =
    (item as ISavingResponseDto).savingGoalId ?? (item as { SavingGoalId?: number | null }).SavingGoalId ?? null;

  return {
    id: (item as ISavingResponseDto).id,
    amount: (item as ISavingResponseDto).amount,
    date: (item as ISavingResponseDto).date,
    note,
    savingGoalId,
  };
};

export const savingsService = {
  async getAll(): Promise<ISavingEntry[]> {
    const { data } = await http.get<ISavingResponseDto[]>("/api/Savings");
    return data.map(mapSaving).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async getByGoal(goalId: number): Promise<ISavingEntry[]> {
    const { data } = await http.get<ISavingResponseDto[]>(`/api/Savings/by-goal/${goalId}`);
    return data.map(mapSaving).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async create(dto: ISavingCreateDto): Promise<void> {
    await http.post("/api/Savings", {
      amount: dto.amount,
      date: new Date(dto.date).toISOString(),
      note: dto.note,
      savingGoalId: dto.savingGoalId,
      SavingGoalId: dto.savingGoalId,
    });
  },

  async update(id: number, dto: ISavingCreateDto): Promise<void> {
    await http.put(`/api/Savings/${id}`, {
      amount: dto.amount,
      date: new Date(dto.date).toISOString(),
      note: dto.note,
      savingGoalId: dto.savingGoalId,
      SavingGoalId: dto.savingGoalId,
    });
  },

  async remove(id: number): Promise<void> {
    await http.delete(`/api/Savings/${id}`);
  },
};
