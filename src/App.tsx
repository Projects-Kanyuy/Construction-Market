import { Toaster } from "react-hot-toast";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";

import ProtectedRoute from "./context/AdminProtectedRoute";
import CompanyProtectedRoute from "./context/CompanyProtectedRoute";
import { getLocation } from "./utils/location";
import Spinner from "./components/common/Spinner";
import { logVisitorActivity } from "./utils/logVisitorActivity";
import { initFacebookPixel } from "./utils/facebookPixel";

// Lazy loaded components
const HomePage = lazy(() => import("./features/home/HomePage"));
const CategoryPage = lazy(() => import("./features/category/CategoryPage"));
const CompanyDetailPage = lazy(() => import("./features/company/CompanyDetailPage"));
const CompaniesPage = lazy(() => import("./features/company/CompaniesListing"));
const ContactPage = lazy(() => import("./features/contact/ContactPage"));
const AboutPage = lazy(() => import("./features/about/AboutPage"));

// Admin Dashboard
const AdminDashboard = lazy(() => import("./features/admin/AdminDashboard"));
const AdminUsers = lazy(() => import("./features/admin/AdminUsers"));
const AdminCompanies = lazy(() => import("./features/admin/AdminCompanies"));
const AdminCategories = lazy(() => import("./features/admin/AdminCategories"));
const AdminProjects = lazy(() => import("./features/admin/AdminProjects"));

// Company Dashboard
const CompanyDashboard = lazy(() => import("./features/company/dashboard/CompanyDashboard"));
const CompanyProfile = lazy(() => import("./features/company/dashboard/CompanyProfile"));
const CompanyProjects = lazy(() => import("./features/company/dashboard/CompanyProjects"));

// Auth
const SignInPage = lazy(() => import("./features/auth/SignInPage"));
const RegisterPage = lazy(() => import("./features/auth/RegisterPage"));

function App() {
  useEffect(() => {
    getLocation().catch((err) => {
      console.warn("Location access denied or failed:", err.message);
    });

    logVisitorActivity();
    initFacebookPixel();
  }, []);

  return (
    <>
      <Toaster position="top-right" />
      <Router>
        {/* Suspense fallback can be a spinner or simple text */}
        <Suspense fallback={<Spinner />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/companies" element={<CompaniesPage />} />
            <Route path="/category/:categoryId" element={<CategoryPage />} />
            <Route path="/company/:slug" element={<CompanyDetailPage />} />
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

            {/* login and Register page routes */}
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </Suspense>
      </Router>
    </>
  );
}

export default App;
