import React, { useEffect, useState, useCallback, useContext } from "react";
import CompanyCard from "../../components/common/CompanyCard";
import {
  ArrowRight,
  Search,
  X,
  MapPin,
  Building,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import { fetchCompanies } from "../../api/api";
import { CompanyData } from "../../types";
import { useTranslation } from "react-i18next";
import SearchBar from "../../components/common/SearchBar";
import Button from "../../components/common/Button";
import { AuthContext } from "../../context/AuthContext";

const CACHE_KEY = "featured_companies";
const CACHE_TIMESTAMP_KEY = "featured_companies_timestamp";
const CACHE_EXPIRY = 24 * 60 * 60 * 1000;

// Reuse helper
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

const FeaturedCompanies: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const { isAuthenticated } = useContext(AuthContext);
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

  // Load cached data
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

  // Filter companies based on search query, category, and location
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

  // Fetch companies
  const loadCompanies = useCallback(async () => {
    try {
      const response = await fetchCompanies();
      const data = normalizeCompanies(response.data).slice(0, 9); // top 9
      setCompanies(data);
      setFilteredCompanies(data);
      setCategories(extractUniqueValues(data, "categories"));
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
      setLoading(false);
    } catch (error) {
      console.error("Error fetching companies:", error);
      setCompanies([]);
      setFilteredCompanies([]);
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
        className="flex items-center justify-between w-48 bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF9D42]"
      >
        <div className="flex items-center">
          <Icon className="h-4 w-4 text-gray-500 mr-2" />
          <span>{selected || label}</span>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
          <button
            onClick={() => {
              setSelected(null);
              setIsOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Hero Section with Search and Filters */}
      <section className="relative overflow-hidden bg-[#1A2531] py-20 md:py-8">
        <div className="container relative mx-auto px-4 z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Header Content */}
            <div className="mb-12 ">
              <div className="mb-4 inline-block rounded-full bg-[#FF9D42]/20 px-4 py-1.5 text-sm font-semibold text-[#FF9D42]">
                {t("find_best_construction")}
              </div>
              <h1 className="mb-6 text-2xl font-bold leading-tight text-white md:text-3xl lg:text-4xl">
                {t("build")}{" "}
                <span className="text-[#FF9D42]">{t("dream")}</span>{" "}
                {t("rigth_partners")}
              </h1>
              <p className="mb-2 text-lg text-gray-300 md:text-xl">
                {t("partner_with_top")}
              </p>
              {!isAuthenticated && (
                <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 md:justify-center lg:justify-start">
                  <Link to="/categories">
                    <Button variant="primary" size="large">
                      {t("get_tarted")}
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-2 ">
              <SearchBar
                onSearch={setSearchQuery}
                placeholder={t("Search for companies")}
                className="shadow-lg rounded-full"
              />
            </div>

            {/* Filter Options */}
            <div className="max-w-4xl mx-auto mb-2">
              <div className=" backdrop-blur-sm rounded-xl shadow-sm p-4">
                <div className="flex flex-wrap items-center justify-center gap-6">
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
                      className="flex items-center px-4 py-2.5 text-sm rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors"
                    >
                      <X className="h-4 w-4 mr-1" />
                      {t("clear_filters")}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Companies Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-6 flex justify-center">
            <Link
              to="/companies"
              className="flex items-center px-6 py-3 bg-white text-[#3B546A] font-medium rounded-full shadow-md transition-all hover:shadow-lg hover:text-[#2A3E50]"
            >
              {t("view_all")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3B546A]"></div>
            </div>
          ) : Array.isArray(filteredCompanies) &&
            filteredCompanies.length > 0 ? (
            <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCompanies.map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-xl bg-white p-12 text-center shadow-lg max-w-2xl mx-auto">
              <Search className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h3 className="mb-2 text-xl font-semibold text-gray-700">
                {selectedLocation
                  ? t("no_companies_in_location", {
                      location: selectedLocation,
                    })
                  : t("no_companies_found")}
              </h3>
              <p className="text-gray-500">
                {selectedLocation
                  ? t("try_different_location")
                  : t("no_companies_description")}
              </p>
              {(searchQuery || selectedCategory || selectedLocation) && (
                <button
                  onClick={clearFilters}
                  className="mt-4 inline-flex items-center px-4 py-2 bg-[#3B546A] text-white rounded-md hover:bg-[#2A3E50] transition-colors"
                >
                  <X className="h-4 w-4 mr-2" />
                  {t("clear_all_filters")}
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
});

export default FeaturedCompanies;
