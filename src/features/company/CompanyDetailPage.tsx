import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CompanyData } from '../../types';
import Layout from '../../components/layout/Layout';
import Button from '../../components/common/Button';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, Calendar } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const CompanyDetailPage: React.FC = () => {
  const location = useLocation(); 
  const company: CompanyData  = location.state?.company;
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [company]);
  
  if (!company) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20">
          <h1 className="mb-8 text-3xl font-bold text-center">Company not found</h1>
          <div className="flex justify-center">
            <Link to="/">
              <Button variant="primary">Return to Home</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }
  
  const whatsappLink = `https://wa.me/${company.phone?.replace(/\D/g, '')}`;
  
  return (
    <Layout>
      <Helmet>
          <title>{`Company - ${company.name} | CProMart`}</title>
          <meta name="description" content={`Learn more about ${company.name}, their services, and projects.`} />
        </Helmet>
      {/* Company Header */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
            <div className="h-24 w-24 overflow-hidden rounded-lg bg-gray-200 md:h-32 md:w-32">
              <img 
                src={`http://localhost:5000${company.logo}`} 
                alt={company.name}
                className="h-full w-full object-cover"
              />
            </div>
            
            <div className="flex-1">
              <h1 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl">
                {company.name}
              </h1>
              
              <div className="mb-4 flex flex-wrap items-center gap-4">
                <div className="flex items-center">
                  <MapPin className="mr-1 h-5 w-5 text-gray-500" />
                  <span className="text-gray-700">{company.location}</span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {company.categories?.map(category => (
                    <Link
                      key={category.id}
                      to={`/category/${category.id}`}
                      className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-200"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <a href={company.phone ? whatsappLink : '#'} target="_blank" rel="noopener noreferrer">
                <Button 
                  variant="secondary" 
                  size="large"
                  icon={<Phone size={18} />}
                >
                  Contact via WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* Company Main Content */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="order-2 lg:order-1 lg:col-span-2">
              {/* About */}
              <div className="mb-12 rounded-xl bg-white p-6 shadow-sm md:p-8">
                <h2 className="mb-4 text-2xl font-bold text-gray-900">About</h2>
                <p className="text-gray-700">
                  {company.description}
                </p>
              </div>
              
              {/* Past Projects */}
              <div className="mb-12 rounded-xl bg-white p-6 shadow-sm md:p-8">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">Projects</h2>
                
                {company.projects && company.projects.length > 0 ? (
                  <div className="space-y-8">
                    {company.projects.map(project => (
                      <div key={project.id} className="overflow-hidden rounded-lg border border-gray-200">
                        <div className="h-64 w-full overflow-hidden bg-gray-200">
                          <img 
                            src={`http://localhost:5000${project.image}`} 
                            alt={project.title}
                            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                        </div>
                        
                        <div className="p-6">
                          <div className="mb-3 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
                            <div className="flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                              <Calendar className="mr-1 h-4 w-4" />
                              <span>{project.year}</span>
                            </div>
                          </div>
                          
                          <p className="text-gray-700">{project.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No past projects available.</p>
                )}
              </div>
            </div>
            
            {/* Contact Information Sidebar */}
            <div className="order-1 lg:order-2">
              <div className="sticky top-24 rounded-xl bg-white p-6 shadow-sm md:p-8">
                <h2 className="mb-6 text-xl font-bold text-gray-900">Contact Information</h2>
                
                <div className="space-y-5">
                  <div className="flex items-start">
                    <Phone className="mr-3 h-5 w-5 text-[#3B546A]" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <a 
                        href={`tel:${company.phone}`}
                        className="text-gray-900 transition-colors hover:text-[#3B546A]"
                      >
                        {company.phone}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail className="mr-3 h-5 w-5 text-[#3B546A]" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <a 
                        href={`mailto:${company.email}`}
                        className="text-gray-900 transition-colors hover:text-[#3B546A]"
                      >
                        {company.email}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="mr-3 h-5 w-5 text-[#3B546A]" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Location</p>
                      <p className="text-gray-900">{company.location}</p>
                    </div>
                  </div>
                </div>
                
                {/* Social Media */}
                {(company.facebook || 
                  company.twitter || 
                  company.instagram || 
                  company.linkedin) && (
                  <div className="mt-8">
                    <h3 className="mb-4 text-lg font-medium text-gray-900">Social Media</h3>
                    <div className="flex space-x-4">
                      {company.facebook && (
                        <a 
                          href={company.facebook} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-colors hover:bg-[#3B546A] hover:text-white"
                        >
                          <Facebook size={18} />
                        </a>
                      )}
                      
                      {company.twitter && (
                        <a 
                          href={company.twitter} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-colors hover:bg-[#3B546A] hover:text-white"
                        >
                          <Twitter size={18} />
                        </a>
                      )}
                      
                      {company.instagram && (
                        <a 
                          href={company.instagram} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-colors hover:bg-[#3B546A] hover:text-white"
                        >
                          <Instagram size={18} />
                        </a>
                      )}
                      
                      {company.linkedin && (
                        <a 
                          href={company.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-colors hover:bg-[#3B546A] hover:text-white"
                        >
                          <Linkedin size={18} />
                        </a>
                      )}
                    </div>
                  </div>
                )}
                
                {/* CTA Button */}
                <div className="mt-8">
                  <a 
                    href={whatsappLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center rounded-lg bg-[#FF9D42] py-3 font-medium text-white transition-all duration-200 hover:bg-[#F08A2C] active:bg-[#D6791F]"
                  >
                    <Phone className="mr-2 h-5 w-5" />
                    Contact via WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CompanyDetailPage;