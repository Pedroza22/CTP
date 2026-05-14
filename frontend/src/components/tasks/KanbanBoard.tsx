'use client';

import { Task } from '@/lib/types';
import { TaskCard } from './TaskCard';
import { Plus } from 'lucide-react';

interface KanbanBoardProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  onAddTask?: (status: Task['status']) => void;
}

const COLUMNS: { id: Task['status']; title: string; color: string }[] = [
  { id: 'PENDING', title: 'Pendientes', color: 'bg-gray-100' },
  { id: 'IN_PROGRESS', title: 'En Progreso', color: 'bg-blue-50' },
  { id: 'DONE', title: 'Completadas', color: 'bg-green-50' },
  { id: 'BLOCKED', title: 'Bloqueadas', color: 'bg-red-50' },
];

export function KanbanBoard({ tasks, onTaskClick, onAddTask }: KanbanBoardProps) {
  return (
    <div className="flex gap-6 overflow-x-auto pb-6 min-h-[600px]">
      {COLUMNS.map((column) => {
        const columnTasks = tasks.filter((t) => t.status === column.id);

        return (
          <div key={column.id} className="flex-shrink-0 w-80 flex flex-col">
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-700">{column.title}</h3>
                <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">
                  {columnTasks.length}
                </span>
              </div>
              {onAddTask && (
                <button 
                  onClick={() => onAddTask(column.id)}
                  className="p-1 hover:bg-gray-200 rounded-md text-gray-500 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className={cn('flex-1 rounded-xl p-3 space-y-4 border-2 border-dashed border-transparent transition-colors', column.color)}>
              {columnTasks.map((task) => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onClick={() => onTaskClick?.(task)}
                />
              ))}
              {columnTasks.length === 0 && (
                <div className="flex flex-col items-center justify-center h-32 text-gray-400 text-sm italic">
                  No hay tareas
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

import { cn } from '../ui/Button';
