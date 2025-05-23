import React, { useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import { Plus, Pencil, Trash2, Building2, ExternalLink, X } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { 
  fetchCompanies,
  createCompany, 
  updateCompany, 
  updateCompanyStatus, 
  deleteCompany,
  fetchCategories
} from '../../api/api';

interface CompanyData {
  id: number;
  name: string;
  username: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  location?: string;
  phone?: string;
  email?: string;
  description?: string;
  logo?: string;
  categories?: { id: number; name: string }[];
  projects?: any[];
  website?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  createdAt: string;
  updatedAt: string;
}

const AdminCompanies = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [categories, setCategories] = useState<Record<string, any>>([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [currentCompany, setCurrentCompany] = useState<CompanyData | null>(null);
  const [companyToDelete, setCompanyToDelete] = useState<number | null>(null);
  const [newStatus, setNewStatus] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  

    useEffect(() => {
      loadCompanies();
      loadCategories();
    }, []);

    const loadCompanies = async () => {
      setLoading(true);
      try {
        const response = await fetchCompanies();
        setCompanies(response.data);
      } catch (error) {
        console.error("Error loading companies:", error);
      } finally {
        setLoading(false);
      }
    };

    const loadCategories = async () => {
    try {
      const response = await fetchCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleAddCompany = () => {
    setCurrentCompany(null);
    setIsModalOpen(true);
    setSelectedCategories([])
  };

  const handleEditCompany = (company: CompanyData) => {
    setCurrentCompany(company);
    setIsModalOpen(true);
  };

  const handleDeleteCompany = (id: number) => {
    setCompanyToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleStatusChange = (company: CompanyData) => {
    setCurrentCompany(company);
    setNewStatus(company.status);
    setIsStatusModalOpen(true);
  };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        setImageFile(e.target.files[0]);
      }
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedOptions = Array.from(e.target.selectedOptions, option => parseInt(option.value));
      setSelectedCategories(selectedOptions);
    };

  const confirmStatusChange = async () => {
    if (!currentCompany) return;
    setIsLoading(true);
    try {
      await updateCompanyStatus(currentCompany.id, newStatus);
      setCompanies(companies.map(c => 
        c.id === currentCompany.id ? { ...c, status: newStatus } : c
      ));
      setIsStatusModalOpen(false);
      toast.success('Status updated successfully');
    } catch (error) {
      toast.error('Error updating status');
      console.error('Error updating status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!companyToDelete) return;
    setIsLoading(true);
    try {
      await deleteCompany(companyToDelete);
      setCompanies(companies.filter(c => c.id !== companyToDelete));
      setIsDeleteModalOpen(false);
      toast.success('Company deleted successfully');
    } catch (error) {
      toast.error('Error deleting company');
      console.error('Error deleting company:', error);
    } finally {
      setIsLoading(false);
    }
  };

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const form = e.currentTarget;

  const formData = new FormData(form);

  formData.delete('categoryIds');
  formData.delete('categories');
  formData.delete('logo');

  if (imageFile) {
    formData.append('logo', imageFile);
  }

    formData.delete('categoryIds');
    
    if (selectedCategories.length > 0) {
      formData.append('categoryIds', JSON.stringify(selectedCategories));
    }

    setIsLoading(true);
    
    try {
      if (currentCompany) {
        const response = await updateCompany(currentCompany.id, formData);
        setCompanies(companies.map(c => 
          c.id === currentCompany.id ? response.data : c
        ));
        toast.success('Company updated successfully');
      } else {
        const response = await createCompany(formData);
        setCompanies([response.data, ...companies]);
        toast.success('Company created successfully');
      }
      setIsModalOpen(false);
      setImageFile(null);
    } catch (error) {
      toast.error('Error saving company');
      console.error('Error saving company:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Companies</h2>
        <Button
          variant="primary"
          size="small"
          onClick={handleAddCompany}
          icon={<Plus size={16} />}
        >
          Add Company
        </Button>
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
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Categories
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Projects
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {companies.map((company) => (
              <tr key={company.id}>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                      {company.logo ? (
                        <img 
                          src={`https://api.cpromart.site${company.logo}`} 
                          alt={company.name}
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <Building2 size={16} className="text-gray-600" />
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{company.name}</div>
                      <div className="text-sm text-gray-500">{company.username}</div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-900">{company.email}</div>
                  <div className="text-sm text-gray-500">{company.phone}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="space-y-1">
                  {company.categories?.map(category => (
                    <div 
                      key={category.id}
                      className="text-sm text-gray-900 bg-gray-50 px-3 py-1 rounded-md"
                    >
                      {category.name}
                    </div>
                  ))}
                </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      company.status === 'APPROVED'
                        ? 'bg-green-100 text-green-800'
                        : company.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {company.status}
                    </span>
                    <button
                      onClick={() => handleStatusChange(company)}
                      className="ml-1 text-gray-500 hover:text-indigo-600"
                    >
                      <Pencil size={14} />
                    </button>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <button
                    onClick={() => navigate('/admin/projects', { state: { company } })}
                    className="flex items-center text-indigo-600 hover:text-indigo-900"
                  >
                    {company.projects?.length || 0} Project(s)
                    <ExternalLink size={14} className="ml-1" />
                  </button>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <button
                    onClick={() => handleEditCompany(company)}
                    className="mr-2 text-indigo-600 hover:text-indigo-900"
                  >
                    <Pencil size={16} />
                  </button>
                  {user.role === 'SUPER_ADMIN' && (
                    <button
                    onClick={() => handleDeleteCompany(company.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={16} />
                  </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}

      {/* Add/Edit Company Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
  <div className="relative bg-white rounded-lg shadow">
    <div className="flex items-start justify-between p-4 border-b rounded-t">
      <h3 className="text-xl font-semibold text-gray-900">
        {currentCompany ? 'Edit Company' : 'Add New Company'}
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
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">
              Company Name *
            </label>
            <input
              type="text"
              name="name"
              id="name"
              defaultValue={currentCompany?.name || ''}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
              required
            />
          </div>
          <div>
            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900">
              Username *
            </label>
            <input
              type="text"
              name="username"
              id="username"
              defaultValue={currentCompany?.username || ''}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
              required
            />
          </div>
        </div>

        {!currentCompany && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
                Password *
              </label>
              <input
                type="password"
                name="password"
                id="password"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                required={!currentCompany}
              />
            </div>
          </div>
        )}

        <div>
          <label htmlFor="categories" className="block mb-2 text-sm font-medium text-gray-900">
            Categories
          </label>
          <select
            multiple
            name="categories"
            id="categories"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
            onChange={handleCategoryChange}
            defaultValue={currentCompany?.categories?.map(c => c.id.toString()) || selectedCategories.map(id => id.toString())}
          >
            {categories.map((category: any) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">
            Hold Ctrl (or Cmd on Mac) to select multiple categories
          </p>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              defaultValue={currentCompany?.email || ''}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              defaultValue={currentCompany?.phone || ''}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block mb-2 text-sm font-medium text-gray-900">
            Location
          </label>
          <input
            type="text"
            name="location"
            id="location"
            defaultValue={currentCompany?.location || ''}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
          />
        </div>

        {/* Social Media */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="website" className="block mb-2 text-sm font-medium text-gray-900">
              Website
            </label>
            <input
              type="url"
              name="website"
              id="website"
              defaultValue={currentCompany?.website || ''}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
            />
          </div>
          <div>
            <label htmlFor="facebook" className="block mb-2 text-sm font-medium text-gray-900">
              Facebook
            </label>
            <input
              type="url"
              name="facebook"
              id="facebook"
              defaultValue={currentCompany?.facebook || ''}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
            />
          </div>
          <div>
            <label htmlFor="instagram" className="block mb-2 text-sm font-medium text-gray-900">
              Instagram
            </label>
            <input
              type="url"
              name="instagram"
              id="instagram"
              defaultValue={currentCompany?.instagram || ''}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
            />
          </div>
          <div>
            <label htmlFor="linkedin" className="block mb-2 text-sm font-medium text-gray-900">
              LinkedIn
            </label>
            <input
              type="url"
              name="linkedin"
              id="linkedin"
              defaultValue={currentCompany?.linkedin || ''}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
            />
          </div>
          <div>
            <label htmlFor="twitter" className="block mb-2 text-sm font-medium text-gray-900">
              Twitter
            </label>
            <input
              type="url"
              name="twitter"
              id="twitter"
              defaultValue={currentCompany?.twitter || ''}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
            />
          </div>
        </div>

        {/* Logo Upload */}
        <div>
          <label htmlFor="logo" className="block mb-2 text-sm font-medium text-gray-900">
            Company Logo
          </label>
          <input
            type="file"
            name="logo"
            id="logo"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
          />
          {currentCompany?.logo && (
            <p className="mt-1 text-xs text-gray-500">
              Current logo: {currentCompany.logo}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            rows={4}
            defaultValue={currentCompany?.description || ''}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
          ></textarea>
        </div>
      </div>
      <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b">
        <Button variant="primary" type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : currentCompany ? 'Update Company' : 'Add Company'}
        </Button>
        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
          Cancel
        </Button>
      </div>
    </form>
  </div>
</Modal>

      {/* Status Change Modal */}
      <Modal isOpen={isStatusModalOpen} onClose={() => setIsStatusModalOpen(false)}>
        <div className="relative bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Update Status for {currentCompany?.name}
            </h3>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as any)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mb-4"
            >
              <option value="PENDING">PENDING</option>
              <option value="APPROVED">APPROVED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
            <div className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={() => setIsStatusModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={confirmStatusChange} disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Status'}
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <div className="relative bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Delete Company
            </h3>
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete this company? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={confirmDelete} disabled={isLoading}>
                {isLoading ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminCompanies;