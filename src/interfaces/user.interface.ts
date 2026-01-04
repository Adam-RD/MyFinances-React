export interface IUser {
  id: number;
  username: string;

}

export interface IUserCreateDto {
  username: string;
  password: string;
}
