import React from 'react';
import HeroSection from './HeroSection';
import CategorySection from './CategorySection';
import FeaturedCompanies from './FeaturedCompanies';
import Layout from '../../components/layout/Layout';
import { Helmet } from 'react-helmet-async';

const HomePage: React.FC = () => {
  return (
    <Layout>
      <Helmet>
        <title>Home | CProMart</title>
        <meta name="description" content="Find the best construction companies, services, and tools near you." />
      </Helmet>
      <div id="home">
        <HeroSection />
      </div>
      <div id="categories">
        <CategorySection />
      </div>
      <FeaturedCompanies />
    </Layout>
  );
};

export default HomePage;