import instance from './axiosInstance';

export const registerUser = (formData: Record<string, any>) => instance.post('/users/register', formData);

export const loginUser = (formData: Record<string, any>) => instance.post('/users/login', formData);

export const listUsers = () => instance.get('/users');

export const updateUser = (id: string | number, formData: Record<string, any>) => instance.put(`/users/${id}`, formData);

export const deleteUser = (id: string | number) => instance.delete(`/users/${id}`);

export const fetchCompanies = () => instance.get('/companies');
export const fetchCompanyById = (id: string | number) => instance.get(`/companies/by_id/${id}`);
// export const fetchCompanies = (lat: number, lon: number) => instance.get('/companies/by_location', { params: { lat, lon } });

export const getCompanyByUsername = (username: string) => instance.get(`/companies/${username}`);

export const getCompaniesByCategory = (categoryId: string | number) => instance.get(`/companies/category/${categoryId}`);
export const getProjectsByCompany = (companyUsername: string) => instance.get(`/companies/${companyUsername}/projects`);

export const getFeaturedCompanies = () => instance.get('/companies/view-count/featured');

export const createCompany = (formData: Record<string, any>) =>
  instance.post('/companies', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updateCompany = (id: string | number, formData: Record<string, any>) =>
  instance.put(`/companies/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const updateCompanyStatus = (id: string | number, status: string) =>
  instance.patch(`/companies/${id}/status`, { status });

export const deleteCompany = (id: string | number) => instance.delete(`/companies/${id}`);

export const incrementCompanyViewCount = (id: string | number) =>
  instance.post(`/companies/${id}/increment-view`);

export const fetchCategories = () => instance.get('/categories');

export const createCategory = (formData: Record<string, any>) =>
  instance.post('/categories', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
});

export const updateCategory = (id: string | number, formData: Record<string, any>) =>
  instance.put(`/categories/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
});

export const deleteCategory = (id: string | number) => instance.delete(`/categories/${id}`);

export const fetchProjects = (username: string) => instance.get(`/companies/${username}/projects`);
export const fetchAllProjects = () => instance.get('/companies/projects');
export const createProject = (id: string | number, formData: Record<string, any>) => instance.post(`/companies/${id}/projects`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
});
export const updateProject = (id: string | number, projectId: string | number, formData: Record<string, any>) => instance.put(`/companies/${id}/projects/${projectId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
});
export const deleteProject = (id: string | number, projectId: string | number) => instance.delete(`/companies/${id}/projects/${projectId}`);

export const incrementContactClicks = (id: string | number) =>
  instance.post(`/companies/${id}/contact-click`);

export const logActivity = (formData: Record<string, any>) =>
  instance.post('/activity_logs', formData);
