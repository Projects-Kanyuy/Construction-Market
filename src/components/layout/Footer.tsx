import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-[#1A2531] text-white">
      <div id="about" className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo and About */}
          <div>
            <Link to="/" className="mb-4 flex items-center">
              <Building2 className="mr-2 h-8 w-8 text-[#FF9D42]" />
              <span className="text-xl font-bold">Construction Market</span>
            </Link>
            <p className="mb-4 text-gray-300">
              Connecting you with top construction companies across various specialties.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 transition-colors hover:text-[#FF9D42]">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 transition-colors hover:text-[#FF9D42]">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 transition-colors hover:text-[#FF9D42]">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 transition-colors hover:text-[#FF9D42]">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          {/* Categories */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Categories</h3>
            <ul className="space-y-2">
              <li><Link to="/category/residential" className="text-gray-300 transition-colors hover:text-[#FF9D42]">Residential Construction</Link></li>
              <li><Link to="/category/commercial" className="text-gray-300 transition-colors hover:text-[#FF9D42]">Commercial Construction</Link></li>
              <li><Link to="/category/industrial" className="text-gray-300 transition-colors hover:text-[#FF9D42]">Industrial Construction</Link></li>
              <li><Link to="/category/renovation" className="text-gray-300 transition-colors hover:text-[#FF9D42]">Renovation & Remodeling</Link></li>
              <li><Link to="/category/infrastructure" className="text-gray-300 transition-colors hover:text-[#FF9D42]">Infrastructure</Link></li>
            </ul>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 transition-colors hover:text-[#FF9D42]">Home</Link></li>
              <li><Link to="/about" className="text-gray-300 transition-colors hover:text-[#FF9D42]">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-300 transition-colors hover:text-[#FF9D42]">Contact</Link></li>
              <li><Link to="/privacy" className="text-gray-300 transition-colors hover:text-[#FF9D42]">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-300 transition-colors hover:text-[#FF9D42]">Terms of Service</Link></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div id="contact">
            <h3 className="mb-4 text-lg font-semibold">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-[#FF9D42]" />
                <span className="text-gray-300">info@constructionmarket.com</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-5 w-5 text-[#FF9D42]" />
                <span className="text-gray-300">+1 (800) 555-CONS</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-700 pt-8 text-center">
          <p className="text-sm text-gray-400">
            &copy; {currentYear} Construction Market. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;