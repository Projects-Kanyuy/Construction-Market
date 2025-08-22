import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Building2, LogOut } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

interface SidebarLink {
  to: string;
  icon: React.ReactNode;
  label: string;
}

interface DashboardLayoutProps {
  title: string;
  links: SidebarLink[];
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ title, links }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  
  
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-[#1A2531] text-white">
        <div className="flex h-16 items-center px-6">
          <Link to="/" className="flex items-center">
            <Building2 className="mr-2 h-6 w-6 text-[#dcad13]" />
            <span className="text-lg font-bold">Construction Market</span>
          </Link>
        </div>
        
        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? 'bg-[#3B546A] text-white'
                      : 'text-gray-300 hover:bg-[#2A3E50] hover:text-white'
                  }`}
                >
                  {link.icon}
                  <span className="ml-3">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button
            onClick={() => {
              logout();
              navigate('/')
            }}
            className="flex w-full items-center rounded-lg px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-[#2A3E50] hover:text-white"
          >
            <LogOut className="h-5 w-5" />
            <span className="ml-3">Sign Out</span>
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="ml-64 flex-1 bg-gray-50">
        <header className="sticky top-0 z-10 bg-white px-8 py-4 shadow">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        </header>
        
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;