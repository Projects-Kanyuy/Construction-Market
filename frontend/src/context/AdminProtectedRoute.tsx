import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { Navigate } from "react-router-dom";

interface Props {
  children: JSX.Element;
}

const AdminProtectedRoute: React.FC<Props> = ({ children }) => {
  const { user, isAuthenticated } = useContext(AuthContext);

  if (
    !isAuthenticated ||
    !user ||
    !["admin", "super_admin"].includes(user.role.toLowerCase())
  ) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
