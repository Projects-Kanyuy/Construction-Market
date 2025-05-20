import React, { useState } from 'react';
import Button from '../../../components/common/Button';
import { Plus, Pencil, Trash2, Calendar } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  year: number;
}

const CompanyProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      title: 'Modern Office Complex',
      description: 'A state-of-the-art office complex with sustainable features and modern amenities.',
      imageUrl: 'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg',
      year: 2023
    },
    {
      id: '2',
      title: 'Residential Development',
      description: 'Luxury residential development featuring 50 premium apartments with smart home technology.',
      imageUrl: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg',
      year: 2022
    }
  ]);

  const handleAddProject = () => {
    // Handle adding new project
    console.log('Add new project');
  };

  const handleEditProject = (projectId: string) => {
    // Handle editing project
    console.log('Edit project:', projectId);
  };

  const handleDeleteProject = (projectId: string) => {
    // Handle deleting project
    console.log('Delete project:', projectId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
        <Button
          variant="primary"
          size="small"
          onClick={handleAddProject}
          icon={<Plus size={16} />}
        >
          Add Project
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <div
            key={project.id}
            className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={project.imageUrl}
                alt={project.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute right-2 top-2 flex space-x-2">
                <button
                  onClick={() => handleEditProject(project.id)}
                  className="rounded-full bg-white/90 p-2 text-gray-700 shadow-sm transition-colors hover:bg-white"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDeleteProject(project.id)}
                  className="rounded-full bg-white/90 p-2 text-red-600 shadow-sm transition-colors hover:bg-white"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {project.title}
                </h3>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar size={14} className="mr-1" />
                  {project.year}
                </div>
              </div>
              <p className="text-sm text-gray-600">{project.description}</p>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No projects yet
          </h3>
          <p className="text-gray-600">
            Add your first project to showcase your work.
          </p>
        </div>
      )}
    </div>
  );
};

export default CompanyProjects;