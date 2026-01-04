import { http } from "./http";
import type { IIncomeCreateDto, IIncomeResponseDto, IIncomeSummaryDto, IBalanceResponse } from "../interfaces/income.interfaces";

export const incomesService = {
  async getAll(): Promise<IIncomeResponseDto[]> {
    const { data } = await http.get<IIncomeResponseDto[]>("/api/Incomes");
    return data;
  },
  async summary(): Promise<IIncomeSummaryDto> {
    const { data } = await http.get<IIncomeSummaryDto>("/api/Incomes/summary");
    return data;
  },
  async balance(): Promise<IBalanceResponse> {
    const { data } = await http.get<IBalanceResponse>("/api/Incomes/balance");
    return data;
  },
  async create(dto: IIncomeCreateDto): Promise<void> {
    await http.post("/api/Incomes", dto);
  },
  async update(id: number, dto: IIncomeCreateDto): Promise<void> {
    await http.put(`/api/Incomes/${id}`, dto);
  },
  async remove(id: number): Promise<void> {
    await http.delete(`/api/Incomes/${id}`);
  },
};
