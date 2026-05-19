import { Task } from '@/lib/types';
import { Calendar, MessageSquare, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { cn } from '@/components/ui/Button';
import Image from 'next/image';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const statusConfig = {
    pending: { label: 'Pendiente', color: 'bg-gray-100 text-gray-700', icon: Clock },
    in_progress: { label: 'En progreso', color: 'bg-blue-100 text-blue-700', icon: Clock },
    done: { label: 'Completado', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
    blocked: { label: 'Bloqueado', color: 'bg-red-100 text-red-700', icon: AlertCircle },
  };

  const priorityConfig = {
    low: 'bg-gray-50 text-gray-600',
    medium: 'bg-blue-50 text-blue-600',
    high: 'bg-orange-50 text-orange-600',
    critical: 'bg-red-50 text-red-600',
  };

  const status = task.status as keyof typeof statusConfig;
  const { label, color, icon: Icon } = statusConfig[status] || statusConfig.pending;

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl border border-gray-100 p-5 shadow-lg shadow-gray-200/30 hover:shadow-xl transition-all cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-4">
        <span className={cn('px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center', color)}>
          <Icon className="w-3 h-3 mr-1" />
          {label}
        </span>
        <span className={cn('px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest', priorityConfig[task.priority])}>
          {task.priority}
        </span>
      </div>
      
      <h4 className="text-base font-black text-gray-900 mb-2 truncate group-hover:text-blue-600 transition-colors">{task.title}</h4>
      <p className="text-gray-500 text-xs mb-4 line-clamp-2 font-medium">{task.description}</p>
      
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
        <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
          <Calendar className="w-3 h-3 mr-1.5 text-blue-500" />
          <span>{task.due_date ? new Date(task.due_date).toLocaleDateString() : 'Sin fecha'}</span>
        </div>
        
        <div className="flex items-center space-x-3">
          {task.comment_count !== undefined && task.comment_count > 0 && (
            <div className="flex items-center text-gray-400">
              <MessageSquare className="w-3 h-3 mr-1" />
              <span className="text-[10px] font-bold">{task.comment_count}</span>
            </div>
          )}
          
          <div className="h-6 w-6 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center overflow-hidden relative">
            {task.assigned_to_detail?.avatar_url ? (
              <Image src={task.assigned_to_detail.avatar_url} alt={task.assigned_to_detail.username} fill className="object-cover" />
            ) : (
              <span className="text-[8px] font-black text-blue-600 uppercase">
                {task.assigned_to_detail?.username.substring(0, 2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
