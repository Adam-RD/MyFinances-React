import { http } from "./http";
import type { IUser, IUserCreateDto } from "../interfaces/user.interface";
export const usersService = {
  async getAll(): Promise<IUser[]> {
    const { data } = await http.get<IUser[]>("/api/Users");
    return data;
  },

  async create(dto: IUserCreateDto): Promise<IUser> {
    const { data } = await http.post<IUser>("/api/Users", dto);
    return data;
  },
};
