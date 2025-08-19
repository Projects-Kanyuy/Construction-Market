import React, { useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { CompanyData } from "../../types";
import Layout from "../../components/layout/Layout";
import Button from "../../components/common/Button";
import {
  Globe,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Calendar,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { fetchCompanyById } from "../../api/api";
import Spinner from "../../components/common/Spinner";
import { trackCustomEvent } from "../../utils/facebookPixel";

const CompanyDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [company, setCompany] = React.useState<CompanyData | null>(
    location.state?.company || null
  );
  const [loading, setLoading] = React.useState<boolean>(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!company && id) {
      try {
        const companyId = parseInt(id, 10);
        if (!isNaN(companyId)) {
          setLoading(true);
          fetchCompanyById(companyId)
            .then((res) => setCompany(res.data))
            .catch((err) => console.error("Failed to fetch company:", err))
            .finally(() => setLoading(false));
        }
      } catch (error) {
        console.error("Invalid ID:", error);
      }
    }
  }, [company, id]);

  if (loading) {
    return <Spinner />;
  }

  if (!company) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20">
          <h1 className="mb-8 text-3xl font-bold text-center">
            {t("company_not_found")}
          </h1>
          <div className="flex justify-center">
            <Link to="/">
              <Button variant="primary">{t("return_to_home")}</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const whatsappLink = `https://wa.me/${company.phone?.replace(/\D/g, "")}`;

  return (
    <Layout>
      <Helmet>
        <title>{t("company_title", { company_name: company.name })}</title>
        <meta
          name="description"
          content={t("company_description", { company_name: company.name })}
        />
      </Helmet>
      {/* Company Header */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
            <div className="h-24 w-24 overflow-hidden rounded-lg bg-gray-200 md:h-32 md:w-32">
              <img
                src={company.logoUrl || "/placeholder-logo.png"}
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

                {/* categories page deleted so i commented this out */}
                {/* <div className="flex flex-wrap gap-2">
                  {company.categories?.map((category) => (
                    <Link
                      key={category.id}
                      to={`/category/${category.name}`}
                      state={{ category }}
                      className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-200"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div> */}
              </div>
            </div>

            <div>
              <a
                href={company.phone ? whatsappLink : "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  onClick={() =>
                    trackCustomEvent("ContactViaWhatsApp", {
                      company: company.name,
                    })
                  }
                  variant="secondary"
                  size="large"
                  icon={<Phone size={18} />}
                >
                  {t("contact_via_whatsapp")}
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
                <h2 className="mb-4 text-2xl font-bold text-gray-900">
                  {t("about")}
                </h2>
                <p className="text-gray-700">{company.description}</p>
              </div>

              {/* Past Projects */}
              <div className="mb-12 rounded-xl bg-white p-6 shadow-sm md:p-8">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">
                  {t("projects")}
                </h2>

                {company.projects && company.projects.length > 0 ? (
                  <div className="space-y-8">
                    {company.projects.map((project) => (
                      <div
                        key={project.id}
                        className="overflow-hidden rounded-lg border border-gray-200"
                      >
                        <div className="h-64 w-full overflow-hidden bg-gray-200">
                          <img
                            src={`https://api.cpromart.site${project.image}`}
                            alt={project.title}
                            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                        </div>

                        <div className="p-6">
                          <div className="mb-3 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-900">
                              {project.title}
                            </h3>
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
                  <p className="text-gray-600">{t("no_projects")}</p>
                )}
              </div>
            </div>

            {/* Contact Information Sidebar */}
            <div className="order-1 lg:order-2">
              <div className="sticky top-24 rounded-xl bg-white p-6 shadow-sm md:p-8">
                <h2 className="mb-6 text-xl font-bold text-gray-900">
                  {t("contact_information")}
                </h2>

                <div className="space-y-5">
                  <div className="flex items-start">
                    <Phone className="mr-3 h-5 w-5 text-[#3B546A]" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        {t("phone")}
                      </p>
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
                      <p className="text-sm font-medium text-gray-500">
                        {t("email")}
                      </p>
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
                      <p className="text-sm font-medium text-gray-500">
                        {t("location")}
                      </p>
                      <p className="text-gray-900">{company.location}</p>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                {(company.website ||
                  company.facebook ||
                  company.twitter ||
                  company.instagram ||
                  company.linkedin) && (
                  <div className="mt-8">
                    <h3 className="mb-4 text-lg font-medium text-gray-900">
                      {t("social_media")}
                    </h3>
                    <div className="flex space-x-4">
                      {company.website && (
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-colors hover:bg-[#3B546A] hover:text-white"
                        >
                          <Globe size={18} />
                        </a>
                      )}
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
                    {t("contact_via_whatsapp")}
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
