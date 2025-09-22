# Construction Market Backend API

Complete backend implementation for the Construction Market platform with all requested features including shareable profile links, Facebook Pixel tracking, location-based filtering, and generic payment processing.

## 🚀 Features Implemented

### ✅ 1. Shareable Profile Links
- **Unique URLs**: `yourdomain.com/company/abc-constructions`
- **Auto-generated slugs**: SEO-friendly URLs from company names
- **Copy Profile Link**: Full shareable URLs returned in API responses
- **View tracking**: Analytics for profile views

### ✅ 2. Facebook Pixel Installation
- **Client-side tracking**: Search and browse behavior
- **Company-side tracking**: Registration and listing events
- **Google Analytics 4**: Complete analytics integration
- **Real-time events**: Search, ViewContent, CompleteRegistration

### ✅ 3. Location-Based Filtering
- **Geospatial queries**: Find companies within radius
- **Auto-detection ready**: API supports coordinate-based filtering
- **Country/city filtering**: Traditional location filtering
- **MongoDB 2dsphere indexes**: Optimized location queries

### ✅ 4. Generic Payment Provider System
- **Multiple providers**: Stripe, Flutterwave (easily extensible)
- **Payment services**: Featured listings, premium subscriptions, verification
- **Webhook support**: Automatic payment processing
- **Refund capability**: Full refund processing

## 🔧 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
# Copy and configure environment variables
cp .env.example .env
# Edit .env with your actual credentials
```

### 3. Test Implementation
```bash
# Run implementation test
npm run test-implementation
```

### 4. Start Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 📱 API Endpoints

### Company Management (Enhanced)
- `GET /api/companies` - List companies with **location filtering**
  - New params: `latitude`, `longitude`, `radius` for geospatial search
  - Existing: `search`, `country`, `city`, `category`, `page`, `limit`
- `GET /api/companies/by-id/:id` - Get company by MongoDB ID
- `GET /api/companies/profile/:slug` - **🔗 Shareable profile links**
- `POST /api/companies/:identifier/view` - Track profile views
- `POST /api/companies` - Create company (admin, with tracking)
- `PUT /api/companies/:id` - Update company (admin)
- `DELETE /api/companies/:id` - Delete company (admin)

### Payment Processing (New)
- `GET /api/payments/services` - Get payment options & pricing
- `POST /api/payments/create` - Create payment
- `GET /api/payments/verify/:orderId` - Verify payment status
- `GET /api/payments/history/:companyId` - Get payment history
- `POST /api/payments/webhook/:provider` - Payment webhooks
- `POST /api/payments/refund/:orderId` - Process refund (admin)

### Authentication & Users
- `POST /api/users/login` - User login → { token, user }
- `POST /api/users/register` - Register user (admin, with tracking)
- `PUT /api/users/:id` - Update user (admin)
- `DELETE /api/users/:id` - Delete user (admin)

### Activity Logs
- `POST /api/activity_logs` - Save visitor activity
- `GET /api/activity_logs` - Get activity logs (admin)

### Health & Categories
- `GET /api/health` - Health check
- `GET /api/categories` - Get categories

## 🌍 Location Filtering Examples

### Find companies near user location:
```bash
GET /api/companies?latitude=6.5244&longitude=3.3792&radius=50000
```

### Filter by location:
```bash
GET /api/companies?city=Lagos&country=Nigeria
```

## 🔗 Shareable Profile Examples

### Access company profile:
```bash
GET /api/companies/profile/abc-construction-ltd
```

**Response includes:**
```json
{
  "name": "ABC Construction Ltd",
  "slug": "abc-construction-ltd",
  "profileUrl": "http://localhost:3000/company/abc-construction-ltd",
  "description": "...",
  "viewCount": 145,
  "...": "..."
}
```

## 💳 Payment Services Available

### Featured Listing
- **30 days**: $29.99 (USD) / ₦12,000 (NGN) / 17,500 CFA
- **Features**: Top search placement, featured badge

### Premium Subscription
- **365 days**: $199.99 (USD) / ₦80,000 (NGN) / 115,000 CFA
- **Features**: Verification badge, unlimited images, analytics

### Company Verification
- **One-time**: $49.99 (USD) / ₦20,000 (NGN) / 29,000 CFA
- **Features**: Blue checkmark verification

## 📊 Analytics & Tracking

### Facebook Pixel Events
- **Search**: Users searching for companies
- **ViewContent**: Company profile views
- **CompleteRegistration**: New user/company signups

### Google Analytics 4 Events
- Same events with additional custom parameters
- Location data, search terms, company categories

## 🔒 Environment Variables Required

### Essential:
```env
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
```

### Optional (but recommended):
```env
# Facebook Pixel
FACEBOOK_PIXEL_CLIENT_ID=your-client-pixel-id
FACEBOOK_PIXEL_COMPANY_ID=your-company-pixel-id
FACEBOOK_PIXEL_ACCESS_TOKEN=your-access-token

# Google Analytics
GA4_MEASUREMENT_ID=G-XXXXXXXXXX
GA4_API_SECRET=your-ga4-secret

# Payment Providers
STRIPE_SECRET_KEY=sk_test_your-stripe-key
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-your-flw-key
```

## 🧪 Testing

### Test the implementation:
```bash
npm run test-implementation
```

### Example API calls:
```bash
# List companies with location
curl "http://localhost:5000/api/companies?latitude=6.5244&longitude=3.3792&radius=50000"

# Get shareable profile
curl "http://localhost:5000/api/companies/profile/abc-construction-ltd"

# Track profile view
curl -X POST "http://localhost:5000/api/companies/abc-construction-ltd/view"

# Get payment services
curl "http://localhost:5000/api/payments/services"
```

## 📚 Documentation

- **[Swagger API Documentation](http://localhost:5000/api-docs)**: Interactive API documentation (when server is running)
- **[Swagger Documentation Guide](SWAGGER_DOCUMENTATION.md)**: Complete guide to using the API documentation
- **[Full Implementation Guide](IMPLEMENTATION_GUIDE.md)**: Complete setup and deployment guide
- **[Environment Variables](.env.example)**: All available configuration options

## 🚀 Deployment (Production)

### 1. Server Setup
```bash
# Use PM2 for process management
pm2 start server.js --name construction-market-api
pm2 save
pm2 startup
```

### 2. NGINX Configuration
```nginx
server {
    listen 80;
    server_name api.yoursite.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. SSL Setup
```bash
certbot --nginx -d api.yoursite.com
```

## 🎯 Key Features URLs

### Shareable Profile Links Pattern:
- **API**: `/api/companies/profile/{slug}`
- **Frontend**: `{FRONTEND_URL}/company/{slug}`
- **Example**: `https://yoursite.com/company/abc-construction-ltd`

### Copy Profile Link Feature:
All company API responses include `profileUrl` field that can be used for the "Copy Profile Link" button.

---

**✅ All specification requirements have been implemented and are ready for deployment.**

For questions or support, check the [Implementation Guide](IMPLEMENTATION_GUIDE.md) or create an issue.
