import { StatusCodes } from "http-status-codes";
import PaymentService from "../services/paymentService.js";

const paymentService = new PaymentService();

// Create a payment (initiate payment process)
export const createPayment = async (req, res) => {
  try {
    const {
      companyId,
      amount,
      currency = 'USD',
      provider,
      service,
      duration,
      description,
      returnUrl,
      cancelUrl
    } = req.body;

    const userId = req.user?._id; // From auth middleware

    if (!companyId || !amount || !service) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Missing required fields: companyId, amount, service'
      });
    }

    const paymentData = {
      companyId,
      userId,
      amount: parseFloat(amount),
      currency,
      provider,
      description: description || `Payment for ${service}`,
      metadata: {
        service,
        duration: duration ? parseInt(duration) : undefined,
        customerInfo: {
          name: req.user?.name,
          email: req.user?.email
        }
      },
      returnUrl,
      cancelUrl
    };

    const result = await paymentService.createPayment(paymentData);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Payment created successfully',
      data: result
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message || 'Failed to create payment'
    });
  }
};

// Verify payment status
export const verifyPayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { provider } = req.query;

    if (!orderId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Order ID is required'
      });
    }

    const result = await paymentService.verifyPayment(orderId, provider);

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: result
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message || 'Failed to verify payment'
    });
  }
};

// Handle webhook from payment provider
export const handleWebhook = async (req, res) => {
  try {
    const { provider } = req.params;
    const signature = req.get('stripe-signature') || req.get('x-webhook-signature');

    await paymentService.handleWebhook(provider, req.body, signature);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Webhook processed successfully'
    });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Webhook processing failed'
    });
  }
};

// Get payment history for a company
export const getPaymentHistory = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { page, limit, status, provider } = req.query;

    const options = {
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
      status,
      provider
    };

    const result = await paymentService.getPaymentHistory(companyId, options);

    res.json({
      success: true,
      message: 'Payment history retrieved successfully',
      data: result
    });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message || 'Failed to fetch payment history'
    });
  }
};

// Process refund
export const refundPayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { amount, reason } = req.body;

    if (!orderId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Order ID is required'
      });
    }

    const result = await paymentService.refundPayment(orderId, {
      amount: amount ? parseFloat(amount) : undefined,
      reason
    });

    res.json({
      success: true,
      message: 'Refund processed successfully',
      data: result
    });
  } catch (error) {
    console.error('Error processing refund:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message || 'Failed to process refund'
    });
  }
};

// Get available payment services and pricing
export const getPaymentServices = async (req, res) => {
  try {
    const services = {
      featured_listing: {
        name: 'Featured Listing',
        description: 'Make your company appear at the top of search results',
        prices: {
          USD: { 30: 29.99, 60: 49.99, 90: 69.99 }, // duration in days: price
          XAF: { 30: 17500, 60: 29000, 90: 40000 },
          NGN: { 30: 12000, 60: 20000, 90: 28000 }
        },
        features: ['Top placement in search results', 'Featured badge', 'Priority support']
      },
      premium_subscription: {
        name: 'Premium Subscription',
        description: 'Unlock all premium features for your company',
        prices: {
          USD: { 365: 199.99 }, // 1 year
          XAF: { 365: 115000 },
          NGN: { 365: 80000 }
        },
        features: ['Verified badge', 'Unlimited images', 'Analytics dashboard', 'Priority support', 'Featured in newsletter']
      },
      verification: {
        name: 'Company Verification',
        description: 'Get your company verified with a blue checkmark',
        prices: {
          USD: { 1: 49.99 }, // One-time
          XAF: { 1: 29000 },
          NGN: { 1: 20000 }
        },
        features: ['Verified badge', 'Increased trust', 'Higher search ranking']
      }
    };

    res.json({
      success: true,
      message: 'Payment services retrieved successfully',
      data: {
        services,
        availableProviders: ['stripe', 'flutterwave', 'paystack'],
        supportedCurrencies: ['USD', 'XAF', 'NGN']
      }
    });
  } catch (error) {
    console.error('Error fetching payment services:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to fetch payment services'
    });
  }
};