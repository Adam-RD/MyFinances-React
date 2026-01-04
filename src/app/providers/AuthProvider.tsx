import React, { useMemo, useState } from "react";
import { tokenStorage } from "../../utils/tokenStorage";
import { AuthContext } from "./AuthContext";
import type { IAuthContext } from "./AuthContext";
import type { IAuthUser } from "../../interfaces/auth.interfaces";

const parseUserFromToken = (token: string | null): IAuthUser | null => {
  if (!token) return null;

  const [, payload] = token.split(".");
  if (!payload) return null;

  try {
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const data = JSON.parse(json) as Record<string, unknown>;

    const username =
      (data.username as string | undefined) ??
      (data.unique_name as string | undefined) ??
      (data.name as string | undefined) ??
      (data.sub as string | undefined);

    const userIdRaw =
      (data.userId as number | string | undefined) ??
      (data.nameid as number | string | undefined) ??
      (data.sub as number | string | undefined);

    const userId =
      typeof userIdRaw === "string"
        ? Number.parseInt(userIdRaw, 10)
        : typeof userIdRaw === "number"
          ? userIdRaw
          : null;

    if (!username) return null;
    return { username, userId: Number.isNaN(userId ?? NaN) ? null : userId };
  } catch (err) {
    console.error("No se pudo decodificar el usuario del token", err);
    return null;
  }
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(() => tokenStorage.get());
  const [user, setUser] = useState<IAuthUser | null>(() => parseUserFromToken(tokenStorage.get()));

  const setToken = (newToken: string) => {
    tokenStorage.set(newToken);
    setTokenState(newToken);
    setUser(parseUserFromToken(newToken));
  };

  const logout = () => {
    tokenStorage.clear();
    setTokenState(null);
    setUser(null);
  };

  const value = useMemo<IAuthContext>(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      user,
      setToken,
      logout,
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
