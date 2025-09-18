export interface AuthResponse {
  code: string;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    acessTokenExpiresIn: number;
    refreshTokenExpiresIn: number;
  } | null;
}
