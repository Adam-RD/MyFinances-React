import React, { useCallback, useEffect, useMemo, useState } from "react";
import { tokenStorage } from "../../utils/tokenStorage";
import { AuthContext } from "./AuthContext";
import type { IAuthContext } from "./AuthContext";
import type { IAuthUser } from "../../interfaces/auth.interfaces";
import { notifyError } from "../../utils/notify";

const decodeTokenPayload = (token: string | null): Record<string, unknown> | null => {
  if (!token) return null;

  const [, payload] = token.split(".");
  if (!payload) return null;

  try {
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json) as Record<string, unknown>;
  } catch (err) {
    console.error("No se pudo decodificar el token", err);
    return null;
  }
};

const parseUserFromToken = (token: string | null): IAuthUser | null => {
  const data = decodeTokenPayload(token);
  if (!data) return null;

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
};

const getTokenExpiration = (token: string | null): number | null => {
  const payload = decodeTokenPayload(token);
  if (!payload) return null;

  const expRaw = (payload.exp ?? payload.expiration ?? payload.Expiration) as unknown;

  if (typeof expRaw === "string") {
    const parsed = Number.parseInt(expRaw, 10);
    if (!Number.isNaN(parsed)) return parsed > 1_000_000_000_000 ? parsed : parsed * 1000;
  }

  if (typeof expRaw === "number") {
    return expRaw > 1_000_000_000_000 ? expRaw : expRaw * 1000;
  }

  return null;
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(() => tokenStorage.get());
  const [user, setUser] = useState<IAuthUser | null>(() => parseUserFromToken(tokenStorage.get()));

  const setToken = useCallback(
    (newToken: string) => {
      tokenStorage.set(newToken);
      setTokenState(newToken);
      setUser(parseUserFromToken(newToken));
    },
    []
  );

  const logout = useCallback(() => {
    tokenStorage.clear();
    setTokenState(null);
    setUser(null);
  }, []);

  useEffect(() => {
    if (!token) return;

    const expiration = getTokenExpiration(token);
    if (!expiration) return;

    const msUntilExpiration = expiration - Date.now();
    if (msUntilExpiration <= 0) {
      logout();
      notifyError("Tu sesion expiro. Vuelve a ingresar.");
      return;
    }

    const timeoutId = window.setTimeout(() => {
      logout();
      notifyError("Tu sesion expiro. Vuelve a ingresar.");
    }, msUntilExpiration);

    return () => window.clearTimeout(timeoutId);
  }, [token, logout]);

  const value = useMemo<IAuthContext>(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      user,
      setToken,
      logout,
    }),
    [token, user, setToken, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
