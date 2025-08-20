import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated || user.role !== "admin") {
    return <Navigate to="/signin" />;
  }

  return children;
};

export default AdminRoute;
