'use client';

import { useParams, useRouter } from 'next/navigation';
import { Calendar, ArrowLeft, Plus, Users, BarChart3, Download } from 'lucide-react';
import { Task } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { KanbanBoard } from '@/components/tasks/KanbanBoard';
import { useTasks } from '@/lib/hooks/useTasks';
import { useProjects } from '@/lib/hooks/useProjects';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { TaskForm } from '@/components/tasks/TaskForm';
import { TaskFormValues } from '@/lib/validations/task';
import api from '@/lib/api';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const projectId = id as string;

  const { useProjectDetail } = useProjects();
  const { data: project, isLoading: isLoadingProject } = useProjectDetail(projectId);
  const { tasks, isLoading: isLoadingTasks, createTask, isCreating } = useTasks(projectId);
  
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Task['status']>('pending');

  const handleAddTask = (status: Task['status']) => {
    setSelectedStatus(status);
    setIsTaskModalOpen(true);
  };

  const handleCreateTask = async (data: TaskFormValues) => {
    await createTask({ ...data, project: projectId, status: selectedStatus });
    setIsTaskModalOpen(false);
  };

  const handleExportPDF = async () => {
    const response = await api.get(`/projects/${projectId}/export_pdf/`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `reporte_${project?.name}.pdf`);
    document.body.appendChild(link);
    link.click();
  };

  if (isLoadingProject) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!project) return <div>Proyecto no encontrado</div>;

  return (
    <div className="space-y-8 pb-10">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-6">
          <button 
            onClick={() => router.back()}
            className="h-12 w-12 flex items-center justify-center bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">{project.name}</h1>
            <div className="flex items-center gap-4 mt-1">
              <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-[10px] font-black text-blue-600 uppercase tracking-widest border border-blue-100">
                {project.status}
              </span>
              <div className="flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <Calendar className="h-3 w-3 mr-1.5 text-blue-500" />
                {project.start_date}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="rounded-2xl h-12 px-6 text-[10px] font-black uppercase tracking-widest"
            onClick={handleExportPDF}
          >
            <Download className="h-4 w-4 mr-2" />
            Reporte PDF
          </Button>
          <Button 
            className="rounded-2xl h-12 px-6 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-200"
            onClick={() => handleAddTask('pending')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Tarea
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3">
          {isLoadingTasks ? (
            <div className="grid grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-96 bg-gray-100 rounded-3xl animate-pulse" />)}
            </div>
          ) : (
            <KanbanBoard 
              tasks={tasks} 
              onAddTask={handleAddTask}
              onTaskClick={(task) => console.log('Task clicked', task)}
            />
          )}
        </div>

        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100"
          >
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 border-b border-gray-50 pb-4 flex items-center">
              <BarChart3 className="h-4 w-4 mr-2 text-blue-500" />
              Detalles
            </h3>
            <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6">{project.description}</p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-gray-400 uppercase">Progreso</span>
                <span className="text-xs font-black text-blue-600">65%</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[65%]" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100"
          >
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 border-b border-gray-50 pb-4 flex items-center">
              <Users className="h-4 w-4 mr-2 text-blue-500" />
              Equipo
            </h3>
            <div className="flex -space-x-2 overflow-hidden">
              {[1, 2, 3].map(i => (
                <div key={i} className="inline-block h-10 w-10 rounded-2xl ring-4 ring-white bg-blue-100 flex items-center justify-center font-black text-blue-600 text-xs">
                  U{i}
                </div>
              ))}
              <div className="inline-block h-10 w-10 rounded-2xl ring-4 ring-white bg-gray-50 flex items-center justify-center font-black text-gray-400 text-xs">
                +2
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title="Crear Nueva Tarea"
      >
        <TaskForm 
          onSubmit={handleCreateTask}
          isLoading={isCreating}
          initialData={{ status: selectedStatus }}
        />
      </Modal>
    </div>
  );
}
