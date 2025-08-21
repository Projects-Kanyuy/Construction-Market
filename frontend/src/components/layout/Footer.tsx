import React from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
} from "lucide-react";
// import { Category } from "../../types";
// import { fetchCategories } from "../../api/api";
import { useTranslation } from "react-i18next";

const Footer: React.FC = () => {
  const { t } = useTranslation();
  // const [categories, setCategories] = useState<Category[]>([]);
  const currentYear = new Date().getFullYear();

  // useEffect(() => {
  //   loadCategories();
  // }, [categories]);

  // const loadCategories = async () => {
  //   try {
  //     const response = await fetchCategories();
  //     setCategories(response.data.slice(0, 4));
  //   } catch (error) {
  //     console.log("Error fetching categories:", error);
  //   }
  // };

  const textColor = "text-[#fff]";
  return (
    <footer className="bg-[#1A2531] text-white">
      <div id="about" className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo and About */}
          <div>
            <Link to="/" className="flex items-center">
              <img
                src="/src/assets/cipromart-logo.png"
                alt="CProMart Logo"
                className="h-12 w-auto mr-1"
              />
              <span className={`text-xl font-bold ${textColor}`}>CProMart</span>
            </Link>
            <p className="mb-4 text-gray-300">{t("connecting_with_top")}</p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-300 transition-colors hover:text-[#FF9D42]"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-300 transition-colors hover:text-[#FF9D42]"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-gray-300 transition-colors hover:text-[#FF9D42]"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-300 transition-colors hover:text-[#FF9D42]"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Categories */}
          {/* <div>
            <h3 className="mb-4 text-lg font-semibold">{t('cateories')}</h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link to={`/category/${category.name}`} className="text-gray-300 transition-colors hover:text-[#FF9D42]" state={{ category }}>{category.name}</Link>
                </li>
              ))}
              <li>
                  <Link to={'/categories'} className="text-gray-300 transition-colors hover:text-[#FF9D42]">See more Categories</Link>
              </li>
            </ul>
          </div> */}

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">{t("quick_links")}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 transition-colors hover:text-[#FF9D42]"
                >
                  {t("home")}
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-300 transition-colors hover:text-[#FF9D42]"
                >
                  {t("about_us")}
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-300 transition-colors hover:text-[#FF9D42]"
                >
                  {t("contact")}
                </Link>
              </li>
              {/* <li><Link to="/privacy" className="text-gray-300 transition-colors hover:text-[#FF9D42]">Privacy Policy</Link></li> */}
              {/* <li><Link to="/terms" className="text-gray-300 transition-colors hover:text-[#FF9D42]">Terms of Service</Link></li> */}
            </ul>
          </div>

          {/* Contact */}
          <div id="contact">
            <h3 className="mb-4 text-lg font-semibold">{t("contact_us")}</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-[#FF9D42]" />
                <span className="text-gray-300">cpromart1@gmail.com</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-5 w-5 text-[#FF9D42]" />
                <span className="text-gray-300">+237 674 77 25 69</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-700 pt-8 text-center">
          <p className="text-sm text-gray-400">
            &copy; {currentYear} Construction Professionals Marketplace. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
