import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { ReactNode, useContext } from 'react';

const CompanyProtectedRoute = ({ children }: {children: ReactNode}) => {
    const { user } = useContext(AuthContext);
  if (!user || user.role !== 'COMPANY_ADMIN') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default CompanyProtectedRoute;