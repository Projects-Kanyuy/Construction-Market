import React, { useState, useEffect, useCallback } from "react";
import Layout from "../../components/layout/Layout";
import SearchBar from "../../components/common/SearchBar";
import CompanyCard from "../../components/common/CompanyCard";
import { CompanyData } from "../../types";
import { fetchCompanies } from "../../api/api";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Search, Filter, X, MapPin, Building, ChevronDown } from "lucide-react";

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

// Helper to extract unique values from companies
function extractUniqueValues(companies: CompanyData[], key: string): string[] {
  const values = companies
    .map((company) => {
      if (key === "categories") {
        return (
          company.categories?.map((cat) =>
            typeof cat === "string" ? cat : cat.name
          ) || []
        );
      }
      return company[key] || "";
    })
    .flat();
  return [...new Set(values)].filter(Boolean);
}

const CategoryPage: React.FC = () => {
  const { t } = useTranslation();
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<CompanyData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  // Fixed location options
  const locationOptions = ["Cameroon", "Nigeria", "Ghana", "South Africa"];

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
          setCategories(extractUniqueValues(data, "categories"));
          setLoading(false);
        } catch {
          setCompanies([]);
          setFilteredCompanies([]);
          setLoading(false);
        }
      }
    }
  }, []);

  // Enhanced filter function
  useEffect(() => {
    let filtered = companies;
    // Apply search filter
    if (searchQuery.trim()) {
      const normalizedQuery = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
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
    }
    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter((company) =>
        company.categories?.some((cat) =>
          typeof cat === "string"
            ? cat === selectedCategory
            : cat.name === selectedCategory
        )
      );
    }
    // Apply location filter
    if (selectedLocation) {
      filtered = filtered.filter(
        (company) => company.location === selectedLocation
      );
    }
    setFilteredCompanies(filtered);
  }, [searchQuery, selectedCategory, selectedLocation, companies]);

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Fetch from API
  const loadCompanies = useCallback(async () => {
    try {
      const response = await fetchCompanies();
      const data = normalizeCompanies(response.data);
      setCompanies(data);
      setFilteredCompanies(data);
      setCategories(extractUniqueValues(data, "categories"));
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {
      console.error("Error fetching companies:", error);
      setCompanies([]);
      setFilteredCompanies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setSelectedLocation(null);
  };

  // Custom dropdown component
  const FilterDropdown = ({
    label,
    icon: Icon,
    options,
    selected,
    setSelected,
    isOpen,
    setIsOpen,
  }: {
    label: string;
    icon: React.ElementType;
    options: string[];
    selected: string | null;
    setSelected: (value: string | null) => void;
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
  }) => (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-40 sm:w-48 bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3B546A]"
      >
        <div className="flex items-center">
          <Icon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 mr-1 sm:mr-2" />
          <span className="truncate">{selected || label}</span>
        </div>
        <ChevronDown
          className={`h-3 w-3 sm:h-4 sm:w-4 text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-40 sm:w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
          <button
            onClick={() => {
              setSelected(null);
              setIsOpen(false);
            }}
            className="block w-full text-left px-3 py-1.5 text-xs sm:text-sm text-gray-700 hover:bg-gray-100"
          >
            {t("all")}
          </button>
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                setSelected(option);
                setIsOpen(false);
              }}
              className="block w-full text-left px-3 py-1.5 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 truncate"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <Layout>
      <Helmet>
        <title>{t("view_all_companies")}</title>
        <meta name="description" content={t("dicover_top_rated")} />
      </Helmet>

      {/* Search Section */}
      <section className="bg-[#2A3E50] py-8 sm:py-10 shadow-sm">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">
              {t("Browse companies")}
            </h1>
            <p className="text-sm sm:text-base text-white max-w-2xl mx-auto">
              {t("find company by name location category")}
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-3 sm:gap-4">
            <div className="w-full max-w-2xl">
              <SearchBar
                onSearch={handleSearch}
                placeholder={t("search companies_by_name_location_category")}
                className="shadow-lg rounded-full border-0"
              />
            </div>

            {/* Filter Options */}
            <div className="w-full max-w-4xl">
              <div className="bg-white rounded-xl shadow-sm p-3">
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                  {/* Categories Filter */}
                  <FilterDropdown
                    label={t("categories")}
                    icon={Building}
                    options={categories}
                    selected={selectedCategory}
                    setSelected={setSelectedCategory}
                    isOpen={isCategoryOpen}
                    setIsOpen={setIsCategoryOpen}
                  />

                  {/* Locations Filter */}
                  <FilterDropdown
                    label={t("locations")}
                    icon={MapPin}
                    options={locationOptions}
                    selected={selectedLocation}
                    setSelected={setSelectedLocation}
                    isOpen={isLocationOpen}
                    setIsOpen={setIsLocationOpen}
                  />

                  {/* Clear Filters Button */}
                  {(searchQuery || selectedCategory || selectedLocation) && (
                    <button
                      onClick={clearFilters}
                      className="flex items-center px-3 py-2 text-xs rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <X className="h-3 w-3 mr-1" />
                      {t("clear_filters")}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Companies Section */}
      {loading ? (
        <div className="py-12 sm:py-16 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-3 sm:mb-4"></div>
          <p className="text-lg sm:text-xl font-medium text-gray-700">
            {t("loading_companies")}
          </p>
        </div>
      ) : (
        <section className="bg-white py-12 sm:py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="mb-6 sm:mb-8 text-center">
              {searchQuery && (
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                  {t("search_results_for", { query: searchQuery })}
                </p>
              )}
              {filteredCompanies.length > 0 ? (
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
                  {t("showing_companies", { count: filteredCompanies.length })}
                </h2>
              ) : (
                <div className="py-8 sm:py-12">
                  <Search className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mb-3 sm:mb-4" />
                  <h2 className="text-lg sm:text-2xl font-bold text-gray-700 mb-2">
                    {selectedLocation
                      ? t("no_companies_in_location", {
                          location: selectedLocation,
                        })
                      : t("no_companies_found")}
                  </h2>
                  <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto">
                    {selectedLocation
                      ? t("try_different_location")
                      : t("try_different_search")}
                  </p>
                  {(searchQuery || selectedCategory || selectedLocation) && (
                    <button
                      onClick={clearFilters}
                      className="mt-3 sm:mt-4 inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-[#3B546A] text-white text-sm rounded-md hover:bg-[#2A3E50] transition-colors"
                    >
                      <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      {t("clear_all_filters")}
                    </button>
                  )}
                </div>
              )}
            </div>
            {Array.isArray(filteredCompanies) &&
              filteredCompanies.length > 0 && (
                <div className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
