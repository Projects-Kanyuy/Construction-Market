import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { ReactNode, useContext } from 'react';

const ProtectedRoute = ({ children }: {children: ReactNode}) => {
    const { user } = useContext(AuthContext);
  if (!user || user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;