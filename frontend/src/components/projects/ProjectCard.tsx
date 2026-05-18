import { Project } from '@/lib/types';
import { Calendar, MoreVertical, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/components/ui/Button';

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const statusConfig = {
    ACTIVE: { label: 'Activo', color: 'bg-blue-100 text-blue-700', icon: Clock },
    COMPLETED: { label: 'Completado', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
    ON_HOLD: { label: 'En pausa', color: 'bg-yellow-100 text-yellow-700', icon: AlertCircle },
  };

  const { label, color, icon: Icon } = statusConfig[project.status] || statusConfig.ACTIVE;

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center', color)}>
          <Icon className="w-3 h-3 mr-1" />
          {label}
        </span>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">{project.name}</h3>
      <p className="text-gray-500 text-sm mb-4 line-clamp-2 min-h-[40px]">{project.description}</p>
      
      <div className="flex items-center text-xs text-gray-400 mt-auto pt-4 border-t border-gray-50">
        <Calendar className="w-3 h-3 mr-1" />
        <span>{project.start_date} - {project.end_date}</span>
      </div>
    </div>
  );
}
