import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

const CompanyRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated || user.role !== "COMPANY_ADMIN") {
    return <Navigate to="/signin" />;
  }

  return children;
};

export default CompanyRoute;
