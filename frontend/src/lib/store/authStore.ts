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
      setAuth: (user, tokens) => {
        localStorage.setItem('tokens', JSON.stringify(tokens));
        // Añadimos cookie para que el middleware pueda leer el estado de auth
        document.cookie = `isAuthenticated=true; path=/; max-age=${60 * 60 * 24 * 7}`;
        set({ user, tokens, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem('tokens');
        // Eliminamos la cookie al cerrar sesión
        document.cookie = 'isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        set({ user: null, tokens: null, isAuthenticated: false });
      },
      updateUser: (user: User) => set({ user }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
