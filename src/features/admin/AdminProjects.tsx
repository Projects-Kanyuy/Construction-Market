import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import { Plus, Pencil, Trash2, Calendar, X } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { fetchProjects, createProject, updateProject, deleteProject, fetchAllProjects } from '../../api/api';

interface ProjectData {
  id: string;
  title: string;
  companyId: string;
  company?: any;
  year: number;
  description?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  location?: string;
}

const AdminProjects = () => {
  const location = useLocation();
  const { company } = location.state || {};
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<ProjectData | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<ProjectData | null>(null);
  
  

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const response = company ? await fetchProjects(company?.id) : await fetchAllProjects();
      setProjects(response.data);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    formData.delete('image');
    if (imageFile) {
      formData.append('image', imageFile);
    }

    setIsLoading(true);

    try {
      if (currentProject) {
        const response = await updateProject(company.id, currentProject.id, formData);
        setProjects(projects.map(p => p.id === currentProject.id ? response.data : p));
      } else {
        const response = await createProject(Number(company.id), form);
        setProjects([response.data, ...projects]);
      }
      setIsModalOpen(false);
      toast.success('saved successfully!')
    } catch (error) {
      toast.error('Fail to save');
      console.error('Error saving project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProject = () => {
    setCurrentProject(null);
    setIsModalOpen(true);
  };

  const handleEditProject = (project: ProjectData) => {
    setCurrentProject(project);
    setIsModalOpen(true);
  };

  const handleDeleteProject = (project: ProjectData) => {
    setProjectToDelete(project);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;
    setIsLoading(true);
    try {
      await deleteProject(projectToDelete.companyId, projectToDelete.id);
      setProjects(projects.filter(p => p.id !== projectToDelete.id));
      setIsDeleteModalOpen(false);
      toast.success('Project deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete project');
      console.error('Error deleting project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
        {company && (
          <Button
          variant="primary"
          size="small"
          onClick={handleAddProject}
          icon={<Plus size={16} />}
        >
          Add Project
        </Button>
        )}
        
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Year
                </th>
                {company && (
                  <>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                  </>
                )}
                
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {projects.map((project) => (
                <tr key={project.id}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{project.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-900">{ company ? company.name : project.company.name }</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={'inline-flex rounded-full px-2 text-xs font-semibold leading-5'}>
                      {project.location || ''}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center text-sm text-gray-900">
                      <Calendar size={14} className="mr-1" />
                      {project.year}
                    </div>
                  </td>
                  {company && (
                    <>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditProject(project)}
                        className="mr-2 text-indigo-600 hover:text-indigo-900"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {company && (
        <>
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="relative bg-white rounded-lg shadow">
            <div className="flex items-start justify-between p-4 border-b rounded-t">
              <h3 className="text-xl font-semibold text-gray-900">
                {currentProject ? 'Edit Project' : 'Add New Project'}
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <div>
                  <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    defaultValue={currentProject?.title || ''}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block mb-2 text-sm font-medium text-gray-900">
                    Location
                  </label>
                  <input
                    name="location"
                    id="location"
                    defaultValue={currentProject?.location || ''}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  />
                </div>

                <div>
                  <label htmlFor="year" className="block mb-2 text-sm font-medium text-gray-900">
                    Year *
                  </label>
                  <input
                    type="number"
                    name="year"
                    id="year"
                    defaultValue={currentProject?.year || ''}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900">
                    Description
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    rows={4}
                    defaultValue={currentProject?.description || ''}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  ></textarea>
                </div>

                <div>
                  <label htmlFor="image" className="block mb-2 text-sm font-medium text-gray-900">
                    Project Image
                  </label>
                  <input
                    type="file"
                    name="image"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-indigo-50 file:text-indigo-700
                      hover:file:bg-indigo-100"
                  />
                  {currentProject?.image && (
                    <p className="mt-1 text-xs text-gray-500">
                      Current image: {currentProject.image}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b">
                <Button variant="primary" type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : currentProject ? 'Update Project' : 'Add Project'}
                </Button>
                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </Modal>

        <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
          <div className="relative bg-white rounded-lg shadow">
            <div className="flex items-start justify-between p-4 border-b rounded-t">
              <h3 className="text-xl font-semibold text-gray-900">Delete Project</h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete the project?
              </p>
              <div className="flex items-center space-x-2">
                <Button variant="primary" onClick={confirmDelete} disabled={isLoading}>
                  {isLoading ? 'Deleting...' : 'Delete'}
                </Button>
                <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </Modal>
        </>
      )}
      
    </div>
  );
};

export default AdminProjects;