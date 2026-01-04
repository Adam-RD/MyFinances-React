import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../../features/auth/pages/LoginPage";
import RegisterPage from "../../features/auth/pages/RegisterPage";
import DashboardPage from "../../features/dashboard/pages/DashboardPage";
import ExpensesPage from "../../features/expenses/pages/ExpensesPage";
import IncomesPage from "../../features/incomes/pages/IncomesPage";
import SavingsPage from "../../features/savings/pages/SavingsPage";
import SavingGoalsPage from "../../features/goals/pages/SavingGoalsPage";
import { AuthContext } from "../providers/AuthContext";

interface IProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: IProtectedRouteProps) => {
  const auth = useContext(AuthContext);
  if (!auth?.isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/expenses"
        element={
          <ProtectedRoute>
            <ExpensesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/incomes"
        element={
          <ProtectedRoute>
            <IncomesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/savings"
        element={
          <ProtectedRoute>
            <SavingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/goals"
        element={
          <ProtectedRoute>
            <SavingGoalsPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
