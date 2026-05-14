import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { Project } from '../types';

const MOCK_PROJECTS: Project[] = [
  {
    id: 1,
    name: 'Sistema Precision Flow',
    description: 'Plataforma integral para la gestión de proyectos universitarios.',
    start_date: '2026-05-01',
    end_date: '2026-06-30',
    status: 'ACTIVE',
    created_at: '',
    updated_at: '',
    created_by: 1
  },
  {
    id: 2,
    name: 'App de Inventarios',
    description: 'Control de stock y ventas para pequeñas empresas.',
    start_date: '2026-04-15',
    end_date: '2026-07-15',
    status: 'ON_HOLD',
    created_at: '',
    updated_at: '',
    created_by: 1
  }
];

export function useProjects() {
  const queryClient = useQueryClient();

  const projectsQuery = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      try {
        const response = await api.get<Project[]>('/projects/');
        return response.data;
      } catch (e) {
        return MOCK_PROJECTS;
      }
    },
    initialData: MOCK_PROJECTS
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
    mutationFn: async ({ id, ...data }: Partial<Project> & { id: number }) => {
      const response = await api.patch<Project>(`/projects/${id}/`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: number) => {
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
    createProject: createProjectMutation.mutate,
    isCreating: createProjectMutation.isPending,
    updateProject: updateProjectMutation.mutate,
    isUpdating: updateProjectMutation.isPending,
    deleteProject: deleteProjectMutation.mutate,
    isDeleting: deleteProjectMutation.isPending,
  };
}
