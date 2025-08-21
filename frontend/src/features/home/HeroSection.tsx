import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/common/Button";
import { AuthContext } from "../../context/AuthContext";
import monument from "../../assets/reunification_monument.jpg";
import { useTranslation } from "react-i18next";

const HeroSection: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <section className="relative overflow-hidden bg-[#1A2531] py-20 md:py-10">
      <div className="container relative mx-auto px-4 z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Header Content */}
          <div className="mb-12">
            <div className="mb-4 inline-block rounded-full bg-[#dcad13]/20 px-4 py-1.5 text-sm font-semibold text-[#dcad13]">
              {t("find_best_construction")}
            </div>

            <h1 className="mb-6 text-2xl font-bold leading-tight text-white md:text-2xl lg:text-3xl">
              {t("build")} <span className="text-[#dcad13]">{t("dream")}</span>{" "}
              {t("rigth_partners")}
            </h1>

            <p className="mb-8 text-lg text-gray-300 md:text-xl">
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
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
