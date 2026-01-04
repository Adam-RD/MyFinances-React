import type { ReactNode } from "react";
import DashboardPage from "../../features/dashboard/pages/DashboardPage";
import LoginPage from "../../features/auth/pages/LoginPage";
import ExpensesPage from "../../features/expenses/pages/ExpensesPage";
import IncomesPage from "../../features/incomes/pages/IncomesPage";

export interface AppRoute {
  path: string;
  element: ReactNode;
  label?: string;
}

export const routes: AppRoute[] = [
  { path: "/", element: <DashboardPage />, label: "Dashboard" },
  { path: "/expenses", element: <ExpensesPage />, label: "Gastos" },
  { path: "/incomes", element: <IncomesPage />, label: "Ingresos" },
  { path: "/login", element: <LoginPage />, label: "Iniciar sesion" },
];
