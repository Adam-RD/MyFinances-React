import { createContext } from "react";
import type { IAuthUser } from "../../interfaces/auth.interfaces";

export interface IAuthContext {
  token: string | null;
  isAuthenticated: boolean;
  user: IAuthUser | null;
  setToken: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<IAuthContext | null>(null);
