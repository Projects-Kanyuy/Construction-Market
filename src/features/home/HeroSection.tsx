import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import { AuthContext } from '../../context/AuthContext';
import { getFeaturedCompanies } from '../../api/api';
import { CompanyData } from '../../types';
import { incrementCompanyViewCount } from '../../api/api';

const incrementViewCount = async (companyId: number) => {
  try {
    await incrementCompanyViewCount(companyId);
    console.log('count updated successfully!');
  } catch (error) {
    console.log('Error incrementing view count:', error);
  }
}

const HeroSection: React.FC = () => {
  const [featuredCompany, setFeaturedCompany] = useState<CompanyData | null>(null)
    const { isAuthenticated } = useContext(AuthContext);

    useEffect(() => {
      loadFeaturedCompany();
    }, [featuredCompany])

    const loadFeaturedCompany = async () => {
      try {
        const response = await getFeaturedCompanies();
        setFeaturedCompany(response.data);
    } catch (error) {
        console.error('Error fetching featured company:', error);
      }
    }
  
  return (
    <section className="relative overflow-hidden bg-[#1A2531] py-20 md:py-28">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1A2531] to-[#324458]"></div>
      
      <div className="container relative mx-auto px-4 z-10">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <div className="mb-4 inline-block rounded-full bg-[#FF9D42]/20 px-4 py-1.5 text-sm font-semibold text-[#FF9D42]">
              Find the Best Construction Companies
            </div>
            
            <h1 className="mb-6 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
              Build Your <span className="text-[#FF9D42]">Dreams</span> With the Right Partners
            </h1>
            
            <p className="mb-8 text-lg text-gray-300 md:text-xl">
              Connect with top construction companies specialized in residential, commercial, and industrial projects.
            </p>
            
            {!isAuthenticated && (
<div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 md:justify-center lg:justify-start">
              <Link to="/register">
                <Button 
                  variant="primary" 
                  size="large"
                >
                  Register Your Company
                </Button>
              </Link>
            </div>
            )}
            
          </div>
          
          <div className="relative hidden overflow-hidden rounded-xl shadow-2xl lg:block">
            <img 
              src={`http://localhost:5000${featuredCompany?.logo}`}
              alt={featuredCompany?.name}
              className="h-full w-full object-cover object-center"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            {featuredCompany && (
              <div className="absolute bottom-0 left-0 right-0 p-6">
              <span className="mb-1 block text-sm font-medium text-[#FF9D42]">Featured Company</span>
              <h3 className="mb-2 text-xl font-bold text-white">{featuredCompany?.name}</h3>
              <Link 
                to={`/company/${featuredCompany?.id}`}
                state={{ company: featuredCompany }} 
                onClick={() => incrementViewCount(featuredCompany?.id)}
                className="flex items-center text-sm font-medium text-white/80 transition-colors hover:text-white"
              >
                Learn more 
              </Link>
            </div>
            )}
            
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 translate-y-1">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 200">
          <path fill="#F9FAFB" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,149.3C1248,139,1344,117,1392,106.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection