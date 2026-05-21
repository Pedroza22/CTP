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
import { ProjectFormValues } from '@/lib/validations/project';
import { Project } from '@/lib/types';
import { Trash2 } from 'lucide-react';

export default function ProjectsPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { projects, isLoading, createProject, isCreating, deleteProject, updateProject, isUpdating } = useProjects();
  const { user } = useAuth();

  const handleCreateProject = async (data: ProjectFormValues) => {
    try {
      await createProject(data);
      setIsModalOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProject(id);
      setIsModalOpen(false);
      setSelectedProject(null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateProject = async (data: ProjectFormValues) => {
    if (!selectedProject) return;
    try {
      await updateProject({ id: selectedProject.id, ...data });
      setIsModalOpen(false);
      setSelectedProject(null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
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
        {user?.role === 'admin' && (
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
          {user?.role === 'admin' && (
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
              onEdit={() => handleEditProject(project)}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProject(null);
        }}
        title={selectedProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}
      >
        {selectedProject ? (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button 
                onClick={() => {
                  if (confirm('¿Estás seguro de que deseas eliminar este proyecto?')) {
                    handleDeleteProject(selectedProject.id);
                  }
                }}
                className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest"
              >
                <Trash2 className="h-4 w-4" />
                Eliminar Proyecto
              </button>
            </div>
            <ProjectForm 
              initialData={selectedProject}
              onSubmit={handleUpdateProject}
              isLoading={isUpdating}
            />
          </div>
        ) : (
          <ProjectForm 
            onSubmit={handleCreateProject}
            isLoading={isCreating}
          />
        )}
      </Modal>
    </div>
  );
}
