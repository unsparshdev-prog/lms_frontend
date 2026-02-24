export type UserRole = 'LIBRARIAN' | 'MEMBER';

export interface User {
  id: string;
  token: string;
  email: string;
  role: UserRole;
  name?: string;
  memberId?: string;
  membershipActive?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export interface AuthResponse {
  id: string;
  token: string;
  email: string;
  role: UserRole;
}
