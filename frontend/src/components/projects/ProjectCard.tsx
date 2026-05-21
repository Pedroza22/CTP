import { Project } from '@/lib/types';
import { Calendar, MoreVertical, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/components/ui/Button';

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
  onEdit?: () => void;
}

export function ProjectCard({ project, onClick, onEdit }: ProjectCardProps) {
  const statusConfig = {
    active: { label: 'Activo', color: 'bg-blue-100 text-blue-700', icon: Clock },
    completed: { label: 'Completado', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
    on_hold: { label: 'En pausa', color: 'bg-yellow-100 text-yellow-700', icon: AlertCircle },
    cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-700', icon: AlertCircle },
  };

  const status = project.status as keyof typeof statusConfig;
  const { label, color, icon: Icon } = statusConfig[status] || statusConfig.active;

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xl shadow-gray-200/50 hover:scale-[1.02] transition-all cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-6">
        <span className={cn('px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center', color)}>
          <Icon className="w-3 h-3 mr-1.5" />
          {label}
        </span>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.();
          }}
          className="p-1 rounded-full text-gray-400 hover:bg-gray-50 transition-colors"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
      <h3 className="text-xl font-black text-gray-900 mb-2 truncate group-hover:text-blue-600 transition-colors">{project.name}</h3>
      <p className="text-gray-500 text-sm mb-6 line-clamp-2 min-h-[40px] font-medium">{project.description}</p>
      
      <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400 mt-auto pt-6 border-t border-gray-50">
        <Calendar className="w-3.5 h-3.5 mr-2 text-blue-500" />
        <span>{project.start_date} {project.end_date ? `- ${project.end_date}` : ''}</span>
      </div>
    </div>
  );
}
