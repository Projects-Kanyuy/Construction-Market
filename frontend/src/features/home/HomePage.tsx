import React from "react";
// import HeroSection from "./HeroSection";
// import CategorySection from "./CategorySection";
import FeaturedCompanies from "./FeaturedCompanies";
import Layout from "../../components/layout/Layout";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Layout>
      <Helmet>
        <title>{t("home_title")}</title>
        <meta
          name="description"
          content="Find the best construction companies, services, and tools near you."
        />
      </Helmet>
      <div id="home">{/* <HeroSection /> */}</div>
      {/* <div id="categories"><CategorySection /></div> */}
      <FeaturedCompanies />
    </Layout>
  );
};

export default HomePage;
