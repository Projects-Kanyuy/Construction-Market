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
    <section className="relative overflow-hidden bg-[#1A2531] py-20 md:py-28">
      {/* <div className="absolute inset-0 bg-gradient-to-br from-[#1A2531] to-[#324458]"></div> */}

      <div className="container relative mx-auto px-4 z-10">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <div className="mb-4 inline-block rounded-full bg-[#FF9D42]/20 px-4 py-1.5 text-sm font-semibold text-[#FF9D42]">
              {t("find_best_construction")}
            </div>

            <h1 className="mb-6 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
              {t("build")} <span className="text-[#FF9D42]">{t("dream")}</span>{" "}
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

          {/* <div className="relative hidden overflow-hidden rounded-xl shadow-2xl lg:block">
            <img
              src={monument}
              alt="Cameroon pride"
              className="h-full w-full object-cover object-center"
            />
          </div> */}
        </div>
      </div>

      {/* <div className="absolute bottom-0 left-0 right-0 translate-y-1">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 200">
          <path
            fill="#F9FAFB"
            fillOpacity="1"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,149.3C1248,139,1344,117,1392,106.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div> */}
    </section>
  );
};

export default HeroSection;
