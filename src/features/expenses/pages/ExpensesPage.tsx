import { useEffect, useState } from "react";
import { expensesService } from "../../../services/expenses.service";
import { categoriesService } from "../../../services/categories.service";
import type { IExpenseResponseDto, IExpenseSummaryDto } from "../../../interfaces/expense.interfaces";
import type { ICategory } from "../../../interfaces/category.interfaces";
import { mapApiError } from "../../../services/http";
import Spinner from "../../../components/ui/Spinner";
import ExpensesSummaryCard from "../components/ExpensesSummaryCard";
import ExpensesPieChart from "../components/ExpensesPieChart";
import { useBalance } from "../../../app/providers/BalanceContext";
import { notifyError, notifySuccess } from "../../../utils/notify";
import { buildExpensesSummary } from "../utils/summary";
import ExpensesHeader from "../components/ExpensesHeader";
import ExpenseFormCard from "../components/ExpenseFormCard";
import CategoryManagerCard from "../components/CategoryManagerCard";
import EditExpenseCard from "../components/EditExpenseCard";
import RecentExpensesCard from "../components/RecentExpensesCard";

const ExpensesPage = () => {
  const hiddenCategory = "ahorros ocultos";
  const pageSize = 5;
  const [items, setItems] = useState<IExpenseResponseDto[]>([]);
  const [expenseError, setExpenseError] = useState<string | null>(null);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [summary, setSummary] = useState<IExpenseSummaryDto | null>(null);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [categoryReloadKey, setCategoryReloadKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingExpense, setEditingExpense] = useState<IExpenseResponseDto | null>(null);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);
  const [currentCategoryPage, setCurrentCategoryPage] = useState(1);
  const [chartRange, setChartRange] = useState<"weekly" | "monthly" | "yearly">("monthly");
  const { refreshBalance } = useBalance();

  const refreshCategories = async () => {
    try {
      const data = await categoriesService.getAll();
      setCategories(data);
      setCategoryError(null);
      setCategoryReloadKey((key) => key + 1);
    } catch (err) {
      setCategoryError(mapApiError(err).message);
    }
  };

  const refreshData = async () => {
    try {
      setLoading(true);
      const [expenseList, categoryList] = await Promise.all([expensesService.getAll(), categoriesService.getAll()]);

      const visibleExpenses = expenseList.filter(
        (x) => (x.categoryName ?? "").toLowerCase() !== hiddenCategory
      );

      const sorted = [...visibleExpenses].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setExpenseError(null);
      setSummaryError(null);
      setCategoryError(null);

      setItems(sorted);
      setSummary(buildExpensesSummary(sorted));
      setCategories(categoryList);
      setEditingCategory(null);
      setCategoryReloadKey((key) => key + 1);
      setCurrentPage(1);
      setCurrentCategoryPage(1);
      void refreshBalance();
    } catch (err) {
      const msg = mapApiError(err).message;
      setExpenseError(msg);
      setSummaryError(msg);
      setCategoryError(msg);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (id: number) => {
    try {
      setExpenseError(null);
      await expensesService.remove(id);
      await refreshData();
    } catch (err) {
      const msg = mapApiError(err).message;
      setExpenseError(msg);
    }
  };

  const onCategoryDelete = async (id: number) => {
    try {
      setCategoryError(null);
      await categoriesService.remove(id);
      setEditingCategory(null);
      await refreshCategories();
      notifySuccess("Categoria eliminada");
      setCurrentCategoryPage(1);
    } catch (err) {
      const msg = mapApiError(err).message;
      setCategoryError(msg);
      notifyError(msg);
    }
  };

  useEffect(() => {
    void refreshData();
  }, []);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  const start = (currentPage - 1) * pageSize;
  const pagedItems = items.slice(start, start + pageSize);

  const categoryPageSize = 3;
  const totalCategoryPages = Math.max(1, Math.ceil(categories.length / categoryPageSize));
  useEffect(() => {
    setCurrentCategoryPage((prev) => Math.min(prev, totalCategoryPages));
  }, [totalCategoryPages]);
  const categoryStart = (currentCategoryPage - 1) * categoryPageSize;
  const pagedCategories = categories.slice(categoryStart, categoryStart + categoryPageSize);

  return (
    <div className="space-y-6">
      {loading && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <Spinner size="lg" text="Cargando gastos..." />
        </div>
      )}

      <ExpensesHeader />

      <div className="grid gap-6 lg:grid-cols-2">
        <ExpenseFormCard
          editingExpense={editingExpense}
          reloadCategoriesKey={categoryReloadKey}
          onCancelEdit={() => setEditingExpense(null)}
          onCreated={() => {
            setEditingExpense(null);
            void refreshData();
          }}
        />

        <CategoryManagerCard
          categories={categories}
          pagedCategories={pagedCategories}
          categoryError={categoryError}
          editingCategory={editingCategory}
          categoryStart={categoryStart}
          categoryPageSize={categoryPageSize}
          currentCategoryPage={currentCategoryPage}
          totalCategoryPages={totalCategoryPages}
          onSavedCategory={() => {
            setEditingCategory(null);
            setCategoryError(null);
            void refreshCategories();
          }}
          onEditCategory={(item) => setEditingCategory(item)}
          onCancelEdit={() => setEditingCategory(null)}
          onDeleteCategory={onCategoryDelete}
          onPrevPage={() => setCurrentCategoryPage((p) => Math.max(1, p - 1))}
          onNextPage={() => setCurrentCategoryPage((p) => Math.min(totalCategoryPages, p + 1))}
        />
      </div>

      {editingExpense && (
        <EditExpenseCard
          editingExpense={editingExpense}
          reloadCategoriesKey={categoryReloadKey}
          onClose={() => setEditingExpense(null)}
          onSaved={() => {
            setEditingExpense(null);
            void refreshData();
          }}
        />
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentExpensesCard
          items={items}
          pagedItems={pagedItems}
          expenseError={expenseError}
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onDelete={onDelete}
          onEdit={(item) => setEditingExpense(item)}
          onPrevPage={() => setCurrentPage((p) => Math.max(1, p - 1))}
          onNextPage={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        />

        <ExpensesSummaryCard summary={summary} error={summaryError} />
      </div>

      <ExpensesPieChart summary={summary} range={chartRange} onRangeChange={setChartRange} />
    </div>
  );
};

export default ExpensesPage;
