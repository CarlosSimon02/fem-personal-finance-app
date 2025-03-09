export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  uid: string;
  email: string;
  idToken: string;
  refreshToken: string;
}
