export type Role = 'ADMIN' | 'MEMBER';

export interface User {
  id: number;
  username: string;
  email: string;
  role: Role;
  avatar_url?: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: 'ACTIVE' | 'COMPLETED' | 'ON_HOLD';
  created_at: string;
  updated_at: string;
  created_by: number;
  created_by_detail?: User;
}

export interface Task {
  id: number;
  project: number;
  title: string;
  description: string;
  due_date: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'DONE' | 'BLOCKED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  assigned_to?: number;
  assigned_to_detail?: User;
  created_at: string;
  updated_at: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
}
