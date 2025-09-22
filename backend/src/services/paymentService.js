import Payment from '../models/Payment.js';
import Company from '../models/Company.js';
import { v4 as uuidv4 } from 'uuid';

// Generic payment service that can work with any provider
class PaymentService {
  constructor() {
    this.providers = new Map();
    this.defaultProvider = process.env.DEFAULT_PAYMENT_PROVIDER || 'stripe';
  }

  // Register a payment provider
  registerProvider(name, providerInstance) {
    this.providers.set(name, providerInstance);
  }

  // Get provider instance
  getProvider(providerName = null) {
    const provider = providerName || this.defaultProvider;
    if (!this.providers.has(provider)) {
      throw new Error(`Payment provider '${provider}' not registered`);
    }
    return this.providers.get(provider);
  }

  // Create a payment intent/session
  async createPayment(paymentData) {
    try {
      const {
        companyId,
        userId,
        amount,
        currency = 'USD',
        provider = this.defaultProvider,
        description,
        metadata = {},
        returnUrl,
        cancelUrl
      } = paymentData;

      // Validate company exists
      const company = await Company.findById(companyId);
      if (!company) {
        throw new Error('Company not found');
      }

      // Generate unique order ID
      const orderId = `ORDER_${Date.now()}_${uuidv4().substring(0, 8)}`;

      // Create payment record
      const payment = await Payment.create({
        orderId,
        companyId,
        userId,
        amount,
        currency,
        provider,
        description,
        metadata,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
      });

      // Get provider instance and create payment
      const providerInstance = this.getProvider(provider);
      const providerResult = await providerInstance.createPayment({
        orderId,
        amount,
        currency,
        description,
        metadata: {
          ...metadata,
          paymentId: payment._id.toString(),
          companyId,
          userId
        },
        returnUrl: returnUrl || `${process.env.FRONTEND_URL}/payment/success`,
        cancelUrl: cancelUrl || `${process.env.FRONTEND_URL}/payment/cancel`
      });

      // Update payment with provider details
      await Payment.findByIdAndUpdate(payment._id, {
        providerTransactionId: providerResult.transactionId,
        providerReference: providerResult.reference,
        status: providerResult.status || 'pending'
      });

      return {
        success: true,
        payment: {
          orderId,
          paymentId: payment._id,
          amount,
          currency,
          provider,
          status: 'pending'
        },
        providerData: providerResult
      };

    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  }

  // Verify payment status
  async verifyPayment(orderId, provider = null) {
    try {
      const payment = await Payment.findOne({ orderId }).populate('companyId');
      if (!payment) {
        throw new Error('Payment not found');
      }

      const providerInstance = this.getProvider(provider || payment.provider);
      const verification = await providerInstance.verifyPayment({
        transactionId: payment.providerTransactionId,
        reference: payment.providerReference
      });

      // Update payment status
      const updateData = {
        status: verification.status,
        paymentMethod: verification.paymentMethod
      };

      if (verification.status === 'completed') {
        updateData.completedAt = new Date();

        // Apply payment benefits (e.g., mark company as featured)
        await this.applyPaymentBenefits(payment, verification);
      } else if (verification.status === 'failed') {
        updateData.failedReason = verification.failureReason;
      }

      await Payment.findByIdAndUpdate(payment._id, updateData);

      return {
        success: true,
        payment: {
          orderId: payment.orderId,
          status: verification.status,
          amount: payment.amount,
          currency: payment.currency
        },
        verification
      };

    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  }

  // Handle webhook from payment provider
  async handleWebhook(provider, webhookData, signature = null) {
    try {
      const providerInstance = this.getProvider(provider);
      const processedData = await providerInstance.processWebhook(webhookData, signature);

      if (processedData && processedData.orderId) {
        const payment = await Payment.findOne({ orderId: processedData.orderId });
        if (payment) {
          const updateData = {
            status: processedData.status,
            'webhook.received': true,
            'webhook.data': webhookData,
            'webhook.receivedAt': new Date()
          };

          if (processedData.status === 'completed') {
            updateData.completedAt = new Date();
            await this.applyPaymentBenefits(payment, processedData);
          } else if (processedData.status === 'failed') {
            updateData.failedReason = processedData.failureReason;
          }

          await Payment.findByIdAndUpdate(payment._id, updateData);
        }
      }

      return { success: true, processed: processedData };
    } catch (error) {
      console.error('Error handling webhook:', error);
      throw error;
    }
  }

  // Apply benefits after successful payment
  async applyPaymentBenefits(payment, verificationData) {
    try {
      const { metadata } = payment;

      if (metadata.service === 'featured_listing') {
        const duration = metadata.duration || 30; // Default 30 days
        const expiresAt = new Date(Date.now() + duration * 24 * 60 * 60 * 1000);

        await Company.findByIdAndUpdate(payment.companyId, {
          featured: true,
          featuredUntil: expiresAt
        });
      }

      if (metadata.service === 'premium_subscription') {
        const duration = metadata.duration || 365; // Default 1 year
        const expiresAt = new Date(Date.now() + duration * 24 * 60 * 60 * 1000);

        await Company.findByIdAndUpdate(payment.companyId, {
          premium: true,
          premiumUntil: expiresAt,
          verified: true // Premium includes verification
        });
      }

      if (metadata.service === 'verification') {
        await Company.findByIdAndUpdate(payment.companyId, {
          verified: true
        });
      }

      console.log(`Applied benefits for payment ${payment.orderId}: ${metadata.service}`);
    } catch (error) {
      console.error('Error applying payment benefits:', error);
    }
  }

  // Get payment history for a company
  async getPaymentHistory(companyId, options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        status = null,
        provider = null
      } = options;

      const filter = { companyId };
      if (status) filter.status = status;
      if (provider) filter.provider = provider;

      const payments = await Payment.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select('-webhook.data -paymentMethod.details');

      const total = await Payment.countDocuments(filter);

      return {
        success: true,
        payments,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Error fetching payment history:', error);
      throw error;
    }
  }

  // Refund a payment
  async refundPayment(orderId, refundData) {
    try {
      const payment = await Payment.findOne({ orderId });
      if (!payment || payment.status !== 'completed') {
        throw new Error('Payment not found or not eligible for refund');
      }

      const providerInstance = this.getProvider(payment.provider);
      const refundResult = await providerInstance.refundPayment({
        transactionId: payment.providerTransactionId,
        amount: refundData.amount || payment.amount,
        reason: refundData.reason
      });

      await Payment.findByIdAndUpdate(payment._id, {
        status: 'refunded',
        'refund.amount': refundResult.amount,
        'refund.reason': refundData.reason,
        'refund.refundedAt': new Date(),
        'refund.providerRefundId': refundResult.refundId
      });

      return {
        success: true,
        refund: refundResult
      };
    } catch (error) {
      console.error('Error processing refund:', error);
      throw error;
    }
  }
}

// Base class for payment providers
export class PaymentProvider {
  constructor(config) {
    this.config = config;
  }

  async createPayment(paymentData) {
    throw new Error('createPayment method must be implemented by provider');
  }

  async verifyPayment(verificationData) {
    throw new Error('verifyPayment method must be implemented by provider');
  }

  async processWebhook(webhookData, signature) {
    throw new Error('processWebhook method must be implemented by provider');
  }

  async refundPayment(refundData) {
    throw new Error('refundPayment method must be implemented by provider');
  }
}

export default PaymentService;