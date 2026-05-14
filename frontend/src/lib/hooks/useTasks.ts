import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { Task } from '../types';

const MOCK_TASKS: Task[] = [
  {
    id: 1,
    project: 1,
    title: 'Configurar base de datos',
    description: 'Establecer conexión con Supabase y ejecutar migraciones iniciales.',
    due_date: '2026-05-20',
    status: 'DONE',
    priority: 'HIGH',
    assigned_to_detail: { id: 1, username: 'Julian', email: 'julian@example.com', role: 'ADMIN' },
    created_at: '',
    updated_at: ''
  },
  {
    id: 2,
    project: 1,
    title: 'Diseñar Sidebar',
    description: 'Crear el componente de navegación lateral con TailwindCSS.',
    due_date: '2026-05-22',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    assigned_to_detail: { id: 2, username: 'Catalina', email: 'catalina@example.com', role: 'MEMBER' },
    created_at: '',
    updated_at: ''
  },
  {
    id: 3,
    project: 1,
    title: 'Implementar Auth JWT',
    description: 'Configurar interceptores de Axios y manejo de tokens.',
    due_date: '2026-05-25',
    status: 'PENDING',
    priority: 'HIGH',
    assigned_to_detail: { id: 1, username: 'Julian', email: 'julian@example.com', role: 'ADMIN' },
    created_at: '',
    updated_at: ''
  },
  {
    id: 4,
    project: 1,
    title: 'Error en reportes PDF',
    description: 'La librería de PDF no está generando el archivo correctamente en producción.',
    due_date: '2026-05-18',
    status: 'BLOCKED',
    priority: 'HIGH',
    assigned_to_detail: { id: 3, username: 'Dev3', email: 'dev3@example.com', role: 'MEMBER' },
    created_at: '',
    updated_at: ''
  }
];

export function useTasks(projectId?: number) {
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: projectId ? ['tasks', projectId] : ['tasks'],
    queryFn: async () => {
      try {
        const url = projectId ? `/tasks/?project_id=${projectId}` : '/tasks/';
        const response = await api.get<Task[]>(url);
        return response.data;
      } catch (e) {
        // Si falla la API, devolvemos mocks para visualizar
        return MOCK_TASKS;
      }
    },
    initialData: MOCK_TASKS // Usamos mocks inicialmente para que veas algo
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
    mutationFn: async ({ id, ...data }: Partial<Task> & { id: number }) => {
      const response = await api.patch<Task>(`/tasks/${id}/`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: number) => {
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
    createTask: createTaskMutation.mutate,
    isCreating: createTaskMutation.isPending,
    updateTask: updateTaskMutation.mutate,
    isUpdating: updateTaskMutation.isPending,
    deleteTask: deleteTaskMutation.mutate,
    isDeleting: deleteTaskMutation.isPending,
  };
}
