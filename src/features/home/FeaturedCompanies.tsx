import React, { useEffect, useState } from 'react';
import CompanyCard from '../../components/common/CompanyCard';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchCompanies } from '../../api/api';
import { CompanyData } from '../../types';

const FeaturedCompanies: React.FC = () => {
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  
  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const response = await fetchCompanies();
      setCompanies(response.data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  }
  
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="mb-3 text-3xl font-bold text-gray-900 md:text-4xl">
              Featured Companies
            </h2>
            <p className="max-w-2xl text-lg text-gray-600">
              Discover top-rated construction companies across various specialties.
            </p>
          </div>
          
          <Link 
            to="/categories" 
            className="hidden items-center text-[#3B546A] transition-colors hover:text-[#2A3E50] md:flex"
          >
            View All 
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
        
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
        
        <div className="mt-10 text-center md:hidden">
          <Link 
            to="/categories" 
            className="inline-flex items-center font-medium text-[#3B546A] transition-colors hover:text-[#2A3E50]"
          >
            View All Companies 
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCompanies;