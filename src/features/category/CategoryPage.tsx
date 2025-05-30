import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import SearchBar from "../../components/common/SearchBar";
import CompanyCard from "../../components/common/CompanyCard";
import { Category, CompanyData } from "../../types";
import { fetchCategories, getCompaniesByCategory } from "../../api/api";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { getLocation } from "../../utils/location";

const CategoryPage: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const category = location.state?.category;
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<CompanyData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    loadCompanies();
    loadCategories();
  }, [category.id]);

  const loadCompanies = async () => {
    setLoading(true);
    try {
      const location = await getLocation();
      const response = await getCompaniesByCategory(category.id!, location.lat, location.lon);
      setCompanies(response.data);
      setFilteredCompanies(response.data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetchCategories();
      const filtered = response.data.filter(
        (cat: Category) => cat.id !== Number(category.id)
      );
      setCategories(filtered);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setFilteredCompanies(companies);
      return;
    }

    const normalizedQuery = query.toLowerCase().trim();
    const filtered = companies.filter(
      (company) =>
        company.name.toLowerCase().includes(normalizedQuery) ||
        company.description?.toLowerCase().includes(normalizedQuery) ||
        company.location?.toLowerCase().includes(normalizedQuery)
    );

    setFilteredCompanies(filtered);
  };

  const handleCategoryClick = (selectedCategory: Category) => {
    navigate(`/category/${selectedCategory.name}`, {
      state: { category: selectedCategory },
    });
  };

  return (
    <Layout>
      <Helmet>
        <title>{t("category_title", { category_name: category.name })}</title>
        <meta
          name="description"
          content={t("category_description", { category_name: category.name })}
        />
      </Helmet>
      {/* Hero section with category info */}
      <section className="relative min-h-[300px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={`https://api.cpromart.site${category.image}`}
            alt={category.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30"></div>
        </div>

        <div className="container relative mx-auto px-4 py-24 sm:py-32">
          <div className="max-w-2xl">
            <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl">
              {category.name}
            </h1>
            <p className="text-lg text-gray-200">{category.description}</p>
          </div>
        </div>
      </section>

      {/* Other categories section */}
      {categories.length > 0 && (
        <section className="hidden lg:block bg-white py-6">
          <div className="container mx-auto px-4">
            <h2 className="mb-5 text-lg font-medium text-gray-600">
              {t("more_categories")}
            </h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat)}
                  className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-xs transition-all hover:border-primary-300 hover:bg-primary-50 hover:text-primary-600 hover:shadow-md hover:-translate-y-0.5 duration-200"
                >
                  {cat.image && (
                    <div className="h-6 w-6 overflow-hidden rounded-full">
                      <img
                        src={`https://api.cpromart.site${cat.image}`}
                        alt={cat.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Search and filter section */}
      <section className="bg-white py-8 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="w-full md:w-2/3">
              <SearchBar
                onSearch={handleSearch}
                placeholder={`Search ${category.name} companies...`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Companies list */}
      {loading ? (
        <p className="m-4 text-xl font-bold text-gray-900">
          {t("loading_companies")}
        </p>
      ) : (
        <section className="bg-gray-50 py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                {filteredCompanies.length > 0
                  ? ""
                  : t('no_companies')}
              </h2>
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
                <p className="text-gray-600">{t("no_companies_description")}</p>
              </div>
            )}
          </div>
        </section>
      )}
    </Layout>
  );
};

export default CategoryPage;
