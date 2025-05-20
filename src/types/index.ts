export interface CompanyData {
  id: number;
  name: string;
  username: string;
  location?: string;
  phone?: string;
  email?: string;
  description?: string;
  logo?: string;
  categories?: { id: number; name: string }[];
  projects?: any[];
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