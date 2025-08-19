import React from "react";
import { Link } from "react-router-dom";
import { CompanyData } from "../../types";
import Button from "./Button";
import { Phone } from "lucide-react";
import {
  incrementCompanyViewCount,
  incrementContactClicks,
} from "../../api/api";
import { trackCustomEvent } from "../../utils/facebookPixel";

interface CompanyCardProps {
  company: CompanyData;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  const whatsappLink = `https://wa.me/${company.phone?.replace(/\D/g, "")}`;

  const handleViewDetails = async () => {
    try {
      await incrementCompanyViewCount(company._id);
      trackCustomEvent("clickOnCompany", { company: company.name });
    } catch (error) {
      console.error("Error incrementing view count:", error);
    }
  };

  const handleWhatsAppClick = async () => {
    try {
      await incrementContactClicks(company._id);
      trackCustomEvent("ContactViaWhatsApp", { company: company.name });
    } catch (error) {
      console.error("Error incrementing contact clicks:", error);
    }
  };

  // Main image (thumbnail)
  const mainImage = company.logoUrl || "/placeholder-logo.png";

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-lg">
      {/* Main / Banner Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={mainImage}
          alt={company.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4">
          <h3 className="mb-1 text-xl font-bold text-gray-900">
            {company.name}
          </h3>
          <p className="mb-1 text-sm text-gray-600">{company.location}</p>
          <p className="line-clamp-2 text-sm text-gray-700">
            {company.description}
          </p>

          {/* Optional additional images */}
          {/* {company.images && company.images.length > 0 && (
            <div className="mt-2 flex gap-2 overflow-x-auto">
              {company.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${company.name}-${idx}`}
                  className="h-20 w-20 flex-shrink-0 rounded object-cover"
                />
              ))}
            </div>
          )} */}
        </div>

        <div className="mt-auto flex items-center justify-between">
          <Link
            to={`/company/${company.name}/${company._id}`}
            state={{ company }}
            className="text-sm font-medium text-[#3B546A] transition-colors hover:text-[#2A3E50]"
            onClick={handleViewDetails}
          >
            View Details
          </Link>

          <a
            href={company.phone ? whatsappLink : "#"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              onClick={handleWhatsAppClick}
              variant="secondary"
              size="small"
              icon={<Phone size={16} />}
            >
              Contact via WhatsApp
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;
