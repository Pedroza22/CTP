import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { useAuthStore } from '../store/authStore';

export interface Notification {
  id: number;
  message: string;
  type: 'info' | 'success' | 'warning' | 'comment';
  created_at: string;
  is_read: boolean;
}

export function useNotifications() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();

  const notificationsQuery = useQuery({
    queryKey: ['notifications'],
    enabled: isAuthenticated,
    queryFn: async () => {
      try {
        const response = await api.get<Notification[]>('/notifications/');
        return response.data;
      } catch {
        // Mocks if backend is not ready
        return [
          {
            id: 1,
            message: 'Julián completó la tarea "API de Proyectos"',
            type: 'success',
            created_at: new Date().toISOString(),
            is_read: false,
          },
          {
            id: 2,
            message: 'Nuevo comentario de Catalina en "Sidebar"',
            type: 'comment',
            created_at: new Date(Date.now() - 3600000).toISOString(),
            is_read: false,
          }
        ] as Notification[];
      }
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.patch(`/notifications/${id}/`, { is_read: true });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  return {
    notifications: notificationsQuery.data || [],
    isLoading: notificationsQuery.isLoading,
    markAsRead: markAsReadMutation.mutate,
  };
}
