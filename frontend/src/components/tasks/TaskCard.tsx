import { Task } from '@/lib/types';
import { Calendar, User, AlertCircle, CheckCircle2, Clock, MoreHorizontal } from 'lucide-react';
import { cn } from '@/components/ui/Button';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const statusConfig = {
    PENDING: { label: 'Pendiente', color: 'bg-gray-100 text-gray-700', icon: Clock },
    IN_PROGRESS: { label: 'En progreso', color: 'bg-blue-100 text-blue-700', icon: Clock },
    DONE: { label: 'Completada', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
    BLOCKED: { label: 'Bloqueada', color: 'bg-red-100 text-red-700', icon: AlertCircle },
  };

  const priorityConfig = {
    LOW: { label: 'Baja', color: 'text-gray-500' },
    MEDIUM: { label: 'Media', color: 'text-yellow-600' },
    HIGH: { label: 'Alta', color: 'text-red-600' },
  };

  const status = statusConfig[task.status] || statusConfig.PENDING;
  const priority = priorityConfig[task.priority] || priorityConfig.MEDIUM;

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex justify-between items-start mb-3">
        <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider', status.color)}>
          {status.label}
        </span>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
      
      <h4 className="text-sm font-semibold text-gray-900 mb-1 truncate">{task.title}</h4>
      <p className="text-xs text-gray-500 line-clamp-2 mb-4 h-8">{task.description}</p>
      
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
        <div className="flex items-center space-x-2">
          <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="h-3 w-3 text-blue-600" />
          </div>
          <span className="text-[10px] text-gray-500 truncate max-w-[80px]">
            {task.assigned_to_detail?.username || 'Sin asignar'}
          </span>
        </div>
        
        <div className="flex items-center space-x-2 text-[10px]">
          <span className={cn('font-medium', priority.color)}>
            {priority.label}
          </span>
          <div className="flex items-center text-gray-400">
            <Calendar className="w-3 h-3 mr-1" />
            <span>{task.due_date}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
