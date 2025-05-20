import React from 'react';
import { Link } from 'react-router-dom';
import { CompanyData } from '../../types';
import Button from './Button';
import { Phone } from 'lucide-react';
import { incrementCompanyViewCount } from '../../api/api';

interface CompanyCardProps {
  company: CompanyData;
}

const incrementViewCount = async (companyId: number) => {
  try {
    await incrementCompanyViewCount(companyId);
    console.log('count updated successfully!');
  } catch (error) {
    console.log('Error incrementing view count:', error);
  }
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  const whatsappLink = `https://wa.me/${company.phone?.replace(/\D/g, '')}`;
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-lg">
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img 
          src={`http://localhost:5000${company.logo}`} 
          alt={company.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4">
          <h3 className="mb-1 text-xl font-bold text-gray-900">{company.name}</h3>
          <p className="mb-1 text-sm text-gray-600">{company.location}</p>
          <p className="line-clamp-2 text-sm text-gray-700">{company.description}</p>
        </div>
        
        <div className="mt-auto flex items-center justify-between">
          <Link 
            to={`/company/${company.id}`}
            state={{ company }}
            className="text-sm font-medium text-[#3B546A] transition-colors hover:text-[#2A3E50]"
            onClick={() => incrementViewCount(company.id)}
          >
            View Details
          </Link>
            <a href={company.phone ? whatsappLink : '#'} target="_blank" rel="noopener noreferrer">
            <Button 
              variant="secondary" 
              size="small"
              icon={<Phone size={16} />}
            >
              Contact
            </Button>
          </a>          
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;