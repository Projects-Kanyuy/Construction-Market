import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Building2, Search } from "lucide-react";
import { useTranslation } from "react-i18next";

import { AuthContext } from "../../context/AuthContext";

const Header: React.FC = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
  }`;

  const textColor =
    // isScrolled || location.pathname !== "/" ? "text-[#1A2531]" : "text-white";
    isScrolled || location.pathname !== "/"
      ? "text-[#1A2531]"
      : "text-[#1A2531]";

  //
  const { user, isAuthenticated, logout } = useContext(AuthContext);

  return (
    <header className={headerClasses}>
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link to="/" className="flex items-center">
          <img
            src="/src/assets/cipromart-logo.png"
            alt="CProMart Logo"
            className="h-12 w-auto mr-1"
          />
          <span className={`text-xl font-bold ${textColor}`}>CProMart</span>
        </Link>

        <nav className="hidden md:block">
          <ul className="flex items-center  space-x-8 ">
            <li>
              <Link
                to="/"
                className={`${textColor} font-medium transition-colors hover:text-[#FF9D42]`}
              >
                {t("home")}
              </Link>
            </li>

            <li>
              <Link
                to="/about"
                className={`${textColor} font-medium transition-colors hover:text-[#FF9D42]`}
              >
                {t("about")}
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className={`${textColor} font-medium transition-colors hover:text-[#FF9D42]`}
              >
                {t("contact")}
              </Link>
            </li>
            {/* <li>
              {isAuthenticated ? (
                <div>
                  {user.role == "USER" ? (
                    <button
                      className={`${textColor} font-medium transition-colors hover:text-[#FF9D42]`}
                      onClick={logout}
                    >
                      Logout
                    </button>
                  ) : (
                    <Link
                      to={user.role == "ADMIN" ? "/admin" : "/dashboard"}
                      className={`${textColor} font-medium transition-colors hover:text-[#FF9D42]`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                </div>
              ) : (
                <Link
                  to="/signin"
                  className={`${textColor} font-medium transition-colors hover:text-[#FF9D42]`}
                >
                  Sign In
                </Link>
              )}
            </li> */}
          </ul>
        </nav>

        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? (
            <X className={`h-6 w-6 ${textColor}`} />
          ) : (
            <Menu className={`h-6 w-6 ${textColor}`} />
          )}
        </button>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 top-[57px] z-40 bg-white md:hidden">
          <nav className="container mx-auto px-4 py-6">
            <ul className="space-y-4">
              <li>
                <Link
                  to="/"
                  className="block text-lg font-medium text-gray-900"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t("home")}
                </Link>
              </li>
              {/* <li>
                <Link
                  to="/categories"
                  className="block text-lg font-medium text-gray-900"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t("cateories")}
                </Link>
              </li> */}
              <li>
                <Link
                  to="/about"
                  className="block text-lg font-medium text-gray-900"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t("about")}
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="block text-lg font-medium text-gray-900"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t("contact")}
                </Link>
              </li>

              {/* <li>
                {isAuthenticated ? (
                  <div>
                    {user.role == "USER" ? (
                      <button
                        className="block text-lg font-medium text-gray-900"
                        onClick={() => {
                          setIsMenuOpen(false);
                          logout();
                        }}
                      >
                        Logout
                      </button>
                    ) : (
                      <Link
                        to={user.role == "ADMIN" ? "/admin" : "/dashboard"}
                        className="block text-lg font-medium text-gray-900"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                    )}
                  </div>
                ) : (
                  <Link
                    to="/signin"
                    className="block text-lg font-medium text-gray-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                )}
              </li> */}
            </ul>

            <div className="mt-6">
              <Link
                to="/search"
                className="flex items-center rounded-lg bg-gray-100 px-4 py-3 text-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                <Search className="mr-2 h-5 w-5" />
                <span>{t("search_for_companies")}</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
