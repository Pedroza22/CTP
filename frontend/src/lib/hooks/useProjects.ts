import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { Project } from '../types';
import { useAuthStore } from '../store/authStore';

export function useProjects() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();

  const projectsQuery = useQuery({
    queryKey: ['projects'],
    enabled: isAuthenticated,
    queryFn: async () => {
      const response = await api.get<Project[]>('/projects/');
      return response.data;
    },
  });

  const useProjectDetail = (id: string) => useQuery({
    queryKey: ['projects', id],
    queryFn: async () => {
      const response = await api.get<Project>(`/projects/${id}/`);
      return response.data;
    },
    enabled: !!id && isAuthenticated,
  });

  const createProjectMutation = useMutation({
    mutationFn: async (newProject: Partial<Project>) => {
      const response = await api.post<Project>('/projects/', newProject);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Project> & { id: string }) => {
      const response = await api.patch<Project>(`/projects/${id}/`, data);
      return response.data;
    },
    onSuccess: (data: Project) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects', data.id] });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/projects/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  return {
    projects: projectsQuery.data || [],
    isLoading: projectsQuery.isLoading,
    isError: projectsQuery.isError,
    useProjectDetail,
    createProject: createProjectMutation.mutateAsync,
    isCreating: createProjectMutation.isPending,
    updateProject: updateProjectMutation.mutateAsync,
    isUpdating: updateProjectMutation.isPending,
    deleteProject: deleteProjectMutation.mutateAsync,
    isDeleting: deleteProjectMutation.isPending,
  };
}
