import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { Navigate } from "react-router-dom";

interface Props {
  children: JSX.Element;
}

const CompanyProtectedRoute: React.FC<Props> = ({ children }) => {
  const { user, isAuthenticated } = useContext(AuthContext);

  if (
    !isAuthenticated ||
    !user ||
    user.role.toLowerCase() !== "company_admin"
  ) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default CompanyProtectedRoute;
