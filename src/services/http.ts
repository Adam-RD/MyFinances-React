import axios, { AxiosError } from "axios";
import { env } from "../config/env";
import { tokenStorage } from "../utils/tokenStorage";

export const http = axios.create({
  baseURL: env.apiUrl,
});

http.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export interface IApiError {
  message: string;
  status?: number;
}

export function mapApiError(error: unknown): IApiError {
  const err = error as AxiosError<unknown>;
  const responseData = err?.response?.data;
  const responseMessage =
    typeof responseData === "string"
      ? responseData
      : typeof responseData === "object" && responseData !== null && "message" in responseData
        ? String((responseData as { message?: unknown }).message ?? "")
        : undefined;

  return {
    message: responseMessage || err?.message || "Error desconocido",
    status: err?.response?.status,
  };
}
