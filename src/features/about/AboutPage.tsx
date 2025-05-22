import React from 'react';
import Layout from '../../components/layout/Layout';
import { Building2, Users, Shield, Trophy } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const AboutPage: React.FC = () => {
  return (
    <Layout>
      <Helmet>
        <title>About Us | CProMart</title>
        <meta name="description" content="Learn more about Construction Market and our mission to connect quality construction companies with clients." />
      </Helmet>
      <div className="bg-gray-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-[#1A2531] py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 text-4xl font-bold text-white sm:text-5xl">
                About Construction Market
              </h1>
              <p className="text-lg text-gray-300">
                Connecting quality construction companies with clients who need their expertise.
                We're building the future of construction networking.
              </p>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-12 text-3xl font-bold text-gray-900">Our Mission</h2>
              <p className="text-lg text-gray-600">
                We aim to revolutionize how construction companies and clients connect,
                making it easier for quality construction services to be discovered and
                for projects to find the perfect contractors.
              </p>
            </div>

            <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#3B546A]">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Quality Companies</h3>
                <p className="text-gray-600">
                  We carefully vet and showcase the best construction companies.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#3B546A]">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Easy Connection</h3>
                <p className="text-gray-600">
                  Simple and direct communication between clients and companies.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#3B546A]">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Trust & Security</h3>
                <p className="text-gray-600">
                  Verified companies and secure communication channels.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#3B546A]">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Excellence</h3>
                <p className="text-gray-600">
                  Promoting and rewarding outstanding service quality.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-white py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">Our Story</h2>
              <div className="prose prose-lg mx-auto text-gray-600">
                <p className="mb-4">
                  Construction Market was founded with a simple yet powerful idea:
                  make it easier for construction companies to showcase their work
                  and for clients to find the right contractors for their projects.
                </p>
                <p className="mb-4">
                  We understand the challenges both construction companies and clients
                  face in finding each other and establishing trust. That's why we've
                  created a platform that brings transparency, reliability, and
                  efficiency to the construction industry.
                </p>
                <p>
                  Today, we're proud to be the leading platform connecting quality
                  construction companies with clients across various sectors,
                  from residential to commercial and industrial projects.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage