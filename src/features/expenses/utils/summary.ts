import type { IExpenseByCategoryDto, IExpenseResponseDto, IExpenseSummaryDto } from "../../../interfaces/expense.interfaces";

const groupByCategory = (list: IExpenseResponseDto[]): IExpenseByCategoryDto[] => {
  const totals = new Map<string, number>();
  list.forEach((x) => {
    const key = x.categoryName || "Sin categoria";
    totals.set(key, (totals.get(key) ?? 0) + x.amount);
  });
  return Array.from(totals.entries()).map(([categoryName, totalAmount]) => ({
    categoryName,
    totalAmount,
  }));
};

export const buildExpensesSummary = (items: IExpenseResponseDto[]): IExpenseSummaryDto => {
  const now = new Date();
  const weekAgo = new Date();
  weekAgo.setDate(now.getDate() - 6);
  const monthAgo = new Date();
  monthAgo.setDate(now.getDate() - 29);
  const yearStart = new Date(now.getFullYear(), 0, 1);

  const totalExpenses = items.reduce((acc, x) => acc + x.amount, 0);
  const weeklyExpenses = items
    .filter((x) => new Date(x.date) >= weekAgo)
    .reduce((acc, x) => acc + x.amount, 0);
  const monthlyExpenses = items
    .filter((x) => new Date(x.date) >= monthAgo)
    .reduce((acc, x) => acc + x.amount, 0);
  const yearlyExpenses = items
    .filter((x) => new Date(x.date) >= yearStart)
    .reduce((acc, x) => acc + x.amount, 0);

  const weeklyExpensesByCategory = groupByCategory(items.filter((x) => new Date(x.date) >= weekAgo));
  const monthlyExpensesByCategory = groupByCategory(items.filter((x) => new Date(x.date) >= monthAgo));
  const yearlyExpensesByCategory = groupByCategory(items.filter((x) => new Date(x.date) >= yearStart));

  return {
    totalExpenses,
    weeklyExpenses,
    monthlyExpenses,
    yearlyExpenses,
    weeklyExpensesByCategory,
    monthlyExpensesByCategory,
    yearlyExpensesByCategory,
    expensesByCategory: [],
  };
};
