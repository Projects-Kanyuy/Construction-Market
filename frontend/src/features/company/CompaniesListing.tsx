import React, { useState, useEffect, useCallback } from "react";
import Layout from "../../components/layout/Layout";
import SearchBar from "../../components/common/SearchBar";
import CompanyCard from "../../components/common/CompanyCard";
import { CompanyData } from "../../types";
import { fetchCompanies } from "../../api/api";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Search, Filter } from "lucide-react";

const CACHE_KEY = "all_companies";
const CACHE_TIMESTAMP_KEY = "all_companies_timestamp";
const CACHE_EXPIRY = 24 * 60 * 60 * 1000;

// Helper to normalize backend response
function normalizeCompanies(data: any): CompanyData[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.items)) return data.items;
  return [];
}

const CategoryPage: React.FC = () => {
  const { t } = useTranslation();
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<CompanyData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Load cached data first
  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    if (cached && timestamp) {
      const age = Date.now() - parseInt(timestamp, 10);
      if (age < CACHE_EXPIRY) {
        try {
          const data = normalizeCompanies(JSON.parse(cached));
          setCompanies(data);
          setFilteredCompanies(data);
          setLoading(false);
        } catch {
          setCompanies([]);
          setFilteredCompanies([]);
        }
      }
    }
  }, []);

  // Enhanced filter function
  const filterCompanies = useCallback((list: CompanyData[], query: string) => {
    if (!query.trim()) return list;

    const normalizedQuery = query.toLowerCase().trim();
    return list.filter(
      (company) =>
        company.name.toLowerCase().includes(normalizedQuery) ||
        (company.description &&
          company.description.toLowerCase().includes(normalizedQuery)) ||
        (company.location &&
          company.location.toLowerCase().includes(normalizedQuery)) ||
        (company.categories &&
          company.categories.some((cat: any) =>
            typeof cat === "string"
              ? cat.toLowerCase().includes(normalizedQuery)
              : cat.name && cat.name.toLowerCase().includes(normalizedQuery)
          ))
    );
  }, []);

  // Handle search
  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      setFilteredCompanies(filterCompanies(companies, query));
    },
    [companies, filterCompanies]
  );

  // Fetch from API
  const loadCompanies = useCallback(async () => {
    try {
      const response = await fetchCompanies();
      const data = normalizeCompanies(response.data);
      setCompanies(data);
      setFilteredCompanies(filterCompanies(data, searchQuery));
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {
      console.error("Error fetching companies:", error);
      setCompanies([]);
      setFilteredCompanies([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filterCompanies]);

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  return (
    <Layout>
      <Helmet>
        <title>{t("view_all_companies")}</title>
        <meta name="description" content={t("dicover_top_rated")} />
      </Helmet>

      {/* Search Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-12 shadow-sm">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t("browse_companies")}
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t("find_company_by_name_location_category")}
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-full max-w-2xl">
              <SearchBar
                onSearch={handleSearch}
                placeholder={t("search_companies_by_name_location_category")}
                className="shadow-lg rounded-full border-0"
              />
            </div>

            <div className="flex items-center text-sm text-gray-500 mt-2">
              <Filter className="h-4 w-4 mr-1" />
              {t("search_by_name_location_category")}
            </div>
          </div>
        </div>
      </section>

      {/* Companies Section */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-xl font-medium text-gray-700">
            {t("loading_companies")}
          </p>
        </div>
      ) : (
        <section className="bg-white py-12 sm:py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="mb-8 text-center">
              {searchQuery && (
                <p className="text-lg text-gray-600 mb-4">
                  {t("search_results_for", { query: searchQuery })}
                </p>
              )}

              {filteredCompanies.length > 0 ? (
                <h2 className="text-2xl font-bold text-gray-900">
                  {t("showing_companies", { count: filteredCompanies.length })}
                </h2>
              ) : (
                <div className="py-12">
                  <Search className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                  <h2 className="text-2xl font-bold text-gray-700 mb-2">
                    {t("no_companies_found")}
                  </h2>
                  <p className="text-gray-500 max-w-md mx-auto">
                    {t("try_different_search")}
                  </p>
                </div>
              )}
            </div>

            {Array.isArray(filteredCompanies) &&
              filteredCompanies.length > 0 && (
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredCompanies.map((company) => (
                    <CompanyCard key={company.id} company={company} />
                  ))}
                </div>
              )}
          </div>
        </section>
      )}
    </Layout>
  );
};

export default CategoryPage;
