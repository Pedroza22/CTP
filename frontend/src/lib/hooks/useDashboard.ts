import { useQuery } from '@tanstack/react-query';
import api from '../api';

export interface DashboardStats {
  total_projects: number;
  total_tasks: number;
  active_projects: number;
  completed_tasks: number;
  pending_tasks: number;
}

export interface ProjectProgress {
  id: string;
  name: string;
  progress: number;
}

export interface StatusCount {
  status: string;
  count: number;
}

export function useDashboard() {
  const statsQuery = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const response = await api.get<DashboardStats>('/dashboard/stats/');
      return response.data;
    },
  });

  const progressQuery = useQuery({
    queryKey: ['dashboard', 'progress'],
    queryFn: async () => {
      const response = await api.get<ProjectProgress[]>('/dashboard/project-progress/');
      return response.data;
    },
  });

  const statusQuery = useQuery({
    queryKey: ['dashboard', 'status-counts'],
    queryFn: async () => {
      const response = await api.get<StatusCount[]>('/dashboard/tasks-by-status/');
      return response.data;
    },
  });

  return {
    stats: statsQuery.data,
    progress: progressQuery.data || [],
    statusCounts: statusQuery.data || [],
    isLoading: statsQuery.isLoading || progressQuery.isLoading || statusQuery.isLoading,
  };
}
