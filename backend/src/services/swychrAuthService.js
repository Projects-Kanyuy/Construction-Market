import axios from 'axios';

class SwyChrAuthService {
  constructor() {
    this.baseURL = process.env.SWYCHR_API_BASE_URL;
    this.email = process.env.SWYCHR_EMAIL;
    this.password = process.env.SWYCHR_PASSWORD;
    this.authToken = null;
    this.tokenExpiry = null;
  }

  /**
   * Get authentication token from SwyChr API
   * @returns {Promise<string>} Authentication token
   */
  async getAuthToken() {
    try {
      // Check if we have a valid token that hasn't expired
      if (this.authToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
        return this.authToken;
      }

      // Request new token
      const response = await axios.post(`${this.baseURL}/admin/auth`, {
        email: this.email,
        password: this.password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200 && response.data) {
        // Assuming the response contains the token
        // You may need to adjust this based on the actual API response structure
        this.authToken = response.data.token || response.data.access_token || response.data.authToken;

        // Set token expiry (assuming 1 hour validity, adjust as needed)
        this.tokenExpiry = Date.now() + (55 * 60 * 1000); // 55 minutes to be safe

        console.log('✅ SwyChr authentication token obtained successfully');
        return this.authToken;
      } else {
        throw new Error('Invalid authentication response from SwyChr');
      }
    } catch (error) {
      console.error('❌ SwyChr authentication failed:', error.message);

      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }

      throw new Error(`SwyChr authentication failed: ${error.message}`);
    }
  }

  /**
   * Make authenticated request to SwyChr API
   * @param {string} endpoint - API endpoint
   * @param {string} method - HTTP method
   * @param {Object} data - Request data
   * @returns {Promise<Object>} API response
   */
  async makeAuthenticatedRequest(endpoint, method = 'GET', data = null) {
    try {
      const token = await this.getAuthToken();

      const config = {
        method,
        url: `${this.baseURL}${endpoint}`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };

      if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        config.data = data;
      }

      const response = await axios(config);
      return response.data;
    } catch (error) {
      // If we get 401, token might be expired, try to refresh
      if (error.response && error.response.status === 401) {
        this.authToken = null;
        this.tokenExpiry = null;

        // Retry once with new token
        const token = await this.getAuthToken();
        const config = {
          method,
          url: `${this.baseURL}${endpoint}`,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        };

        if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
          config.data = data;
        }

        const response = await axios(config);
        return response.data;
      }

      throw error;
    }
  }

  /**
   * Clear stored authentication token
   */
  clearToken() {
    this.authToken = null;
    this.tokenExpiry = null;
  }
}

// Export singleton instance
export default new SwyChrAuthService();