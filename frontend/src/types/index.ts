export interface CompanyData {
  id: number;
  name: string;
  username: string;
  location?: string;
  phone?: string;
  email?: string;
  description?: string;
  logo?: string;
  categories?: Category[];
  projects?: Project[];
  website?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;  
}

export interface Project {
  id: string;
  title: string;
  companyId: string;
  company?: any;
  year: number;
  description?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  location?: string;
}

export interface Category {
  id: number;
  name: string;
  image: string;
  description?: string;
  companies?: number;
  createdAt: string;
  updatedAt: string;
}

export interface RecentlyViewed {
  companyId: string;
  timestamp: number;
}
export interface Company {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: string; // Or this could be an object: { _id: string, name: string }
  phone: string;
  email: string;
  website?: string; // The '?' makes it optional
  address: string;
  country: string;
  city: string;
  logo?: string;
  banner?: string;
  images?: string[];
  profileUrl: string; // The guide says the backend will provide this full URL
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}
