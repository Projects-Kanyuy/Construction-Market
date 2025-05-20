import React, {useState, useEffect} from 'react';
import CategoryCard from '../../components/common/CategoryCard';
import { fetchCategories } from '../../api/api';
import { Category } from '../../types';

const CategorySection: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategoriesData();
  }, [])

  const fetchCategoriesData = async () => {
    try {
      const response = await fetchCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  return (
    <section className="bg-[#F9FAFB] py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold text-gray-900 md:text-4xl">
            Find Construction Experts by Category
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Browse through our specialized categories to find the perfect construction company for your project needs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;