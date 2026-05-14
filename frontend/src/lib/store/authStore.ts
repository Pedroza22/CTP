import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthTokens } from '../types';

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  setAuth: (user: User, tokens: AuthTokens) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      setAuth: (user: User, tokens: AuthTokens) => {
        localStorage.setItem('tokens', JSON.stringify(tokens));
        set({ user, tokens, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem('tokens');
        set({ user: null, tokens: null, isAuthenticated: false });
      },
      updateUser: (user: User) => set({ user }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
