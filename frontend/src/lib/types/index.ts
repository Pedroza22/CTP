export type Role = 'admin' | 'member';

export interface User {
  id: string;
  username: string;
  email: string;
  role: Role;
  avatar_url?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string | null;
  status: 'active' | 'completed' | 'on_hold' | 'cancelled';
  created_at: string;
  updated_at: string;
  created_by: string;
  created_by_detail?: User;
}

export interface Task {
  id: string;
  project: string;
  title: string;
  description: string;
  due_date: string | null;
  status: 'pending' | 'in_progress' | 'done' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assigned_to?: string | null;
  assigned_to_detail?: User;
  comment_count?: number;
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
