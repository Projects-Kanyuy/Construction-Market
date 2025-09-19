# Construction Market Backend - Implementation Guide

This document provides comprehensive information about the implemented features and how to set up, test, and deploy the Construction Market backend API.

## 🚀 Features Implemented

### ✅ 1. Shareable Profile Links
- **Unique URLs**: Each company has a unique slug-based URL (e.g., `/api/companies/profile/abc-constructions`)
- **Auto-generated slugs**: Created automatically from company names
- **Profile URLs**: Full shareable URLs stored in database
- **View tracking**: Profile view counts for analytics

**Endpoints:**
- `GET /api/companies/profile/:slug` - Get company by slug
- `POST /api/companies/:identifier/view` - Track profile views

### ✅ 2. Facebook Pixel & Analytics Integration
- **Dual tracking**: Separate pixels for client-side and company-side tracking
- **Google Analytics 4**: Integrated GA4 for comprehensive analytics
- **Automatic event tracking**: Search, view, and registration events
- **Webhook support**: Real-time event processing

**Tracked Events:**
- **Search**: When users search for companies
- **ViewContent**: When users view company profiles
- **CompleteRegistration**: User and company registrations

### ✅ 3. Location-Based Filtering
- **Geospatial queries**: MongoDB 2dsphere indexes for location search
- **Radius filtering**: Find companies within specified distance
- **Country/city filtering**: Traditional text-based location filtering
- **Coordinates support**: Latitude/longitude for precise positioning

**Query Parameters:**
- `latitude`, `longitude`, `radius` - Geospatial search
- `city`, `country` - Text-based filtering

### ✅ 4. Generic Payment Provider System
- **Provider abstraction**: Support for multiple payment providers
- **Currently supported**: Stripe, Flutterwave (easily extensible)
- **Payment services**: Featured listings, premium subscriptions, verification
- **Webhook handling**: Automatic payment status updates
- **Refund support**: Process refunds through providers

**Payment Services:**
- **Featured Listing**: Priority placement in search results
- **Premium Subscription**: Full feature access with verification
- **Company Verification**: Blue checkmark verification

### ✅ 5. Enhanced Company Model
- **Geolocation**: Coordinates and geospatial indexing
- **Status tracking**: Featured until, premium until dates
- **View analytics**: Profile view counts
- **SEO optimization**: Unique slugs for better URLs

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── cloudinary.js       # Image upload configuration
│   │   ├── db.js              # Database connection
│   │   └── payments.js        # Payment provider initialization
│   ├── controllers/
│   │   ├── companyController.js  # Company CRUD + location filtering
│   │   ├── paymentController.js  # Payment processing
│   │   └── ...other controllers
│   ├── middleware/
│   │   ├── tracking.js        # Facebook Pixel & GA4 tracking
│   │   └── ...other middleware
│   ├── models/
│   │   ├── Company.js         # Enhanced company model
│   │   ├── Payment.js         # Payment records
│   │   └── ...other models
│   ├── routes/
│   │   ├── companyRoutes.js   # Company endpoints with tracking
│   │   ├── paymentRoutes.js   # Payment endpoints
│   │   └── ...other routes
│   ├── services/
│   │   ├── paymentService.js  # Generic payment service
│   │   └── providers/
│   │       ├── stripeProvider.js     # Stripe integration
│   │       └── flutterwaveProvider.js # Flutterwave integration
│   └── app.js                 # Express app configuration
├── .env.example              # Environment variables template
├── .env                      # Your environment variables
├── package.json             # Dependencies and scripts
└── server.js               # Application entry point
```

## 🔧 Environment Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and configure your values:

```bash
cp .env.example .env
```

### Required Variables:
```env
# Basic Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
MONGO_URI=mongodb://localhost:27017/construction_market
JWT_SECRET=your-super-secret-jwt-key

# Cloudinary (Required for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

### Optional but Recommended:
```env
# Facebook Pixel Tracking
FACEBOOK_PIXEL_CLIENT_ID=your-client-pixel-id
FACEBOOK_PIXEL_COMPANY_ID=your-company-pixel-id
FACEBOOK_PIXEL_ACCESS_TOKEN=your-facebook-access-token

# Google Analytics 4
GA4_MEASUREMENT_ID=G-XXXXXXXXXX
GA4_API_SECRET=your-ga4-api-secret

# Payment Providers
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-stripe-webhook-secret
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-your-flutterwave-secret-key
```

### 3. Start Development Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## 🧪 Testing the Implementation

### 1. Test Company Creation with Location

```bash
curl -X POST http://localhost:5000/api/companies \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "ABC Construction Ltd",
    "description": "Leading construction company",
    "category": "Construction",
    "city": "Lagos",
    "country": "Nigeria",
    "latitude": 6.5244,
    "longitude": 3.3792,
    "phone": "+234123456789",
    "email": "info@abc-construction.com"
  }'
```

### 2. Test Shareable Profile Links

```bash
# Get company by slug (returns shareable profile)
curl http://localhost:5000/api/companies/profile/abc-construction-ltd

# Track profile view
curl -X POST http://localhost:5000/api/companies/abc-construction-ltd/view
```

### 3. Test Location-Based Filtering

```bash
# Find companies within 50km of Lagos
curl "http://localhost:5000/api/companies?latitude=6.5244&longitude=3.3792&radius=50000"

# Filter by city and country
curl "http://localhost:5000/api/companies?city=Lagos&country=Nigeria"
```

### 4. Test Payment Services

```bash
# Get available payment services
curl http://localhost:5000/api/payments/services

# Create a payment for featured listing
curl -X POST http://localhost:5000/api/payments/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "companyId": "COMPANY_ID",
    "amount": 29.99,
    "currency": "USD",
    "service": "featured_listing",
    "duration": 30,
    "provider": "stripe"
  }'
```

## 🔍 API Endpoints Reference

### Company Management
- `GET /api/companies` - List companies (with filtering)
- `GET /api/companies/by-id/:id` - Get company by ID
- `GET /api/companies/profile/:slug` - Get company by slug (shareable)
- `POST /api/companies/:identifier/view` - Track profile view
- `POST /api/companies` - Create company (admin)
- `PUT /api/companies/:id` - Update company (admin)
- `DELETE /api/companies/:id` - Delete company (admin)

### Payment Processing
- `GET /api/payments/services` - Get payment services & pricing
- `POST /api/payments/create` - Create payment
- `GET /api/payments/verify/:orderId` - Verify payment
- `GET /api/payments/history/:companyId` - Get payment history
- `POST /api/payments/webhook/:provider` - Payment webhooks
- `POST /api/payments/refund/:orderId` - Process refund (admin)

### Query Parameters for Company Listing
- `search` - Search in name, description, tags
- `category` - Filter by category
- `city` - Filter by city (regex)
- `country` - Filter by country (regex)
- `latitude`, `longitude`, `radius` - Geospatial search
- `page`, `limit` - Pagination

## 🔒 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configurable origins
- **Helmet**: Security headers
- **XSS Protection**: Input sanitization
- **JWT Authentication**: Secure API access
- **Admin-only routes**: Protected administrative functions

## 📊 Analytics & Tracking

### Facebook Pixel Events
- **Search**: Triggered when users search companies
- **ViewContent**: Triggered when viewing company profiles
- **CompleteRegistration**: Triggered for user/company signups

### Google Analytics 4 Events
- Same events as Facebook Pixel with additional parameters
- Custom dimensions for better segmentation

## 🚀 Deployment Checklist

### 1. Environment Configuration
- [ ] Set `NODE_ENV=production`
- [ ] Configure production database URL
- [ ] Set strong JWT secret
- [ ] Configure payment providers for production
- [ ] Set up SSL certificates

### 2. Database Setup
- [ ] Create production MongoDB database
- [ ] Set up proper indexes (automatically created)
- [ ] Configure database backups

### 3. External Services
- [ ] Configure Cloudinary for production
- [ ] Set up Facebook Business Manager
- [ ] Configure Google Analytics 4
- [ ] Set up payment provider accounts
- [ ] Configure webhooks with proper endpoints

### 4. Security
- [ ] Configure CORS for production domains
- [ ] Set up SSL/HTTPS
- [ ] Configure rate limiting
- [ ] Review and update security headers

### 5. Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Configure logging
- [ ] Set up uptime monitoring
- [ ] Configure alerts

## 🔧 Maintenance & Monitoring

### Database Maintenance
```bash
# Check expired featured listings
db.companies.find({
  featured: true,
  featuredUntil: { $lt: new Date() }
})

# Clean up expired payments
db.payments.deleteMany({
  status: "pending",
  expiresAt: { $lt: new Date() }
})
```

### Analytics Queries
```bash
# Most viewed companies
db.companies.find().sort({ viewCount: -1 }).limit(10)

# Payment statistics
db.payments.aggregate([
  { $group: { _id: "$status", count: { $sum: 1 }, total: { $sum: "$amount" } } }
])
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check MONGO_URI in .env
   - Ensure MongoDB is running
   - Check network connectivity

2. **Cloudinary Upload Fails**
   - Verify Cloudinary credentials
   - Check file size limits
   - Ensure proper middleware setup

3. **Payment Webhook Issues**
   - Verify webhook URL in provider dashboard
   - Check webhook secret configuration
   - Monitor webhook logs

4. **Facebook Pixel Not Tracking**
   - Verify pixel IDs and access tokens
   - Check browser network requests
   - Ensure proper headers are sent

### Debug Commands
```bash
# Check environment variables
npm run debug-env

# Test database connection
npm run test-db

# Validate payment providers
npm run test-payments
```

## 🤝 Support

For technical support or questions:
- Email: support@constructionmarket.com
- Documentation: Check this guide and code comments
- Issues: Report bugs through the issue tracker

---

*This implementation provides a complete, production-ready backend for the Construction Market platform with all specified features.*