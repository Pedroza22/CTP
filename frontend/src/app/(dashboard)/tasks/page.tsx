'use client';

import { useState } from 'react';
import { Plus, Filter, Search, LayoutGrid, List } from 'lucide-react';
import { Button, cn } from '@/components/ui/Button';
import { TaskCard } from '@/components/tasks/TaskCard';
import { KanbanBoard } from '@/components/tasks/KanbanBoard';
import { Modal } from '@/components/ui/Modal';
import { TaskForm } from '@/components/tasks/TaskForm';
import { CommentSection } from '@/components/tasks/CommentSection';
import { useTasks } from '@/lib/hooks/useTasks';
import { useProjects } from '@/lib/hooks/useProjects';
import { Task } from '@/lib/types';
import { TaskFormValues } from '@/lib/validations/task';

export default function TasksPage() {
  const [view, setView] = useState<'list' | 'kanban'>('kanban');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  
  const { tasks, isLoading, createTask, updateTask, isCreating, isUpdating } = useTasks();
  const { projects } = useProjects();

  const handleCreateTask = async (data: TaskFormValues) => {
    try {
      await createTask(data);
      setIsModalOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateTask = async (data: TaskFormValues) => {
    if (selectedTask) {
      try {
        await updateTask({ id: selectedTask.id, ...data });
        setIsModalOpen(false);
        setSelectedTask(undefined);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const openEditModal = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-40 rounded-lg bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tareas</h1>
          <p className="text-gray-500">Gestiona y organiza el trabajo de tu equipo.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-white border border-gray-200 rounded-md p-1 flex items-center shadow-sm">
            <button
              onClick={() => setView('list')}
              className={cn(
                'p-1.5 rounded transition-colors',
                view === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-600'
              )}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView('kanban')}
              className={cn(
                'p-1.5 rounded transition-colors',
                view === 'kanban' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-600'
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
          <Button 
            className="flex items-center gap-2"
            onClick={() => {
              setSelectedTask(undefined);
              setIsModalOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Nueva Tarea
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Buscar tareas..."
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filtros
        </Button>
      </div>

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500 mb-4 text-lg">No hay tareas creadas todavía.</p>
          <Button onClick={() => setIsModalOpen(true)}>Crear mi primera tarea</Button>
        </div>
      ) : (
        <>
          {view === 'list' ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {tasks.map((task) => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onClick={() => openEditModal(task)}
                />
              ))}
            </div>
          ) : (
            <KanbanBoard 
              tasks={tasks} 
              onTaskClick={openEditModal}
              onAddTask={(status) => {
                setSelectedTask({ status } as Task);
                setIsModalOpen(true);
              }}
            />
          )}
        </>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(undefined);
        }}
        title={selectedTask?.id ? 'Detalles de la Tarea' : 'Nueva Tarea'}
        size={selectedTask?.id ? 'xl' : 'md'}
      >
        {selectedTask?.id ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Información Principal</h4>
                <TaskForm
                  initialData={selectedTask}
                  projects={projects}
                  onSubmit={handleUpdateTask}
                  isLoading={isUpdating}
                />
              </div>
            </div>
            <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <CommentSection taskId={selectedTask.id} />
            </div>
          </div>
        ) : (
          <TaskForm
            initialData={selectedTask}
            projects={projects}
            onSubmit={handleCreateTask}
            isLoading={isCreating}
          />
        )}
      </Modal>
    </div>
  );
}
