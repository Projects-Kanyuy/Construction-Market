import React, {useState, useEffect} from 'react';
import CategoryCard from '../../components/common/CategoryCard';
import { fetchCategories } from '../../api/api';
import { Category } from '../../types';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from "react-i18next";

const CategorySection: React.FC = () => {
    const { t } = useTranslation();


  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategoriesData();
  }, [categories])

  const fetchCategoriesData = async () => {
    try {
      const response = await fetchCategories();
      setCategories(response.data.slice(0, 6)); 
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

return (
    <section className="bg-[#F9FAFB] py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold text-gray-900 md:text-4xl">
            {t('find_construction_by_categories')}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            {t('browse')}
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
            {t('view_all_categories')} 
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;