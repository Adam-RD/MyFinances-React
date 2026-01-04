import { http } from "./http";
import type { IExpenseCreateDto, IExpenseResponseDto, IExpenseSummaryDto } from "../interfaces/expense.interfaces";

export const expensesService = {
  async getAll(): Promise<IExpenseResponseDto[]> {
    const { data } = await http.get<IExpenseResponseDto[]>("/api/Expenses");
    return data;
  },
  async summary(): Promise<IExpenseSummaryDto> {
    const { data } = await http.get<IExpenseSummaryDto>("/api/Expenses/summary");
    return data;
  },
  async create(dto: IExpenseCreateDto): Promise<void> {
    await http.post("/api/Expenses", dto);
  },
  async update(id: number, dto: IExpenseCreateDto): Promise<void> {
    await http.put(`/api/Expenses/${id}`, dto);
  },
  async remove(id: number): Promise<void> {
    await http.delete(`/api/Expenses/${id}`);
  },
  async byRange(startDate: string, endDate: string): Promise<IExpenseResponseDto[]> {
    const { data } = await http.get<IExpenseResponseDto[]>("/api/Expenses/range", {
      params: { startDate, endDate },
    });
    return data;
  },
};
