import React from 'react';
import HeroSection from './HeroSection';
import CategorySection from './CategorySection';
import FeaturedCompanies from './FeaturedCompanies';
import Layout from '../../components/layout/Layout';

const HomePage: React.FC = () => {
  return (
    <Layout>
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