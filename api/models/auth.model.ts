export interface AuthLoginRequest {
  email: string;
  password: string;
}

export interface AuthLoginResponse {
  token: string;
}
