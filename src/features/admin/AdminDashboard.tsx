import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Users, Building2, FolderKanban, LayoutGrid } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const adminLinks = [
    {
      to: '/admin/users',
      icon: <Users className="h-5 w-5" />,
      label: 'Users'
    },
    {
      to: '/admin/companies',
      icon: <Building2 className="h-5 w-5" />,
      label: 'Companies'
    },
    {
      to: '/admin/categories',
      icon: <LayoutGrid className="h-5 w-5" />,
      label: 'Categories'
    },
    {
      to: '/admin/projects',
      icon: <FolderKanban className="h-5 w-5" />,
      label: 'Projects'
    }
  ];

  return (
    <DashboardLayout
      title="Admin Dashboard"
      links={adminLinks}
    />
  );
};

export default AdminDashboard;