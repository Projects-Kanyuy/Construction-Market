# SwyChr Payment Integration

This document describes the SwyChr payment system integration for the Construction Market backend.

## Overview

SwyChr has been integrated as the default payment provider for the Construction Market platform. The integration includes:

- Authentication token management
- Payment link creation
- Payment status verification
- Support for multiple currencies
- Automatic currency detection based on user location

## Configuration

### Environment Variables

Add the following variables to your `.env` file:

```bash
# Payment Provider Configuration
DEFAULT_PAYMENT_PROVIDER=swychr

# SwyChr Payment Provider
SWYCHR_EMAIL=your-swychr-email@example.com
SWYCHR_PASSWORD=your-swychr-password
SWYCHR_API_BASE_URL=https://api.accountpe.com/api/payin
```

**Note**: Replace the placeholder email and password with your actual SwyChr credentials.

## API Endpoints

The SwyChr integration follows the OpenAPI specification provided:

### Authentication
- **POST** `/admin/auth` - Get authentication token

### Payment Operations
- **POST** `/create_payment_links` - Create payment link
- **POST** `/payment_link_status` - Check payment status

## Implementation Details

### Files Added/Modified

1. **SwyChr Authentication Service** (`src/services/swychrAuthService.js`)
   - Handles token acquisition and management
   - Automatic token refresh
   - Authenticated API requests

2. **SwyChr Payment Provider** (`src/services/providers/swychrProvider.js`)
   - Implements the PaymentProvider interface
   - Handles payment creation and verification
   - Currency and country code mapping

3. **Payment Configuration** (`src/config/payments.js`)
   - Registers SwyChr provider
   - Automatic provider initialization

4. **Payment Controller** (`src/controllers/paymentController.js`)
   - Updated to return payment URLs for frontend redirection
   - Added SwyChr to available providers

### Currency Support

The integration supports the following currencies:
- USD (US Dollar)
- EUR (Euro)
- GBP (British Pound)
- NGN (Nigerian Naira)
- XAF (Central African CFA Franc)
- XOF (West African CFA Franc)
- GHS (Ghanaian Cedi)
- KES (Kenyan Shilling)
- UGX (Ugandan Shilling)
- TZS (Tanzanian Shilling)
- ZAR (South African Rand)

### Country to Currency Mapping

The system automatically maps countries to their local currencies:

```javascript
const currencyMap = {
  'US': 'USD',
  'GB': 'GBP',
  'NG': 'NGN',
  'CM': 'XAF', // Cameroon
  'GH': 'GHS',
  'KE': 'KES',
  'UG': 'UGX',
  'TZ': 'TZS',
  'ZA': 'ZAR'
  // ... more mappings
};
```

## Frontend Integration

The frontend integration guide has been updated with:

1. **Currency Detection**: Automatic detection based on user location
2. **SwyChr Payment Flow**: Redirect to SwyChr payment pages
3. **Return URL Handling**: Proper handling of payment success/failure
4. **Multi-Provider Support**: Allow users to choose payment providers

### Key Frontend Features

- **Location-based currency detection**
- **Payment provider selection**
- **Real-time payment verification**
- **Facebook Pixel tracking integration**
- **Responsive payment flow**

## Testing

### 1. Start the Server
```bash
cd backend
npm start
```

### 2. Test Payment Services Endpoint
```bash
curl -X GET http://localhost:5000/api/payments/services
```

Expected response should include SwyChr in `availableProviders`.

### 3. Test Payment Creation (with authentication)
```bash
curl -X POST http://localhost:5000/api/payments/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "companyId": "COMPANY_ID",
    "amount": 29.99,
    "currency": "USD",
    "service": "featured_listing",
    "duration": 30,
    "provider": "swychr"
  }'
```

## Payment Flow

1. **User selects service** → Frontend displays currency-appropriate pricing
2. **Payment initiation** → Backend creates payment with SwyChr
3. **User redirection** → Frontend redirects to SwyChr payment page
4. **Payment completion** → SwyChr redirects back to success/cancel URL
5. **Payment verification** → Backend verifies payment status
6. **Service activation** → System applies payment benefits to company

## Security Considerations

- Authentication tokens are automatically managed and refreshed
- All API calls are secured with Bearer token authentication
- Payment verification is performed server-side
- No sensitive credentials are exposed to frontend

## Error Handling

The integration includes comprehensive error handling:

- **Authentication failures**: Automatic token refresh
- **Payment creation errors**: Detailed error messages
- **Network timeouts**: Retry mechanisms
- **Invalid responses**: Graceful fallbacks

## Production Deployment

Before deploying to production:

1. Update `.env` with production SwyChr credentials
2. Verify `SWYCHR_API_BASE_URL` points to production API
3. Test payment flow with small amounts
4. Configure proper return URLs for production domain
5. Set up monitoring for payment failures

## Support

For SwyChr-specific issues:
- Check SwyChr API documentation
- Verify authentication credentials
- Monitor server logs for detailed error messages

For integration issues:
- Check `SWYCHR_INTEGRATION.md` (this file)
- Review `FRONTEND_INTEGRATION_GUIDE.md`
- Test with curl commands provided above