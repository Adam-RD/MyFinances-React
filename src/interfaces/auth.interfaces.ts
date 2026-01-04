export interface IUserLoginDto {
  username: string;
  password: string;
}

export interface IAuthResponse {
  token: string;
}

export interface IAuthUser {
  userId: number | null;
  username: string;
}
