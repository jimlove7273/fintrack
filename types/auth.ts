export interface User {
  id: string;
  username: string;
  email: string;
  lastActive: Date;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  lastActivity: Date | null;
}
