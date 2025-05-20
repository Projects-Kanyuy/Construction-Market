import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import SearchBar from '../../components/common/SearchBar';
import CompanyCard from '../../components/common/CompanyCard';
import { CompanyData } from '../../types';
import { getCompaniesByCategory } from '../../api/api';
import { Filter } from 'lucide-react';

const CategoryPage: React.FC = () => {
  const location = useLocation();
  const category = location.state?.category;
  const { categoryId } = useParams<{ categoryId: string }>();
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<CompanyData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    if (categoryId) {
      loadCompanies();
      setFilteredCompanies(companies);
    }
  }, [categoryId]);
  
  const loadCompanies = async () => {
    if (!categoryId) return;
    try {
      const response = await getCompaniesByCategory(categoryId);
      setCompanies(response.data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredCompanies(companies);
      return;
    }
    
    const normalizedQuery = query.toLowerCase().trim();
    const filtered = companies.filter(company => 
      company.name.toLowerCase().includes(normalizedQuery) ||
      company.description?.toLowerCase().includes(normalizedQuery) ||
      company.location?.toLowerCase().includes(normalizedQuery)
    );
    
    setFilteredCompanies(filtered);
  };
  
  if (!categoryId) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20">
          <h1 className="mb-8 text-3xl font-bold text-center">Category not found</h1>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      {/* Hero section with category info */}
      <section className="relative min-h-[300px] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={category.imageUrl} 
            alt={category.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30"></div>
        </div>
        
        <div className="container relative mx-auto px-4 py-24 sm:py-32">
          <div className="max-w-2xl">
            <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl">
              {category.name}
            </h1>
            <p className="text-lg text-gray-200">
              {category.description}
            </p>
          </div>
        </div>
      </section>
      
      {/* Search and filter section */}
      <section className="bg-white py-8 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="w-full md:w-2/3">
              <SearchBar 
                onSearch={handleSearch}
                placeholder={`Search ${category.name} companies...`}
              />
            </div>
            
            <button className="flex items-center rounded-lg border border-gray-300 px-4 py-2.5 text-gray-700 transition-colors hover:bg-gray-50">
              <Filter className="mr-2 h-5 w-5" />
              <span>Filter</span>
            </button>
          </div>
        </div>
      </section>
      
      {/* Companies list */}
      <section className="bg-gray-50 py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredCompanies.length > 0 
                ? `${filteredCompanies.length} Companies Found`
                : 'No Companies Found'}
            </h2>
            {searchQuery && (
              <p className="mt-2 text-gray-600">
                Search results for "{searchQuery}"
              </p>
            )}
          </div>
          
          {filteredCompanies.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCompanies.map(company => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg bg-white p-8 text-center shadow">
              <h3 className="mb-2 text-xl font-semibold">No companies found</h3>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default CategoryPage;