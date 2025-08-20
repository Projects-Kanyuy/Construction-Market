import React, { useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";
import { Plus, Pencil, Trash2, LayoutGrid, X } from "lucide-react";
import { Modal } from "../../components/common/Modal";
import { AuthContext } from "../../context/AuthContext";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../api/api";
import { formatDate } from "../../utils/formateDate";

interface CategoryData {
  id: number;
  name: string;
  image: string;
  description?: string;
  companies?: number;
  createdAt: string;
  updatedAt: string;
}

const AdminCategories = () => {
  const { user } = useContext(AuthContext);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<CategoryData | null>(
    null
  );
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const response = await fetchCategories();
      setCategories(response.data);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    setCurrentCategory(null);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: CategoryData) => {
    setCurrentCategory(category);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = (id: number) => {
    setCategoryToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", (e.target as any).name.value);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      setIsLoading(true);
      if (currentCategory) {
        const response = await updateCategory(currentCategory.id, formData);
        setCategories(
          categories.map((c) =>
            c.id === currentCategory.id ? response.data : c
          )
        );
        toast.success("Category updated successfully!");
      } else {
        const response = await createCategory(formData);
        setCategories([response.data, ...categories]);
        toast.success("Category added successfully!");
      }
      setIsModalOpen(false);
      setImageFile(null);
    } catch (error) {
      toast.error("Failed to updated category");
      console.error("Error saving category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      setIsLoading(true);
      await deleteCategory(categoryToDelete);
      setCategories(categories.filter((c) => c.id !== categoryToDelete));
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
      toast.success("Category deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete categroy");
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
        <Button
          variant="primary"
          size="small"
          onClick={handleAddCategory}
          icon={<Plus size={16} />}
        >
          Add Category
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
              {/* Header row with name, creation date, and action buttons */}
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {category.name}
                  </h3>
                  <span className="text-sm text-gray-500">
                    Created: {formatDate(category.createdAt)}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditCategory(category)}
                    className="rounded p-1 text-gray-600 hover:bg-gray-100"
                  >
                    <Pencil size={16} />
                  </button>
                  {user.role === "SUPER_ADMIN" && (
                    <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="rounded p-1 text-red-600 hover:bg-gray-100"
                  >
                    <Trash2 size={16} />
                  </button>
                  )}
                  
                </div>
              </div>

              <div className="mb-2 flex h-40 w-full items-center justify-center rounded-lg bg-gray-50">
                {category.image ? (
                  <img
                    src={`https://api.cpromart.site${category.image}`}
                    alt={category.name}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                    className="h-full w-full object-cover rounded-lg"
                  />
                ) : (
                  <LayoutGrid size={40} className="text-gray-300" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Category Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="relative bg-white rounded-lg shadow">
          <div className="flex items-start justify-between p-4 border-b rounded-t">
            <h3 className="text-xl font-semibold text-gray-900">
              {currentCategory ? "Edit Category" : "Add New Category"}
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
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Category Name *
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  defaultValue={currentCategory?.name || ""}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="image"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  {currentCategory ? "Update Image" : "Upload Image"}
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
                {currentCategory?.image && !imageFile && (
                  <p className="mt-1 text-xs text-gray-500">
                    Current image will be kept if no new file is selected
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b">
              <Button variant="primary" type="submit" disabled={isLoading}>
                {isLoading
                  ? "Saving"
                  : currentCategory
                  ? "Update Category"
                  : "Add Category"}
              </Button>
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <div className="relative bg-white rounded-lg shadow">
          <div className="flex items-start justify-between p-4 border-b rounded-t">
            <h3 className="text-xl font-semibold text-gray-900">
              Delete Category
            </h3>
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
              Are you sure you want to delete this category? This action cannot
              be undone.
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="primary"
                onClick={confirmDelete}
                disabled={isLoading}
              >
                {isLoading ? "Deleting" : "Delete"}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminCategories;
