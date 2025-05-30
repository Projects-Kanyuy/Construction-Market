import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { Category } from '../../types';
import CategoryCard from '../../components/common/CategoryCard';
import { fetchCategories } from '../../api/api';
import { useTranslation } from 'react-i18next';

const CategoriesPage: React.FC = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    loadCategories();
  }, [categories]);

const loadCategories = async () => {
  try {
    const response = await fetchCategories();
    setCategories(response.data);
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
}
  return (
    <Layout>
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h1 className="mb-3 text-4xl font-bold text-gray-900">
              {t('construction_categories')}
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              {t('browse_through_categories')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CategoriesPage