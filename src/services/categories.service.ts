import { http } from "./http";
import type { ICategory, ICategoryCreateDto } from "../interfaces/category.interfaces";

export const categoriesService = {
  async getAll(): Promise<ICategory[]> {
    const { data } = await http.get<ICategory[]>("/api/Categories");
    return data;
  },
  async create(dto: ICategoryCreateDto): Promise<ICategory> {
    const { data } = await http.post<ICategory>("/api/Categories", dto);
    return data;
  },
  async update(id: number, dto: ICategoryCreateDto): Promise<void> {
    await http.put(`/api/Categories/${id}`, dto);
  },
  async remove(id: number): Promise<void> {
    await http.delete(`/api/Categories/${id}`);
  },
};
