import { Toaster } from "react-hot-toast";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";

// --- Route Protection and Utilities ---
import AdminProtectedRoute from "./context/AdminProtectedRoute";
import CompanyProtectedRoute from "./context/CompanyProtectedRoute";
import Spinner from "./components/common/Spinner";
import { logVisitorActivity } from "./utils/logVisitorActivity";

// --- Lazy Loaded Page Components ---
const HomePage = lazy(() => import("./features/home/HomePage"));
const CategoryPage = lazy(() => import("./features/category/CategoryPage"));
const CompanyDetailPage = lazy(() => import("./features/company/CompanyDetailPage"));
const CompaniesListing = lazy(() => import("./features/company/CompaniesListing"));
const ContactPage = lazy(() => import("./features/contact/ContactPage"));
const AboutPage = lazy(() => import("./features/about/AboutPage"));

// --- Admin Dashboard Components ---
const AdminDashboard = lazy(() => import("./features/admin/AdminDashboard"));
const AdminUsers = lazy(() => import("./features/admin/AdminUsers"));
const AdminCompanies = lazy(() => import("./features/admin/AdminCompanies"));
const AdminCategories = lazy(() => import("./features/admin/AdminCategories"));
const AdminProjects = lazy(() => import("./features/admin/AdminProjects"));

// --- Company Dashboard Components ---
const CompanyDashboard = lazy(() => import("./features/company/dashboard/CompanyDashboard"));
const CompanyProfile = lazy(() => import("./features/company/dashboard/CompanyProfile"));
const CompanyProjects = lazy(() => import("./features/company/dashboard/CompanyProjects"));
//const CompanyRegistrationPage = lazy(() => import("./features/company/CompanyRegistrationPage")); // Import the new registration page

// --- Auth Components ---
const SignInPage = lazy(() => import("./features/auth/SignInPage"));
const RegisterPage = lazy(() => import("./features/auth/RegisterPage"));

function App() {
  // This useEffect is now only for logging visitor activity on initial app load.
  // The location and Facebook Pixel logic has been moved to the components that need it.
  useEffect(() => {
    logVisitorActivity();
  }, []);

  return (
    <>
      <Toaster position="top-right" />
      <Router>
        <Suspense fallback={<Spinner />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/companies" element={<CompaniesListing />} />
            <Route path="/category/:categoryId" element={<CategoryPage />} />
            <Route path="/company/:slug" element={<CompanyDetailPage />} />
            {/* Note: You had two routes for listing companies, I've kept the main one. */}
            {/* If "/company" should also list companies, you can add: <Route path="/company" element={<CompaniesListing />} /> */}
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <AdminProtectedRoute>
                  <AdminDashboard />
                </AdminProtectedRoute>
              }
            >
              <Route index element={<Navigate to="users" replace />} /> {/* Redirect from /admin to /admin/users */}
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
              <Route index element={<Navigate to="profile" replace />} /> {/* Redirect from /dashboard to /dashboard/profile */}
              <Route path="profile" element={<CompanyProfile />} />
              <Route path="projects" element={<CompanyProjects />} />
            </Route>

            {/* Company Management Routes (Protected) */}
            <Route
              path="/company/register"
              element={
                <CompanyProtectedRoute>
                 {/* <CompanyRegistrationPage />*/}
                </CompanyProtectedRoute>
              }
            />

            {/* Auth Routes */}
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Catch-all: Redirects any unknown URL to the homepage */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </>
  );
}

export default App;