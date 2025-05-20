import React from 'react';
import Layout from '../../components/layout/Layout';
import { categories } from '../../data/mockData';
import CategoryCard from '../../components/common/CategoryCard';

const CategoriesPage: React.FC = () => {
  return (
    <Layout>
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h1 className="mb-3 text-4xl font-bold text-gray-900">
              Construction Categories
            </h1>
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
    </Layout>
  );
};

export default CategoriesPage