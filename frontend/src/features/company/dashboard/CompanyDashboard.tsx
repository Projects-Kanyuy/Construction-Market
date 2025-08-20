import React from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { User, FolderKanban } from 'lucide-react';

const CompanyDashboard: React.FC = () => {
  const companyLinks = [
    {
      to: '/dashboard/profile',
      icon: <User className="h-5 w-5" />,
      label: 'Company Profile'
    },
    {
      to: '/dashboard/projects',
      icon: <FolderKanban className="h-5 w-5" />,
      label: 'Projects'
    }
  ];

  return (
    <DashboardLayout
      title="Company Dashboard"
      links={companyLinks}
    />
  );
};

export default CompanyDashboard;