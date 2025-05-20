import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ReactNode, useContext } from 'react';

const ProtectedRoute = ({ children }: {children: ReactNode}) => {
    const { isAuthenticated } = useContext(AuthContext);
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;