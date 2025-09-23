import axios from 'axios';

// The guide says the endpoint is /api/companies/profile/:slug
const API_URL = '/api/companies/';

// Get a single company by its slug
const getCompanyBySlug = async (slug) => {
  const response = await axios.get(API_URL + 'profile/' + slug);
  return response.data;
};

const companyService = {
  getCompanyBySlug,
};

export default companyService;