import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../../types';
import { ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link 
      to={`/category/${category.id}`}
      state={{ category }}
      className="group relative overflow-hidden rounded-xl shadow-md transition-all duration-300 hover:shadow-lg"
    >
      <div className="relative h-64 overflow-hidden">
        <img 
          src={`http://localhost:5000${category.image}`} 
          alt={category.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        <div className="absolute top-4 right-4">
          <span className="flex items-center rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-gray-900 backdrop-blur-sm transition-transform duration-300 group-hover:scale-105">
            View Companies
            <ArrowRight className="ml-2 h-4 w-4" />
          </span>
        </div>
        
        <div className="absolute bottom-0 left-0 p-6 text-white">
          <h3 className="mb-2 text-2xl font-bold">{category.name}</h3>
          <p className="text-sm text-gray-200">{category.description}</p>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard