import React, { useState, useEffect, useCallback } from "react";
import Layout from "../../components/layout/Layout";
import SearchBar from "../../components/common/SearchBar";
import CompanyCard from "../../components/common/CompanyCard";
import { CompanyData } from "../../types";
import { fetchCompanies } from "../../api/api";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

const CACHE_KEY = "all_companies";
const CACHE_TIMESTAMP_KEY = "all_companies_timestamp";
const CACHE_EXPIRY = 24 * 60 * 60 * 1000;

const CategoryPage: React.FC = () => {
  const { t } = useTranslation();
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<CompanyData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Load from cache first
  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    if (cached && timestamp) {
      const age = Date.now() - parseInt(timestamp, 10);
      if (age < CACHE_EXPIRY) {
        const data = JSON.parse(cached);
        setCompanies(data);
        setFilteredCompanies(data);
        setLoading(false);
      }
    }
  }, []);

  // Always fetch in background to update UI
  const loadCompanies = useCallback(async () => {
    try {
      const response = await fetchCompanies();
      const data = response.data;
      setCompanies(data);
      setFilteredCompanies(() => {
        if (searchQuery.trim()) {
          return filterCompanies(data, searchQuery);
        }
        return data;
      });

      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  const filterCompanies = useCallback((list: CompanyData[], query: string) => {
    const normalizedQuery = query.toLowerCase().trim();
    return list.filter(
      (company) =>
        company.name.toLowerCase().includes(normalizedQuery) ||
        company.description?.toLowerCase().includes(normalizedQuery) ||
        company.location?.toLowerCase().includes(normalizedQuery)
    );
  }, []);

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      if (!query.trim()) {
        setFilteredCompanies(companies);
        return;
      }
      setFilteredCompanies(filterCompanies(companies, query));
    },
    [companies, filterCompanies]
  );

  return (
    <Layout>
      <Helmet>
        <title>{t("view_all_companies")}</title>
        <meta name="description" content={t("dicover_top_rated")} />
      </Helmet>

      {/* Search Section */}
      <section className="bg-white py-8 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="w-full md:w-2/3">
              <SearchBar
                onSearch={handleSearch}
                placeholder={t("search_companies")}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Companies Section */}
      {loading ? (
        <p className="m-4 text-xl font-bold text-gray-900">
          {t("loading_companies")}
        </p>
      ) : (
        <section className="bg-gray-50 py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              {filteredCompanies.length === 0 ? (
                <h2 className="text-2xl font-bold text-gray-900">
                  {t("no_companies")}
                </h2>
              ) : null}

              {searchQuery && (
                <p className="mt-2 text-gray-600">
                  {t("search_results", { query: searchQuery })}
                </p>
              )}
            </div>

            {filteredCompanies.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCompanies.map((company) => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </div>
            ) : (
              <div className="rounded-lg bg-white p-8 text-center shadow">
                <h3 className="mb-2 text-xl font-semibold">
                  {t("no_companies_found")}
                </h3>
                <p className="text-gray-600">
                  {t("no_companies_description")}
                </p>
              </div>
            )}
          </div>
        </section>
      )}
    </Layout>
  );
};

export default CategoryPage;
