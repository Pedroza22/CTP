'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { Modal } from '@/components/ui/Modal';
import { ProjectForm } from '@/components/projects/ProjectForm';
import { useProjects } from '@/lib/hooks/useProjects';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function ProjectsPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { projects, isLoading, createProject, isCreating } = useProjects();
  const { user } = useAuth();

  const handleCreateProject = (data: any) => {
    createProject(data, {
      onSuccess: () => setIsModalOpen(false),
    });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 rounded-lg bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Proyectos</h1>
          <p className="text-gray-500">Gestiona todos tus proyectos en un solo lugar.</p>
        </div>
        {user?.role === 'ADMIN' && (
          <Button 
            className="flex items-center gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Nuevo Proyecto
          </Button>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500 mb-4">No hay proyectos todavía.</p>
          {user?.role === 'ADMIN' && (
            <Button variant="outline" onClick={() => setIsModalOpen(true)}>Crea tu primer proyecto</Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onClick={() => router.push(`/projects/${project.id}`)}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nuevo Proyecto"
      >
        <ProjectForm 
          onSubmit={handleCreateProject}
          isLoading={isCreating}
        />
      </Modal>
    </div>
  );
}
