import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// --- Local Imports ---
import { getCompanyBySlug } from '../../api/api';
import { Company } from '../../types';
import { trackCompanyView } from '../../utils/facebookPixel';

// --- Component Imports ---
import Layout from '../../components/layout/Layout';
import Spinner from '../../components/common/Spinner';
import ShareableProfileSection from '../../components/common/ShareableProfileSection';

const CompanyDetailPage = () => {
  // useParams gets the dynamic part of the URL, in this case, the ':slug'
  const { slug } = useParams<{ slug: string }>(); 
  
  // State to hold our data and manage loading/error status
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // This useEffect handles fetching the company data from the API
  useEffect(() => {
    // Ensure we have a slug before trying to fetch
    if (!slug) {
      setError("No company specified.");
      setIsLoading(false);
      return;
    }

    const fetchCompanyData = async () => {
      try {
        setIsLoading(true); // Start loading
        const data = await getCompanyBySlug(slug);
        setCompany(data); // On success, store the data
        setError(null); // Clear any previous errors
      } catch (err) {
        setError("Could not find the company you're looking for.");
        console.error(err);
      } finally {
        setIsLoading(false); // Stop loading, whether success or fail
      }
    };

    fetchCompanyData();
  }, [slug]); // This useEffect will re-run if the slug in the URL ever changes

  // This useEffect handles TRACKING. It runs only when the `company` data is successfully fetched.
  useEffect(() => {
    if (company) {
      trackCompanyView(company);
    }
  }, [company]); // Dependency array ensures this runs once per company load

  // Helper function to render the main content based on the current state
  const renderContent = () => {
    if (isLoading) {
      return <Spinner />;
    }

    if (error) {
      return <div className="error-message" style={{ textAlign: 'center', padding: '2rem' }}>{error}</div>;
    }

    if (company) {
      return (
        <div className="company-profile">
          {company.banner && <img src={company.banner} alt={`${company.name} banner`} className="company-banner" style={{ width: '100%', height: '300px', objectFit: 'cover' }} />}
          
          <div className="company-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1.5rem' }}>
            {company.logo && <img src={company.logo} alt={`${company.name} logo`} className="company-logo" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }}/>}
            <h1>{company.name}</h1>
          </div>

          <p className="company-description" style={{ marginTop: '1rem', fontSize: '1.1rem' }}>{company.description}</p>
          
          {/* --- The new ShareableProfileSection component --- */}
          <ShareableProfileSection company={company} />

          <div className="company-details" style={{ marginTop: '2rem' }}>
            <h3>Company Details</h3>
            <p><strong>Category:</strong> {company.category}</p>
            <p><strong>Location:</strong> {company.city}, {company.country}</p>
            <p><strong>Phone:</strong> {company.phone}</p>
            <p><strong>Email:</strong> {company.email}</p>
            {company.website && 
              <p><strong>Website:</strong> <a href={company.website} target="_blank" rel="noopener noreferrer">{company.website}</a></p>
            }
          </div>
        </div>
      );
    }
    
    return null; // Should not happen if logic is correct
  };

  return (
    <Layout>
      <div className="page-container" style={{ padding: '2rem' }}>
        {renderContent()}
      </div>
    </Layout>
  );
};

export default CompanyDetailPage;