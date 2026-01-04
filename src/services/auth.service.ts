import { http } from "./http";
import type { IUserLoginDto, IAuthResponse } from "../interfaces/auth.interfaces";

export const authService = {
  async login(dto: IUserLoginDto): Promise<IAuthResponse> {
    const { data } = await http.post<IAuthResponse & { Token?: string }>(
      "/api/auth/login",
      dto
    );

    const token = data.token ?? data.Token;
    if (!token) throw new Error("Token no presente en la respuesta");
    return { token };
  },
};
