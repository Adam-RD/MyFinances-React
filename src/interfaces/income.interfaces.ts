export interface IIncomeResponseDto {
  id: number;
  description: string;
  amount: number;
  date: string;
}

export interface IIncomeCreateDto {
  description: string;
  amount: number;
  date: string;
}

export interface IIncomeSummaryDto {
  totalIncomes: number;
  totalExpenses: number;
  weeklyIncomes: number;
  monthlyIncomes: number;
  yearlyIncomes: number;
  balance: number;
}

export interface IBalanceResponse {
  totalIncomes: number;
  totalExpenses: number;
  balance: number;
}
