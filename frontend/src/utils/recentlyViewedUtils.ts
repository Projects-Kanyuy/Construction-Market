import { Company } from '../types';

// Maximum number of recently viewed companies to store
const MAX_RECENTLY_VIEWED = 10;

// Local storage key
const RECENTLY_VIEWED_KEY = 'construction-market-recently-viewed';

// Get recently viewed companies from local storage
export const getRecentlyViewedIds = (): string[] => {
  try {
    const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error retrieving recently viewed companies:', error);
  }
  return [];
};

// Add a company to recently viewed
export const addToRecentlyViewed = (companyId: string): void => {
  try {
    // Get current list
    let recentlyViewed = getRecentlyViewedIds();
    
    // Remove if already in list (to move to front)
    recentlyViewed = recentlyViewed.filter(id => id !== companyId);
    
    // Add to front of list
    recentlyViewed.unshift(companyId);
    
    // Trim to max length
    if (recentlyViewed.length > MAX_RECENTLY_VIEWED) {
      recentlyViewed = recentlyViewed.slice(0, MAX_RECENTLY_VIEWED);
    }
    
    // Save back to local storage
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(recentlyViewed));
  } catch (error) {
    console.error('Error adding to recently viewed companies:', error);
  }
};

// Sort companies based on recently viewed status
export const sortByRecentlyViewed = (companies: Company[]): Company[] => {
  const recentlyViewedIds = getRecentlyViewedIds();
  
  return [...companies].sort((a, b) => {
    // Get positions in recently viewed list
    const posA = recentlyViewedIds.indexOf(a.id);
    const posB = recentlyViewedIds.indexOf(b.id);
    
    // If both are not in recently viewed, sort by view count
    if (posA === -1 && posB === -1) {
      return b.viewCount - a.viewCount;
    }
    
    // If only one is in recently viewed
    if (posA === -1) return -1; // a is not recently viewed, should come first
    if (posB === -1) return 1;  // b is not recently viewed, should come first
    
    // If both are in recently viewed, sort by position (higher index first)
    return posA - posB;
  });
};