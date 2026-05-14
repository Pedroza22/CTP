import { useMutation, useQuery } from '@tanstack/react-query';
import api from '../api';
import { useAuthStore } from '../store/authStore';
import { User, AuthTokens } from '../types';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const router = useRouter();
  const { setAuth, logout, user, isAuthenticated } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: async (credentials: any) => {
      const response = await api.post('/auth/login/', credentials);
      const tokens = response.data;
      
      // Get user profile after login
      const profileResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/me/`, {
        headers: { Authorization: `Bearer ${tokens.access}` }
      });
      
      return { tokens, user: profileResponse.data };
    },
    onSuccess: (data) => {
      setAuth(data.user, data.tokens);
      router.push('/dashboard');
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: any) => {
      const response = await api.post('/auth/register/', userData);
      return response.data;
    },
    onSuccess: () => {
      router.push('/login');
    },
  });

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return {
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    logout: handleLogout,
    user,
    isAuthenticated,
  };
}

import axios from 'axios'; // Import for the profile fetch
