import { PaymentProvider } from '../paymentService.js';
import Stripe from 'stripe';

export class StripeProvider extends PaymentProvider {
  constructor(config) {
    super(config);
    this.stripe = new Stripe(config.secretKey);
    this.webhookSecret = config.webhookSecret;
  }

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

      // Create Stripe Checkout Session
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: currency.toLowerCase(),
              product_data: {
                name: description || 'Construction Market Service',
                metadata
              },
              unit_amount: Math.round(amount * 100), // Convert to cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: returnUrl,
        cancel_url: cancelUrl,
        metadata: {
          orderId,
          ...metadata
        },
        expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // 30 minutes
      });

      return {
        transactionId: session.id,
        reference: session.payment_intent,
        checkoutUrl: session.url,
        status: 'pending'
      };
    } catch (error) {
      console.error('Stripe payment creation error:', error);
      throw error;
    }
  }

  async verifyPayment(verificationData) {
    try {
      const { transactionId } = verificationData;
      const session = await this.stripe.checkout.sessions.retrieve(transactionId);

      let status = 'pending';
      if (session.payment_status === 'paid') {
        status = 'completed';
      } else if (session.payment_status === 'unpaid') {
        status = 'failed';
      }

      return {
        status,
        transactionId: session.id,
        reference: session.payment_intent,
        amount: session.amount_total / 100,
        currency: session.currency.toUpperCase(),
        paymentMethod: {
          type: 'card'
        }
      };
    } catch (error) {
      console.error('Stripe payment verification error:', error);
      throw error;
    }
  }

  async processWebhook(webhookData, signature) {
    try {
      const event = this.stripe.webhooks.constructEvent(
        webhookData,
        signature,
        this.webhookSecret
      );

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        return {
          orderId: session.metadata.orderId,
          status: 'completed',
          transactionId: session.id,
          reference: session.payment_intent
        };
      }

      if (event.type === 'checkout.session.expired') {
        const session = event.data.object;
        return {
          orderId: session.metadata.orderId,
          status: 'failed',
          failureReason: 'Session expired'
        };
      }

      return null;
    } catch (error) {
      console.error('Stripe webhook processing error:', error);
      throw error;
    }
  }

  async refundPayment(refundData) {
    try {
      const { transactionId, amount, reason } = refundData;

      // Get the payment intent from the session
      const session = await this.stripe.checkout.sessions.retrieve(transactionId);

      const refund = await this.stripe.refunds.create({
        payment_intent: session.payment_intent,
        amount: amount ? Math.round(amount * 100) : undefined,
        reason: reason || 'requested_by_customer'
      });

      return {
        refundId: refund.id,
        amount: refund.amount / 100,
        status: refund.status
      };
    } catch (error) {
      console.error('Stripe refund error:', error);
      throw error;
    }
  }
}