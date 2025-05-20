import React, { useState, useEffect, useContext } from "react";
import { getCompanyByUsername, updateCompany } from "../../../api/api";
import { AuthContext } from "../../../context/AuthContext";
import { formatDate } from "../../../utils/formateDate";
import { Modal } from "../../../components/common/Modal";
import toast from "react-hot-toast";
import { Pencil, X } from "lucide-react";
import Button from "../../../components/common/Button";

interface CompanyData {
  viewCount: number;
  id: number;
  name: string;
  username: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
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

const CompanyProfile = () => {
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (user?.username) {
      loadCompany();
    }
  }, [user?.username]);

  const loadCompany = async () => {
    setLoading(true);
    try {
      const response = await getCompanyByUsername(user.username);
      setCompany(response.data);
    } catch (error) {
      console.error("Error loading company:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCompany = () => {
    setIsModalOpen(true);
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

    formData.delete("logo");

    if (imageFile) {
      formData.append("logo", imageFile);
    }

    console.log("FormData entries:", Array.from(formData.entries()));

    setIsLoading(true);

    try {
      if (company) {
        const response = await updateCompany(company.id, formData);
        setCompany(response.data);
        toast.success("Company updated successfully");
      }
      setIsModalOpen(false);
      setImageFile(null);
    } catch (error) {
      toast.error("Error saving company");
      console.error("Error saving company:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || !company) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="space-y-6">
        {/* Company Header */}
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          {company.logo && (
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
              <img
                src={`http://localhost:5000${company.logo}`}
                alt={company.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold text-gray-900">{company.name}</h2>
            <p className="text-gray-600">{company.location}</p>
            <div className="flex gap-2 mt-2">
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Website
                </a>
              )}
              {company.facebook && (
                <a
                  href={company.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Facebook
                </a>
              )}
              {/* Add other social links similarly */}
            </div>
          </div>
        </div>

        {/* Company Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p className="mt-1 text-gray-900">
                {company.email || "Not provided"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Phone</h3>
              <p className="mt-1 text-gray-900">
                {company.phone || "Not provided"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Location</h3>
              <p className="mt-1 text-gray-900">
                {company.location || "Not provided"}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  company.status === "APPROVED"
                    ? "bg-green-100 text-green-800"
                    : company.status === "PENDING"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {company.status}
              </span>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Member Since
              </h3>
              <p className="mt-1 text-gray-900">
                {formatDate(company.createdAt)}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Views</h3>
              <p className="mt-1 text-gray-900">{company.viewCount}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-sm font-medium text-gray-500">About</h3>
          <p className="mt-1 text-gray-900 whitespace-pre-line">
            {company.description || "No description provided"}
          </p>
        </div>

        {/* Categories */}
        {(company.categories?.length ?? 0) > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">Categories</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {company.categories?.map((category) => (
                <span
                  key={category.id}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {category.name}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end mt-8">
          <Button 
            variant="primary" 
            onClick={handleEditCompany}
            className="flex items-center gap-2"
          >
            <Pencil size={16} /> 
            Edit Profile
          </Button>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="relative bg-white rounded-lg shadow">
          <div className="flex items-start justify-between p-4 border-b rounded-t">
            <h3 className="text-xl font-semibold text-gray-900">
              Edit Company
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
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    defaultValue={company.name || ""}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="username"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Username *
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    defaultValue={company.username || ""}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                    required
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    defaultValue={company.email || ""}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    defaultValue={company.phone || ""}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label
                  htmlFor="location"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  defaultValue={company.location || ""}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                />
              </div>

              {/* Social Media */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="website"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    id="website"
                    defaultValue={company.website || ""}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  />
                </div>
                <div>
                  <label
                    htmlFor="facebook"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Facebook
                  </label>
                  <input
                    type="url"
                    name="facebook"
                    id="facebook"
                    defaultValue={company.facebook || ""}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  />
                </div>
                <div>
                  <label
                    htmlFor="instagram"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Instagram
                  </label>
                  <input
                    type="url"
                    name="instagram"
                    id="instagram"
                    defaultValue={company.instagram || ""}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  />
                </div>
                <div>
                  <label
                    htmlFor="linkedin"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    name="linkedin"
                    id="linkedin"
                    defaultValue={company.linkedin || ""}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  />
                </div>
                <div>
                  <label
                    htmlFor="twitter"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Twitter
                  </label>
                  <input
                    type="url"
                    name="twitter"
                    id="twitter"
                    defaultValue={company.twitter || ""}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  />
                </div>
              </div>

              {/* Logo Upload */}
              <div>
                <label
                  htmlFor="logo"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
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
                {company.logo && (
                  <p className="mt-1 text-xs text-gray-500">
                    Current logo: {company.logo}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={4}
                  defaultValue={company.description || ""}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                ></textarea>
              </div>
            </div>
            <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b">
              <Button variant="primary" type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Update Company"}
              </Button>
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default CompanyProfile;
