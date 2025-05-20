import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Button from '../../components/common/Button';
import { Building2 } from 'lucide-react';

import { registerUser, createCompany, fetchCategories } from '../../api/api'

const RegisterPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'yourself' | 'company'>('yourself');
  const navigate = useNavigate();  const [categories, setCategories] = useState<Record<string, any>>([]);
  const [loading, setLoading] = useState(false);

  const [userForm, setUserForm] = useState({
    username: '',
    password: '',
    name: '',
    contact: '',
    email: '',
    location: ''
  });

  const [companyForm, setCompanyForm] = useState<{
    name: string;
    username: string;
    password: string;
    location: string;
    phone: string;
    email: string;
    categoryIds: number[];
    description: string;
    logo: File | null;
    facebook: string;
    instagram: string;
    linkedin: string;
    twitter: string;
    website: string;
  }>({
    name: '',
    username: '',
    password: '',
    location: '',
    phone: '',
    email: '',
    description: '',
    logo: null,
    facebook: '',
    instagram: '',
    categoryIds: [],
    linkedin: '',
    twitter: '',
    website: ''
  });

      useEffect(() => {
        loadCategories();
      }, []);

          const loadCategories = async () => {
          try {
            const response = await fetchCategories();
            setCategories(response.data);
          } catch (error) {
            console.error('Error loading categories:', error);
          }
        };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      if (activeTab === 'yourself') {
        await registerUser(userForm);
        toast.success("Registration successful!");
        navigate('/');
      } else {
        const formData = new FormData();
      
      const { categoryIds, logo, ...otherFields } = companyForm;
      Object.entries(otherFields).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      if (logo) {
        formData.append('logo', logo);
      }

      formData.append('categoryIds', JSON.stringify(categoryIds));
      
      console.log('FormData:', Array.from(formData.entries()));
        await createCompany(companyForm);
        toast.success("Registration successful! Your account is unders Review. We will contact you within 2 day. You can  feel free to reach to us if we take more than the said number of days",  { duration: 10000 });
        navigate('/');
      }
    
    } catch (error) {
      toast.error("Registration failed!");
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Register
            </h1>
          </div>

          <div className="mt-8 flex justify-center space-x-4">
            <button
              onClick={() => setActiveTab('yourself')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'yourself' ? 'bg-[#3B546A] text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              Yourself
            </button>
            <button
              onClick={() => setActiveTab('company')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'company' ? 'bg-[#3B546A] text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              Your Company
            </button>
          </div>

          <div className="mt-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {activeTab === 'yourself' ? (
                <>
                  <Input label="Username" value={userForm.username} required onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserForm({ ...userForm, username: e.target.value })} />
                  <Input label="Password" type="password" value={userForm.password} required onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserForm({ ...userForm, password: e.target.value })} />
                  <Input label="Name" value={userForm.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserForm({ ...userForm, name: e.target.value })} />
                  <Input label="Contact" value={userForm.contact} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserForm({ ...userForm, contact: e.target.value })} />
                  <Input label="Email" type="email" value={userForm.email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserForm({ ...userForm, email: e.target.value })} />
                  <Input label="Location" value={userForm.location} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserForm({ ...userForm, location: e.target.value })} />
                </>
              ) : (
                <>
                  <Input label="Company Name *" value={companyForm.name} required onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompanyForm({ ...companyForm, name: e.target.value })} />
                  <Input placeholder="Remember your company username, you will need it to login." label="Username *" value={companyForm.username} required onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompanyForm({ ...companyForm, username: e.target.value })} />
                  <Input placeholder="Remember your password, you will need it during login." label="Password *" type="password" value={companyForm.password} required onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompanyForm({ ...companyForm, password: e.target.value })} />
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900">
                        Categories *
                      </label>
                      <select
                        multiple
                        name="categories"
                        id="categories"
                        required
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                        onChange={e => setCompanyForm({
                          ...companyForm,
                          categoryIds: Array.from(e.target.selectedOptions, option => parseInt(option.value))
                        })}
                        defaultValue={''}
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
                  <Input label="Location *" required value={companyForm.location} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompanyForm({ ...companyForm, location: e.target.value })} />
                  <Input label="Phone *" required value={companyForm.phone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompanyForm({ ...companyForm, phone: e.target.value })} />
                  <Input label="Email" type="email" value={companyForm.email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompanyForm({ ...companyForm, email: e.target.value })} />
                  <Input label="Description" value={companyForm.description} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompanyForm({ ...companyForm, description: e.target.value })} />
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Logo</label>
                    <input type="file" accept="image/*" onChange={e => setCompanyForm({ ...companyForm, logo: e.target.files?.[0] || null })} />
                  </div>
                  <Input label="Facebook" value={companyForm.facebook} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompanyForm({ ...companyForm, facebook: e.target.value })} />
                  <Input label="Instagram" value={companyForm.instagram} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompanyForm({ ...companyForm, instagram: e.target.value })} />
                  <Input label="LinkedIn" value={companyForm.linkedin} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompanyForm({ ...companyForm, linkedin: e.target.value })} />
                  <Input label="Twitter" value={companyForm.twitter} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompanyForm({ ...companyForm, twitter: e.target.value })} />
                  <Input label="Website" value={companyForm.website} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompanyForm({ ...companyForm, website: e.target.value })} />
                </>
              )}
              <Button
                type="submit"
                disabled={loading}
                variant="primary"
                fullWidth
                icon={<Building2 size={18} />}
              >
                {loading ? "Registering..." : "Register"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const Input = ({ label, type = 'text', ...props }: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#3B546A] focus:outline-none focus:ring-1 focus:ring-[#3B546A]"
      {...props}
    />
  </div>
);

export default RegisterPage;
