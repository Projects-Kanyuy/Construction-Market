import React, {useState, useEffect} from 'react';
import CategoryCard from '../../components/common/CategoryCard';
import { fetchCategories } from '../../api/api';
import { Category } from '../../types';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CategorySection: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategoriesData();
  }, [categories])

  const fetchCategoriesData = async () => {
    try {
      const response = await fetchCategories();
      setCategories(response.data.slice(0, 10)); 
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

        <div className="mt-10 text-center">
          <Link 
            to="/categories" 
            className="inline-flex items-center font-medium text-[#3B546A] transition-colors hover:text-[#2A3E50]"
          >
            View All Categories 
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;