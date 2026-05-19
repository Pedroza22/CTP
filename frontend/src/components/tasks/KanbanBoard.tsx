'use client';

import { Task } from '@/lib/types';
import { TaskCard } from './TaskCard';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface KanbanBoardProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  onAddTask?: (status: Task['status']) => void;
}

const columns: { title: string; status: Task['status']; color: string }[] = [
  { title: 'Pendientes', status: 'pending', color: 'bg-gray-100' },
  { title: 'En Progreso', status: 'in_progress', color: 'bg-blue-100' },
  { title: 'Completadas', status: 'done', color: 'bg-green-100' },
  { title: 'Bloqueadas', status: 'blocked', color: 'bg-red-100' },
];

export function KanbanBoard({ tasks, onTaskClick, onAddTask }: KanbanBoardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 h-full min-h-[500px]">
      {columns.map((column) => {
        const columnTasks = tasks.filter((t) => t.status === column.status);
        
        return (
          <div key={column.status} className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center space-x-2">
                <div className={`h-2.5 w-2.5 rounded-full ${column.color.replace('100', '500')}`} />
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">{column.title}</h3>
                <span className="ml-2 px-2 py-0.5 rounded-lg bg-gray-100 text-[10px] font-bold text-gray-500">
                  {columnTasks.length}
                </span>
              </div>
              <button 
                onClick={() => onAddTask?.(column.status)}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            
            <div className={`flex-1 rounded-3xl p-3 space-y-4 transition-colors ${column.color}/30 min-h-[200px] border-2 border-dashed border-transparent hover:border-gray-200`}>
              {columnTasks.map((task, idx) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <TaskCard 
                    task={task} 
                    onClick={() => onTaskClick?.(task)} 
                  />
                </motion.div>
              ))}
              
              {columnTasks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Sin tareas</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
  }
