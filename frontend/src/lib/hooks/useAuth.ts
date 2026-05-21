import { useMutation } from '@tanstack/react-query';
import api from '../api';
import { User, useAuthStore } from '../store/authStore';
import { LoginFormValues, RegisterFormValues } from '../validations/auth';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const router = useRouter();
  const { setAuth, logout, user, isAuthenticated, updateUser } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginFormValues) => {
      // Get tokens
      const tokenResponse = await api.post('/auth/login/', credentials);
      const { access, refresh } = tokenResponse.data;
      
      // Get user profile using the new token
      const profileResponse = await api.get('/auth/me/', {
        headers: { Authorization: `Bearer ${access}` }
      });
      
      return { tokens: { access, refresh }, user: profileResponse.data };
    },
    onSuccess: (data: { user: User; tokens: { access: string; refresh: string } }) => {
      setAuth(data.user, data.tokens.access, data.tokens.refresh);
      router.push('/dashboard');
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: RegisterFormValues) => {
      const response = await api.post('/auth/register/', userData);
      return response.data;
    },
    onSuccess: () => {
      router.push('/login');
    },
  });

  const profileUpdateMutation = useMutation({
    mutationFn: async (data: Partial<User> | FormData) => {
      const headers = data instanceof FormData 
        ? { 'Content-Type': 'multipart/form-data' }
        : {};
      const response = await api.patch('/auth/me/', data, { headers });
      return response.data;
    },
    onSuccess: (updatedUser: User) => {
      updateUser(updatedUser);
    }
  });

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return {
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    updateProfile: profileUpdateMutation.mutateAsync,
    isUpdatingProfile: profileUpdateMutation.isPending,
    logout: handleLogout,
    user,
    isAuthenticated,
  };
}
