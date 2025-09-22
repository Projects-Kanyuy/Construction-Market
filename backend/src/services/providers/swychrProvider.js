import { PaymentProvider } from '../paymentService.js';
import swychrAuthService from '../swychrAuthService.js';
import { v4 as uuidv4 } from 'uuid';

export class SwyChrProvider extends PaymentProvider {
  constructor(config) {
    super(config);
    this.baseURL = config.baseURL || process.env.SWYCHR_API_BASE_URL;
  }

  /**
   * Create a payment link with SwyChr
   * @param {Object} paymentData - Payment data
   * @returns {Promise<Object>} Payment creation result
   */
  async createPayment(paymentData) {
    try {
      const {
        orderId,
        amount,
        currency,
        description,
        metadata,
        returnUrl,
        cancelUrl
      } = paymentData;

      // Extract customer information from metadata
      const customerInfo = metadata.customerInfo || {};

      // Map currency to country code (you may need to adjust this mapping)
      const countryCode = this.getCurrencyCountryCode(currency);

      const requestPayload = {
        country_code: countryCode,
        name: customerInfo.name || 'Customer',
        email: customerInfo.email || 'customer@example.com',
        mobile: customerInfo.mobile || '', // Optional
        amount: Math.round(amount * 100), // Convert to cents/smallest unit
        transaction_id: orderId,
        description: description || 'Payment for services',
        pass_digital_charge: true // Assuming this should always be true
      };

      const response = await swychrAuthService.makeAuthenticatedRequest(
        '/create_payment_links',
        'POST',
        requestPayload
      );

      if (response.status === 200 && response.data) {
        return {
          success: true,
          transactionId: orderId,
          reference: response.transaction_id || orderId,
          status: 'pending',
          paymentUrl: response.data.payment_url || response.data.link,
          expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
          providerResponse: response
        };
      } else {
        throw new Error(`SwyChr payment creation failed: ${response.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('SwyChr payment creation error:', error);
      throw new Error(`Failed to create SwyChr payment: ${error.message}`);
    }
  }

  /**
   * Verify payment status with SwyChr
   * @param {Object} verificationData - Verification data
   * @returns {Promise<Object>} Verification result
   */
  async verifyPayment(verificationData) {
    try {
      const { transactionId, reference } = verificationData;
      const txId = transactionId || reference;

      const response = await swychrAuthService.makeAuthenticatedRequest(
        '/payment_link_status',
        'POST',
        {
          transaction_id: txId
        }
      );

      if (response.status === 200 && response.data) {
        const paymentData = response.data;

        // Map SwyChr status to our standard statuses
        let status = 'pending';
        if (paymentData.status === 'completed' || paymentData.status === 'success' || paymentData.status === 'paid') {
          status = 'completed';
        } else if (paymentData.status === 'failed' || paymentData.status === 'cancelled') {
          status = 'failed';
        }

        return {
          success: true,
          status,
          transactionId: txId,
          amount: paymentData.amount,
          currency: paymentData.currency,
          paymentMethod: paymentData.payment_method || 'swychr',
          completedAt: paymentData.completed_at ? new Date(paymentData.completed_at) : null,
          failureReason: paymentData.failure_reason || null,
          providerResponse: response
        };
      } else {
        throw new Error(`SwyChr verification failed: ${response.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('SwyChr payment verification error:', error);
      throw new Error(`Failed to verify SwyChr payment: ${error.message}`);
    }
  }

  /**
   * Process webhook from SwyChr (if supported)
   * @param {Object} webhookData - Webhook data
   * @param {string} signature - Webhook signature
   * @returns {Promise<Object>} Processed webhook data
   */
  async processWebhook(webhookData, signature) {
    try {
      // SwyChr webhook processing (implement based on their webhook format)
      // This is a placeholder implementation

      if (!webhookData || !webhookData.transaction_id) {
        throw new Error('Invalid webhook data');
      }

      const { transaction_id, status, amount, currency } = webhookData;

      // Map SwyChr webhook status to our standard statuses
      let mappedStatus = 'pending';
      if (status === 'completed' || status === 'success' || status === 'paid') {
        mappedStatus = 'completed';
      } else if (status === 'failed' || status === 'cancelled') {
        mappedStatus = 'failed';
      }

      return {
        success: true,
        orderId: transaction_id,
        status: mappedStatus,
        amount,
        currency,
        completedAt: mappedStatus === 'completed' ? new Date() : null,
        failureReason: status === 'failed' ? webhookData.failure_reason : null
      };
    } catch (error) {
      console.error('SwyChr webhook processing error:', error);
      throw new Error(`Failed to process SwyChr webhook: ${error.message}`);
    }
  }

  /**
   * Refund a payment (if supported by SwyChr)
   * @param {Object} refundData - Refund data
   * @returns {Promise<Object>} Refund result
   */
  async refundPayment(refundData) {
    // SwyChr refund implementation would go here
    // This might not be available in their API
    throw new Error('Refunds are not currently supported by SwyChr provider');
  }

  /**
   * Map currency to country code
   * @param {string} currency - Currency code
   * @returns {string} Country code
   */
  getCurrencyCountryCode(currency) {
    const currencyMap = {
      'USD': 'US',
      'EUR': 'FR', // or any EU country
      'GBP': 'GB',
      'NGN': 'NG',
      'XAF': 'CM', // Cameroon (Central African CFA franc)
      'XOF': 'SN', // Senegal (West African CFA franc)
      'GHS': 'GH',
      'KES': 'KE',
      'UGX': 'UG',
      'TZS': 'TZ',
      'ZAR': 'ZA'
    };

    return currencyMap[currency] || 'US'; // Default to US
  }

  /**
   * Get supported currencies for this provider
   * @returns {Array<string>} Supported currencies
   */
  getSupportedCurrencies() {
    return ['USD', 'EUR', 'GBP', 'NGN', 'XAF', 'XOF', 'GHS', 'KES', 'UGX', 'TZS', 'ZAR'];
  }

  /**
   * Get provider-specific payment services and pricing
   * @returns {Object} Services and pricing
   */
  getPaymentServices() {
    return {
      featured_listing: {
        name: 'Featured Listing',
        description: 'Make your company appear at the top of search results',
        prices: {
          USD: { 30: 29.99, 60: 49.99, 90: 69.99 },
          XAF: { 30: 17500, 60: 29000, 90: 40000 },
          NGN: { 30: 12000, 60: 20000, 90: 28000 },
          EUR: { 30: 26.99, 60: 44.99, 90: 62.99 },
          GBP: { 30: 24.99, 60: 41.99, 90: 58.99 }
        },
        features: ['Top placement in search results', 'Featured badge', 'Priority support']
      },
      premium_subscription: {
        name: 'Premium Subscription',
        description: 'Unlock all premium features for your company',
        prices: {
          USD: { 365: 199.99 },
          XAF: { 365: 115000 },
          NGN: { 365: 80000 },
          EUR: { 365: 179.99 },
          GBP: { 365: 159.99 }
        },
        features: ['Verified badge', 'Unlimited images', 'Analytics dashboard', 'Priority support', 'Featured in newsletter']
      },
      verification: {
        name: 'Company Verification',
        description: 'Get your company verified with a blue checkmark',
        prices: {
          USD: { 1: 49.99 },
          XAF: { 1: 29000 },
          NGN: { 1: 20000 },
          EUR: { 1: 44.99 },
          GBP: { 1: 39.99 }
        },
        features: ['Verified badge', 'Increased trust', 'Higher search ranking']
      }
    };
  }
}