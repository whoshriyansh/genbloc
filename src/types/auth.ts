export interface UserCredentials {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

export interface LoginResponse {
  token: string;
  user: UserCredentials;
}

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterCredentials = {
  username: string;
  email: string;
  password: string;
};

export type UpdateUserCredentials = {
  username?: string;
  email?: string;
  password?: string;
};

export type UpdateUserResponse = {
  user: UserCredentials;
};

export interface UserState {
  user: UserCredentials | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
