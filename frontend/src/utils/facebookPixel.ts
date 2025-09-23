// Inside: src/utils/facebookPixel.ts
import { Company } from "../types";
import { CompanySearchFilters } from "../api/api";

// This tells TypeScript that the 'fbq' function exists on the window object.
declare global {
  interface Window {
    fbq: (...args: any[]) => void;
  }
}

/**
 * A helper function to safely call the fbq function.
 * @param {...any} args - Arguments to pass to fbq.
 */
const track = (...args: any[]) => {
  if (typeof window.fbq !== 'function') {
    // In development, it's useful to know if the pixel is missing.
    console.warn("Facebook Pixel (fbq) not found. Tracking call was ignored.");
    return;
  }
  window.fbq(...args);
};

/**
 * Tracks when a user views a company profile page.
 * Corresponds to the 'ViewContent' standard event.
 * @param {Company} company - The company data object from the API.
 */
export const trackCompanyView = (company: Company) => {
  track('track', 'ViewContent', {
    content_type: 'company_profile',
    content_ids: [company._id],
    content_name: company.name,
    content_category: company.category,
  });
};

/**
 * Tracks when a user performs a search.
 * Corresponds to the 'Search' standard event.
 * @param {CompanySearchFilters} filters - The search filters used.
 * @param {number} resultCount - The number of results returned.
 */
export const trackSearch = (filters: CompanySearchFilters, resultCount: number) => {
  track('track', 'Search', {
    search_string: filters.search || '',
    content_category: filters.category || '',
    num_items: resultCount,
  });
};

/**
 * Tracks when a user shares a company profile.
 * Corresponds to the 'Share' standard event.
 * @param {Company} company - The company data object.
 * @param {string} method - The method of sharing (e.g., 'Copy Link', 'WhatsApp').
 */
export const trackShare = (company: Company, method: string) => {
  track('track', 'Share', {
    method: method,
    content_type: 'company_profile',
    content_id: company._id,
  });
};