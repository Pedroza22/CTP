import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { Task } from '../types';
import { useAuthStore } from '../store/authStore';

export function useTasks(projectId?: string) {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();

  const tasksQuery = useQuery({
    queryKey: projectId ? ['tasks', { projectId }] : ['tasks'],
    enabled: isAuthenticated,
    queryFn: async () => {
      const params = projectId ? { project: projectId } : {};
      const response = await api.get<Task[]>('/tasks/', { params });
      return response.data;
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: async (newTask: Partial<Task>) => {
      const response = await api.post<Task>('/tasks/', newTask);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Task> & { id: string }) => {
      const response = await api.patch<Task>(`/tasks/${id}/`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/tasks/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  return {
    tasks: tasksQuery.data || [],
    isLoading: tasksQuery.isLoading,
    isError: tasksQuery.isError,
    createTask: createTaskMutation.mutateAsync,
    isCreating: createTaskMutation.isPending,
    updateTask: updateTaskMutation.mutateAsync,
    isUpdating: updateTaskMutation.isPending,
    deleteTask: deleteTaskMutation.mutateAsync,
    isDeleting: deleteTaskMutation.isPending,
  };
}
