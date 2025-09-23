import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { debounce } from 'lodash';

// --- Local Imports ---
import { searchCompanies, CompanySearchFilters, PaginatedCompanyResponse } from '../../api/api';
import { Company } from '../../types';
import { useGeolocation } from '../../utils/location';
import { trackSearch } from '../../utils/facebookPixel';

// --- Component Imports ---
import Layout from '../../components/layout/Layout';
import Spinner from '../../components/common/Spinner';
import CompanyCard from '../../components/common/CompanyCard';
import SearchBar from '../../components/common/SearchBar';

const CompaniesListing = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<CompanySearchFilters>({});
  
  const { error: geoError, loading: geoLoading, getCurrentLocation } = useGeolocation();
  const [useMyLocation, setUseMyLocation] = useState<boolean>(false);

  // The main function to perform the API search
  const performSearch = async (currentFilters: CompanySearchFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      const results: PaginatedCompanyResponse = await searchCompanies(currentFilters);
      setCompanies(results.items);
      // --- Track the search event after a successful API call ---
      trackSearch(currentFilters, results.total);
    } catch (err) {
      setError('Failed to fetch companies. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Create a debounced version of the search function to prevent excessive API calls.
  // useCallback ensures this debounced function isn't recreated on every render.
  const debouncedSearch = useCallback(
    debounce((currentFilters: CompanySearchFilters) => {
      performSearch(currentFilters);
    }, 500), // Wait 500ms after user stops typing
    []
  );

  // useEffect for the initial data load when the component mounts
  useEffect(() => {
    performSearch({});
  }, []);

  // useEffect to trigger a search whenever the filters object changes
  useEffect(() => {
    // Don't run this on the initial mount; the useEffect above handles that.
    // This is to prevent a double API call on load.
    if (Object.keys(filters).length > 0) {
      debouncedSearch(filters);
    }
    // Cleanup function to cancel any pending debounced calls when the component unmounts
    return () => debouncedSearch.cancel();
  }, [filters, debouncedSearch]);

  const handleSearchTextChange = (searchText: string) => {
    setFilters(prev => ({ ...prev, search: searchText }));
  };

  const handleUseMyLocationChange = async (checked: boolean) => {
    setUseMyLocation(checked);
    if (checked) {
      try {
        const currentLocation = await getCurrentLocation();
        setFilters(prev => ({
          ...prev,
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          radius: 25000, // Default 25km radius
        }));
      } catch (err) {
        alert('Could not get your location. Please enable location services in your browser and try again.');
        setUseMyLocation(false); // Revert checkbox if permission is denied
      }
    } else {
      // If unchecked, create a new filters object without the location properties
      const { latitude, longitude, radius, ...rest } = filters;
      setFilters(rest);
    }
  };

  // Helper function to render the list of companies
  const renderCompanyList = () => {
    if (isLoading) return <Spinner />;
    if (error) return <div className="error-message" style={{ textAlign: 'center', padding: '2rem' }}>{error}</div>;
    if (companies.length === 0) return <p style={{ textAlign: 'center', padding: '2rem' }}>No companies found matching your criteria.</p>;
    
    return (
      <div className="company-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {companies.map(company => (
          <Link to={`/company/${company.slug}`} key={company._id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <CompanyCard company={company} />
          </Link>
        ))}
      </div>
    );
  };

  return (
    <Layout>
      <div className="page-container" style={{ padding: '2rem' }}>
        <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1>Find Construction Companies</h1>
          <p>Search our directory to find the best companies near you.</p>
        </header>

        <SearchBar onSearch={handleSearchTextChange} placeholder="Search by name, category, or keyword..." />

        <div className="filters-bar" style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={useMyLocation}
              onChange={(e) => handleUseMyLocationChange(e.target.checked)}
              disabled={geoLoading}
            />
            {geoLoading ? 'Getting your location...' : 'Search near me'}
          </label>
          {geoError && <span style={{ color: 'red', marginLeft: '1rem' }}>{geoError}</span>}
        </div>

        {renderCompanyList()}
      </div>
    </Layout>
  );
};

export default CompaniesListing;