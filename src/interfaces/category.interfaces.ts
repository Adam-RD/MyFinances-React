export interface ICategory {
  id: number;
  name: string;
  userId: number;
}

export interface ICategoryCreateDto {
  name: string;
}
