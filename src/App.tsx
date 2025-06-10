import { Toaster } from "react-hot-toast";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "./features/home/HomePage";
import CategoryPage from "./features/category/CategoryPage";
import CompanyDetailPage from "./features/company/CompanyDetailPage";
// import CategoriesPage from "./features/categories/CategoriesPage";
import ContactPage from "./features/contact/ContactPage";
import AboutPage from "./features/about/AboutPage";
// Admin Dashboard
import AdminDashboard from "./features/admin/AdminDashboard";
import AdminUsers from "./features/admin/AdminUsers";
import AdminCompanies from "./features/admin/AdminCompanies";
import AdminCategories from "./features/admin/AdminCategories";
import AdminProjects from "./features/admin/AdminProjects";

// Company Dashboard
import CompanyDashboard from "./features/company/dashboard/CompanyDashboard";
import CompanyProfile from "./features/company/dashboard/CompanyProfile";
import CompanyProjects from "./features/company/dashboard/CompanyProjects";
import ProtectedRoute from "./context/AdminProtectedRoute";
import CompanyProtectedRoute from "./context/CompanyProtectedRoute";
import { useEffect } from "react";

import { getLocation } from "./utils/location";
import toast from "react-hot-toast";

function App() {
  useEffect(() => {
    getLocation().catch((err) => {
      console.warn("Location access denied or failed:", err.message);
      toast.error("You will not be able to access location-based features.");
    });
  }, []);
  return (
    <>
      <Toaster position="top-right" />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/categories" element={<CategoriesPage />} /> */}
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/company/:companyId" element={<CompanyDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminUsers />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="companies" element={<AdminCompanies />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="projects" element={<AdminProjects />} />
          </Route>

          {/* Company Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <CompanyProtectedRoute>
                <CompanyDashboard />
              </CompanyProtectedRoute>
            }
          >
            <Route index element={<CompanyProfile />} />
            <Route path="profile" element={<CompanyProfile />} />
            <Route path="projects" element={<CompanyProjects />} />
          </Route>

          {/* Redirect all other routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
