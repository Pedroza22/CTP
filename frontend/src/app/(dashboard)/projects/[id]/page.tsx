'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, User, ArrowLeft, Plus, Settings } from 'lucide-react';
import api from '@/lib/api';
import { Project, Task } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { TaskCard } from '@/components/tasks/TaskCard';
import { useTasks } from '@/lib/hooks/useTasks';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const projectId = parseInt(id as string);

  const { data: project, isLoading: isLoadingProject } = useQuery({
    queryKey: ['projects', projectId],
    queryFn: async () => {
      const response = await api.get<Project>(`/projects/${projectId}/`);
      return response.data;
    },
  });

  const { tasks, isLoading: isLoadingTasks } = useTasks(projectId);

  if (isLoadingProject) {
    return <div className="animate-pulse h-96 bg-gray-100 rounded-lg" />;
  }

  if (!project) {
    return <div>Proyecto no encontrado</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Descripción</h3>
            <p className="text-gray-600 leading-relaxed">{project.description}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Tareas del Proyecto</h3>
              <Button size="sm" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nueva Tarea
              </Button>
            </div>
            
            {isLoadingTasks ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <div key={i} className="h-40 bg-gray-100 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : tasks.length === 0 ? (
              <div className="py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 text-center">
                <p className="text-gray-500">No hay tareas en este proyecto.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-6">
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-50 pb-4">Detalles</h3>
            
            <div className="space-y-4">
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                <div>
                  <p className="text-gray-500 text-xs">Fecha Inicio</p>
                  <p className="text-gray-900 font-medium">{project.start_date}</p>
                </div>
              </div>
              
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                <div>
                  <p className="text-gray-500 text-xs">Fecha Fin</p>
                  <p className="text-gray-900 font-medium">{project.end_date}</p>
                </div>
              </div>

              <div className="flex items-center text-sm">
                <User className="h-4 w-4 text-gray-400 mr-3" />
                <div>
                  <p className="text-gray-500 text-xs">Creado por</p>
                  <p className="text-gray-900 font-medium">{project.created_by_detail?.username || 'Admin'}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-50">
              <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                <Settings className="h-4 w-4" />
                Configuración del Proyecto
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Progreso</h3>
            <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2">
              <div className="bg-blue-600 h-2.5 rounded-full w-2/3"></div>
            </div>
            <p className="text-xs text-gray-500 text-right">66% completado</p>
          </div>
        </div>
      </div>
    </div>
  );
}
