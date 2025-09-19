# Frontend Integration Guide - Construction Market Backend

This document provides complete frontend integration instructions for all backend features.

## Table of Contents

1. [Facebook Pixel Integration](#facebook-pixel-integration)
2. [Shareable Profile Links Implementation](#shareable-profile-links-implementation)
3. [Location-Based Filtering](#location-based-filtering)
4. [Payment System Integration](#payment-system-integration)
5. [Company Management](#company-management)
6. [User Authentication](#user-authentication)
7. [Activity Tracking](#activity-tracking)
8. [API Endpoints Reference](#api-endpoints-reference)

---

## Facebook Pixel Integration

### 1. Client-Side Setup

Add Facebook Pixel to your HTML head section:

```html
<!-- Facebook Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');

fbq('init', 'YOUR_CLIENT_PIXEL_ID');
fbq('track', 'PageView');
</script>
```

### 2. Custom Event Tracking

#### Search Events
Track when users search for companies:

```javascript
// When user performs a search
function trackSearch(searchQuery, filters, resultCount) {
  fbq('track', 'Search', {
    search_string: searchQuery,
    content_category: filters.category || '',
    content_location: filters.location || '',
    num_items: resultCount,
    currency: 'USD'
  });
}

// Example usage
const searchResults = await searchCompanies(query, filters);
trackSearch(query, filters, searchResults.total);
```

#### Company View Events
Track when users view company profiles:

```javascript
// When user views a company profile
function trackCompanyView(company) {
  fbq('track', 'ViewContent', {
    content_type: 'company_profile',
    content_ids: [company._id],
    content_name: company.name,
    content_category: company.category,
    custom_content: {
      company_slug: company.slug,
      company_location: `${company.city}, ${company.country}`,
      view_type: 'profile_page'
    }
  });
}

// Example usage on company profile page
useEffect(() => {
  if (company) {
    trackCompanyView(company);
  }
}, [company]);
```

#### Registration Events
Track when companies register:

```javascript
// When a company completes registration
function trackCompanyRegistration(company) {
  fbq('track', 'CompleteRegistration', {
    content_name: company.name,
    content_category: company.category,
    custom_content: {
      registration_type: 'company',
      company_location: `${company.city}, ${company.country}`
    }
  });
}
```

### 3. Sending Headers to Backend

Include Facebook Pixel tracking headers in API requests:

```javascript
// Get Facebook click and browser IDs
function getFacebookIds() {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    fbc: urlParams.get('fbclid') || document.cookie.match(/_fbc=([^;]*)/)?.[1],
    fbp: document.cookie.match(/_fbp=([^;]*)/)?.[1] || generateFbp()
  };
}

// Include in API requests
async function apiRequest(url, options = {}) {
  const facebookIds = getFacebookIds();

  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Facebook-Click-ID': facebookIds.fbc || '',
      'X-Facebook-Browser-ID': facebookIds.fbp || '',
      ...options.headers
    }
  });
}
```

---

## Shareable Profile Links Implementation

### 1. URL Structure

Companies have shareable URLs in this format:
- **Backend endpoint**: `/api/companies/profile/{slug}`
- **Frontend route**: `/company/{slug}`

### 2. Routing Setup

#### React Router Example:

```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/company/:slug" element={<CompanyProfilePage />} />
        <Route path="/companies" element={<CompanyListPage />} />
        {/* other routes */}
      </Routes>
    </BrowserRouter>
  );
}
```

### 3. Company Profile Page Implementation

```javascript
import { useParams, useEffect, useState } from 'react';

function CompanyProfilePage() {
  const { slug } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCompanyProfile();
  }, [slug]);

  const loadCompanyProfile = async () => {
    try {
      setLoading(true);

      // Fetch company by slug
      const response = await fetch(`/api/companies/profile/${slug}`);

      if (!response.ok) {
        throw new Error('Company not found');
      }

      const companyData = await response.json();
      setCompany(companyData);

      // Track view for analytics
      await trackProfileView(slug);

      // Track Facebook Pixel event
      trackCompanyView(companyData);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const trackProfileView = async (identifier) => {
    try {
      await fetch(`/api/companies/${identifier}/view`, {
        method: 'POST'
      });
    } catch (err) {
      console.warn('Failed to track view:', err);
    }
  };

  if (loading) return <div>Loading company profile...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!company) return <div>Company not found</div>;

  return (
    <div>
      <CompanyHeader company={company} />
      <ShareableProfileSection company={company} />
      <CompanyDetails company={company} />
      <CompanyGallery images={company.images} />
      <ContactSection company={company} />
    </div>
  );
}
```

### 4. Copy Profile Link Feature

```javascript
function ShareableProfileSection({ company }) {
  const [copied, setCopied] = useState(false);

  const copyProfileLink = async () => {
    try {
      // Use the profileUrl from the API response
      await navigator.clipboard.writeText(company.profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      // Track sharing event
      fbq('track', 'Share', {
        content_type: 'company_profile',
        content_name: company.name
      });
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  return (
    <div className="share-section">
      <h3>Share this company</h3>
      <div className="share-controls">
        <input
          type="text"
          value={company.profileUrl}
          readOnly
          className="profile-url-input"
        />
        <button onClick={copyProfileLink} className="copy-button">
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>

      <div className="social-share-buttons">
        <button onClick={() => shareToWhatsApp(company.profileUrl, company.name)}>
          Share on WhatsApp
        </button>
        <button onClick={() => shareToFacebook(company.profileUrl)}>
          Share on Facebook
        </button>
        <button onClick={() => shareViaEmail(company.profileUrl, company.name)}>
          Share via Email
        </button>
      </div>
    </div>
  );
}

// Social sharing functions
function shareToWhatsApp(url, companyName) {
  const text = encodeURIComponent(`Check out ${companyName}: ${url}`);
  window.open(`https://wa.me/?text=${text}`, '_blank');
}

function shareToFacebook(url) {
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
}

function shareViaEmail(url, companyName) {
  const subject = encodeURIComponent(`Check out ${companyName}`);
  const body = encodeURIComponent(`I found this company that might interest you: ${url}`);
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
}
```

---

## Location-Based Filtering

### 1. Geolocation Detection

```javascript
function useGeolocation() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
        setLoading(false);
      },
      (error) => {
        setError(error.message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  return { location, error, loading, getCurrentLocation };
}
```

### 2. Location-Based Company Search

```javascript
function CompanySearch() {
  const [companies, setCompanies] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    city: '',
    country: '',
    useLocation: false,
    radius: 25000 // 25km default
  });
  const { location, getCurrentLocation } = useGeolocation();

  const searchCompanies = async () => {
    try {
      const params = new URLSearchParams();

      // Basic filters
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.city) params.append('city', filters.city);
      if (filters.country) params.append('country', filters.country);

      // Location-based filtering
      if (filters.useLocation && location) {
        params.append('latitude', location.latitude);
        params.append('longitude', location.longitude);
        params.append('radius', filters.radius);
      }

      const response = await apiRequest(`/api/companies?${params}`);
      const data = await response.json();

      setCompanies(data.items);

      // Track search event
      trackSearch(filters.search, filters, data.total);

    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const enableLocationFilter = async () => {
    await getCurrentLocation();
    setFilters(prev => ({ ...prev, useLocation: true }));
  };

  return (
    <div className="company-search">
      <div className="search-filters">
        <input
          type="text"
          placeholder="Search companies..."
          value={filters.search}
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
        />

        <select
          value={filters.category}
          onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
        >
          <option value="">All Categories</option>
          <option value="Construction">Construction</option>
          <option value="Architecture">Architecture</option>
          <option value="Engineering">Engineering</option>
        </select>

        <input
          type="text"
          placeholder="City"
          value={filters.city}
          onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
        />

        <input
          type="text"
          placeholder="Country"
          value={filters.country}
          onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
        />

        <div className="location-filter">
          <label>
            <input
              type="checkbox"
              checked={filters.useLocation}
              onChange={(e) => {
                if (e.target.checked) {
                  enableLocationFilter();
                } else {
                  setFilters(prev => ({ ...prev, useLocation: false }));
                }
              }}
            />
            Use my location
          </label>

          {filters.useLocation && (
            <select
              value={filters.radius}
              onChange={(e) => setFilters(prev => ({ ...prev, radius: parseInt(e.target.value) }))}
            >
              <option value="5000">Within 5km</option>
              <option value="10000">Within 10km</option>
              <option value="25000">Within 25km</option>
              <option value="50000">Within 50km</option>
              <option value="100000">Within 100km</option>
            </select>
          )}
        </div>

        <button onClick={searchCompanies}>Search</button>
      </div>

      <CompanyList companies={companies} showDistance={filters.useLocation} userLocation={location} />
    </div>
  );
}
```

### 3. Distance Calculation Display

```javascript
function CompanyList({ companies, showDistance, userLocation }) {
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  return (
    <div className="company-list">
      {companies.map(company => (
        <div key={company._id} className="company-card">
          <div className="company-header">
            <h3>{company.name}</h3>
            {showDistance && userLocation && company.coordinates && (
              <span className="distance">
                {calculateDistance(
                  userLocation.latitude,
                  userLocation.longitude,
                  company.coordinates.latitude,
                  company.coordinates.longitude
                ).toFixed(1)}km away
              </span>
            )}
          </div>

          <p>{company.description}</p>
          <p>{company.city}, {company.country}</p>

          <div className="company-actions">
            <Link to={`/company/${company.slug}`}>View Profile</Link>
            <button onClick={() => trackCompanyView(company)}>
              Track View
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## Payment System Integration

### 1. Payment Services Display

```javascript
function PaymentServices() {
  const [services, setServices] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPaymentServices();
  }, []);

  const loadPaymentServices = async () => {
    try {
      const response = await fetch('/api/payments/services');
      const data = await response.json();
      setServices(data.data);
    } catch (error) {
      console.error('Failed to load payment services:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading payment services...</div>;

  return (
    <div className="payment-services">
      <h2>Upgrade Your Company Profile</h2>

      {Object.entries(services.services).map(([serviceKey, service]) => (
        <div key={serviceKey} className="service-card">
          <h3>{service.name}</h3>
          <p>{service.description}</p>

          <div className="pricing">
            {Object.entries(service.prices.USD).map(([duration, price]) => (
              <div key={duration} className="price-option">
                <span className="duration">{duration} days</span>
                <span className="price">${price}</span>
                <PaymentButton
                  service={serviceKey}
                  duration={parseInt(duration)}
                  amount={price}
                  currency="USD"
                />
              </div>
            ))}
          </div>

          <ul className="features">
            {service.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
```

### 2. Payment Processing

```javascript
function PaymentButton({ service, duration, amount, currency, companyId }) {
  const [loading, setLoading] = useState(false);

  const initiatePayment = async () => {
    try {
      setLoading(true);

      const paymentData = {
        companyId,
        amount,
        currency,
        service,
        duration,
        provider: 'stripe', // or let user choose
        returnUrl: `${window.location.origin}/payment/success`,
        cancelUrl: `${window.location.origin}/payment/cancel`
      };

      const response = await apiRequest('/api/payments/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(paymentData)
      });

      const result = await response.json();

      if (result.success) {
        // Redirect to payment provider
        window.location.href = result.data.providerData.checkoutUrl;

        // Track payment initiation
        fbq('track', 'InitiateCheckout', {
          content_type: 'service',
          content_name: service,
          value: amount,
          currency: currency
        });
      } else {
        throw new Error(result.message);
      }

    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment initiation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={initiatePayment}
      disabled={loading}
      className="payment-button"
    >
      {loading ? 'Processing...' : `Pay $${amount}`}
    </button>
  );
}
```

### 3. Payment Success/Failure Handling

```javascript
function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState('verifying');

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    try {
      const orderId = searchParams.get('order_id');

      if (!orderId) {
        setVerificationStatus('failed');
        return;
      }

      const response = await apiRequest(`/api/payments/verify/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });

      const result = await response.json();

      if (result.success && result.data.payment.status === 'completed') {
        setVerificationStatus('success');

        // Track successful payment
        fbq('track', 'Purchase', {
          value: result.data.payment.amount,
          currency: result.data.payment.currency,
          content_type: 'service'
        });
      } else {
        setVerificationStatus('failed');
      }

    } catch (error) {
      console.error('Payment verification failed:', error);
      setVerificationStatus('failed');
    }
  };

  if (verificationStatus === 'verifying') {
    return <div>Verifying your payment...</div>;
  }

  if (verificationStatus === 'success') {
    return (
      <div className="payment-success">
        <h2>Payment Successful!</h2>
        <p>Your service has been activated. Thank you for your purchase.</p>
        <Link to="/dashboard">Go to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="payment-failed">
      <h2>Payment Failed</h2>
      <p>There was an issue with your payment. Please try again.</p>
      <Link to="/services">Try Again</Link>
    </div>
  );
}
```

---

## Company Management

### 1. Company Registration Form

```javascript
function CompanyRegistrationForm() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    country: '',
    city: '',
    latitude: '',
    longitude: '',
    tags: '',
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: ''
  });
  const [files, setFiles] = useState({
    logo: null,
    banner: null,
    images: []
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    // Add text fields
    Object.keys(formData).forEach(key => {
      if (formData[key]) {
        formDataToSend.append(key, formData[key]);
      }
    });

    // Add files
    if (files.logo) formDataToSend.append('logo', files.logo);
    if (files.banner) formDataToSend.append('banner', files.banner);
    files.images.forEach(image => {
      formDataToSend.append('images', image);
    });

    try {
      const response = await fetch('/api/companies', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: formDataToSend
      });

      const result = await response.json();

      if (response.ok) {
        // Track registration
        trackCompanyRegistration(result);

        // Redirect to company profile
        window.location.href = `/company/${result.slug}`;
      } else {
        throw new Error(result.message);
      }

    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="company-registration-form">
      {/* Form fields implementation */}
    </form>
  );
}
```

---

## User Authentication

### 1. Login Implementation

```javascript
function LoginForm() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (data.success) {
        // Store token
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        value={credentials.email}
        onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={credentials.password}
        onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}

// Auth utility functions
function getAuthToken() {
  return localStorage.getItem('authToken');
}

function isAuthenticated() {
  return !!getAuthToken();
}

function logout() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  window.location.href = '/login';
}
```

---

## Activity Tracking

### 1. Activity Logging

```javascript
function trackActivity(action, details = {}) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const activityData = {
    action,
    details,
    userId: user._id || null,
    sessionId: getSessionId(),
    timestamp: new Date().toISOString()
  };

  // Send to backend (non-blocking)
  fetch('/api/activity_logs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(activityData)
  }).catch(err => console.warn('Activity tracking failed:', err));
}

function getSessionId() {
  let sessionId = sessionStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
}

// Usage examples
trackActivity('page_view', { page: '/companies', referrer: document.referrer });
trackActivity('search', { query: 'construction', filters: { city: 'Lagos' } });
trackActivity('company_view', { companyId: '123', companyName: 'ABC Construction' });
```

---

## API Endpoints Reference

### Base URL
- Development: `http://localhost:5000/api`
- Production: `https://api.constructionmarket.com/api`

### Authentication
Include JWT token in headers:
```javascript
headers: {
  'Authorization': `Bearer ${token}`
}
```

### Key Endpoints

#### Companies
- `GET /companies` - List companies (with location filtering)
- `GET /companies/profile/{slug}` - Get company by slug
- `POST /companies/{identifier}/view` - Track profile view
- `POST /companies` - Create company (admin)

#### Payments
- `GET /payments/services` - Get payment services
- `POST /payments/create` - Create payment
- `GET /payments/verify/{orderId}` - Verify payment

#### Authentication
- `POST /users/login` - User login
- `GET /users` - Get all users (admin)

#### Other
- `GET /categories` - Get categories
- `POST /activity_logs` - Log activity
- `GET /health` - API health check

### Error Handling

```javascript
async function apiRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }

    return response;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
```

This guide provides complete implementation details for integrating with the Construction Market backend. Each section includes working code examples and specific instructions for proper integration.