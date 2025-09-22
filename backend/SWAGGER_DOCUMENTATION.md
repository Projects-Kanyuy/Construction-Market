# Construction Market API - Swagger Documentation

Complete Swagger/OpenAPI 3.0 documentation has been implemented for all API endpoints in the Construction Market backend.

## 🚀 Access the Documentation

### Local Development
- **Swagger UI**: http://localhost:5000/api-docs
- **JSON Spec**: http://localhost:5000/api-docs.json

### Production
- **Swagger UI**: https://api.constructionmarket.com/api-docs
- **JSON Spec**: https://api.constructionmarket.com/api-docs.json

## 📚 What's Documented

### ✅ Complete API Coverage

All endpoints are fully documented with:

### 🏢 **Company Management** (7 endpoints)
- `GET /api/companies` - List companies with location filtering
- `GET /api/companies/by-id/{id}` - Get company by ID
- `GET /api/companies/profile/{slug}` - **Shareable profile links**
- `POST /api/companies/{identifier}/view` - Track profile views
- `POST /api/companies` - Create company (Admin)
- `PUT /api/companies/{id}` - Update company (Admin)
- `DELETE /api/companies/{id}` - Delete company (Admin)

### 💳 **Payment Processing** (6 endpoints)
- `GET /api/payments/services` - Get payment services & pricing
- `POST /api/payments/webhook/{provider}` - Payment webhooks
- `POST /api/payments/create` - Create payment
- `GET /api/payments/verify/{orderId}` - Verify payment
- `GET /api/payments/history/{companyId}` - Payment history
- `POST /api/payments/refund/{orderId}` - Process refunds (Admin)

### 🔐 **Authentication & Users** (4 endpoints)
- `POST /api/users/login` - User login
- `GET /api/users` - Get all users (Admin)
- `POST /api/users/register` - Register user (Admin)
- `PUT /api/users/{id}` - Update user (Admin)
- `DELETE /api/users/{id}` - Delete user (Admin)

### 📊 **Activity Logs** (2 endpoints)
- `POST /api/activity_logs` - Create activity log
- `GET /api/activity_logs` - Get activity logs (Admin)

### 🏷️ **Categories** (2 endpoints)
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category

### ❤️ **Health Check** (1 endpoint)
- `GET /api/health` - API health status

## 🎯 Key Features Highlighted in Documentation

### 🔗 **Shareable Profile Links**
- **Endpoint**: `GET /api/companies/profile/{slug}`
- **Purpose**: SEO-friendly company profile URLs
- **Usage**: Social media sharing, WhatsApp, email campaigns
- **Format**: `yoursite.com/company/{company-slug}`

### 🌍 **Location-Based Filtering**
- **Geospatial Search**: Use latitude, longitude, radius parameters
- **Traditional Filtering**: City, country, category filters
- **MongoDB Integration**: 2dsphere indexes for optimized queries

### 💸 **Multi-Provider Payment System**
- **Providers**: Stripe, Flutterwave, Paystack support
- **Services**: Featured listings, premium subscriptions, verification
- **Webhooks**: Automatic payment status updates
- **Currencies**: USD, XAF, NGN support

### 📈 **Analytics Integration**
- **Facebook Pixel**: Client-side and company-side tracking
- **Google Analytics 4**: Comprehensive event tracking
- **Activity Logs**: Custom analytics and user behavior tracking

## 📋 Schema Definitions

### Comprehensive Data Models

All endpoints include detailed schema definitions:

- **Company**: Complete company model with all fields
- **Payment**: Payment records with provider details
- **User**: User accounts with role-based access
- **ActivityLog**: User activity tracking
- **Category**: Company categorization
- **Error**: Standardized error responses

### Request/Response Examples

Every endpoint includes:
- ✅ **Request examples** with sample data
- ✅ **Response examples** for all status codes
- ✅ **Parameter descriptions** with validation rules
- ✅ **Authentication requirements** clearly marked

## 🔒 Security Documentation

### JWT Authentication
- **Login Process**: Detailed authentication flow
- **Token Usage**: Bearer token requirements
- **Admin Access**: Role-based endpoint restrictions
- **Token Expiration**: 7-day default expiration

### Authorization Levels
- **Public**: No authentication required
- **Protected**: Valid JWT token required
- **Admin Only**: Admin role required

## 🧪 Testing with Swagger UI

### Interactive Testing
The Swagger UI provides:

1. **Try It Out**: Interactive endpoint testing
2. **Authentication**: Built-in token management
3. **Parameter Input**: Form-based parameter entry
4. **Response Display**: Formatted response viewing
5. **Schema Validation**: Real-time input validation

### Authentication Setup
1. Login via `POST /api/users/login`
2. Copy the returned JWT token
3. Click "Authorize" button in Swagger UI
4. Enter token as `Bearer {your-token}`
5. Test protected endpoints

## 📱 Client Integration

### Code Generation
The OpenAPI spec supports automatic client generation for:

- **JavaScript/TypeScript**: Using OpenAPI Generator
- **Python**: Using swagger-codegen
- **PHP**: Using OpenAPI Generator
- **Java**: Using swagger-codegen
- **C#**: Using NSwag or swagger-codegen

### Example Usage

```bash
# Generate TypeScript client
npx @openapitools/openapi-generator-cli generate \
  -i http://localhost:5000/api-docs.json \
  -g typescript-axios \
  -o ./src/api
```

## 🎨 Swagger UI Customization

### Custom Styling
- **No Topbar**: Cleaner interface
- **Custom Colors**: Brand-appropriate color scheme
- **Persistent Auth**: Token persistence across sessions
- **Enhanced Features**: Request duration display, filtering

### Features Enabled
- ✅ **Explorer**: Browse endpoints easily
- ✅ **Persistent Authorization**: Stay logged in
- ✅ **Request Duration**: Monitor API performance
- ✅ **Filtering**: Search through endpoints
- ✅ **Extensions Display**: Additional OpenAPI features

## 🛠️ Development Guide

### Adding New Endpoints

When adding new endpoints, follow this pattern:

```javascript
/**
 * @swagger
 * /api/your-endpoint:
 *   get:
 *     summary: Brief description
 *     description: |
 *       Detailed description with:
 *       - **Key features** highlighted
 *       - **Use cases** clearly listed
 *       - **Important notes** emphasized
 *     tags: [YourTag]
 *     parameters:
 *       - in: query/path/header
 *         name: paramName
 *         schema:
 *           type: string
 *         description: Parameter description
 *         example: "example value"
 *     responses:
 *       200:
 *         description: Success response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/YourSchema'
 */
```

### Schema Definitions

Add new schemas to `/src/config/swagger.js`:

```javascript
YourSchema: {
  type: 'object',
  properties: {
    field: {
      type: 'string',
      example: 'example value',
      description: 'Field description'
    }
  }
}
```

## 🔍 Validation & Testing

### Endpoint Coverage
- ✅ **All 22 endpoints** documented
- ✅ **All HTTP methods** covered
- ✅ **All response codes** documented
- ✅ **All parameters** described
- ✅ **Authentication** properly marked

### Schema Validation
- ✅ **Request schemas** defined
- ✅ **Response schemas** defined
- ✅ **Error schemas** standardized
- ✅ **Data types** properly specified
- ✅ **Examples** provided for all fields

## 📈 Benefits

### For Developers
- **Faster Integration**: Clear API documentation
- **Reduced Errors**: Schema validation and examples
- **Interactive Testing**: Built-in testing interface
- **Code Generation**: Automatic client generation

### For API Users
- **Self-Service**: Complete documentation available
- **Real-Time Testing**: Try endpoints immediately
- **Clear Examples**: Copy-paste ready code samples
- **Comprehensive Coverage**: Every endpoint documented

### For Maintenance
- **Living Documentation**: Auto-updated from code
- **Consistent Format**: Standardized documentation
- **Version Control**: Documentation versioned with code
- **Team Collaboration**: Shared understanding

## 🚀 Getting Started

### 1. Start the Server
```bash
npm install
npm run dev
```

### 2. Access Documentation
Visit: http://localhost:5000/api-docs

### 3. Authenticate (Optional)
- Use `POST /api/users/login` to get a token
- Click "Authorize" and enter your Bearer token

### 4. Explore & Test
- Browse endpoints by category
- Try out the interactive examples
- Test the shareable profile links feature
- Experiment with location-based filtering

---

**🎉 The Construction Market API now has complete, interactive documentation with every endpoint, parameter, and response thoroughly documented and ready for use!**