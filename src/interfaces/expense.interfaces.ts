export interface IExpenseResponseDto {
  id: number;
  description: string;
  amount: number;
  date: string;
  categoryName?: string | null;
  categoryId?: number | null;
}

export interface IExpenseCreateDto {
  description: string;
  amount: number;
  date: string;
  categoryId: number;
}

export interface IExpenseByCategoryDto {
  categoryName: string;
  totalAmount: number;
}

export interface IExpenseSummaryDto {
  totalExpenses: number;
  weeklyExpenses: number;
  monthlyExpenses: number;
  yearlyExpenses: number;

  weeklyExpensesByCategory: IExpenseByCategoryDto[];
  monthlyExpensesByCategory: IExpenseByCategoryDto[];
  yearlyExpensesByCategory: IExpenseByCategoryDto[];

  expensesByCategory: unknown;
}
