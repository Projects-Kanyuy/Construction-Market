import React, { useState, useContext } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import Button from "../../components/common/Button";
import { LogIn } from "lucide-react";
import { loginUser } from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import { Helmet } from "react-helmet-async";

const SignInPage: React.FC = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const res = await loginUser(formData); // expects { email, password }
      const { token, user } = res.data;

      login(user, token);
      toast.success("Login successful!");

      // Role-based redirects
      const role = user.role.toLowerCase(); // normalize to lowercase
      if (role === "admin" || role === "super_admin") {
        navigate("/admin");
      } else if (role === "company_admin") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      toast.error(
        "Login failed! Please check your credentials and network connection."
      );
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Sign In | CProMart</title>
        <meta
          name="description"
          content="Sign in to your Construction Market account."
        />
      </Helmet>
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{" "}
              <Link
                to="/register"
                className="font-medium text-[#3B546A] hover:text-[#2A3E50]"
              >
                register your company
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="relative block w-full rounded-t-md border-0 px-1 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:outline-none focus:ring-[#3B546A] sm:text-sm sm:leading-6"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="relative block w-full rounded-b-md border-0 px-1 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:outline-none focus:ring-[#3B546A] sm:text-sm sm:leading-6"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={loading}
                icon={<LogIn size={18} />}
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default SignInPage;
