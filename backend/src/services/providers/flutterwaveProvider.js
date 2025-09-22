import { PaymentProvider } from '../paymentService.js';
import axios from 'axios';

export class FlutterwaveProvider extends PaymentProvider {
  constructor(config) {
    super(config);
    this.publicKey = config.publicKey;
    this.secretKey = config.secretKey;
    this.baseUrl = config.environment === 'production'
      ? 'https://api.flutterwave.com/v3'
      : 'https://ravesandboxapi.flutterwave.com/v3';
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

      const payload = {
        tx_ref: orderId,
        amount,
        currency: currency.toUpperCase(),
        redirect_url: returnUrl,
        payment_options: "card,mobilemoney,ussd,banktransfer",
        customer: {
          email: metadata.customerInfo?.email || "customer@example.com",
          name: metadata.customerInfo?.name || "Customer",
          phonenumber: metadata.customerInfo?.phone || ""
        },
        customizations: {
          title: "Construction Market",
          description: description || "Payment for construction market services",
          logo: `${process.env.FRONTEND_URL}/logo.png`
        },
        meta: metadata
      };

      const response = await axios.post(
        `${this.baseUrl}/payments`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status === 'success') {
        return {
          transactionId: response.data.data.id,
          reference: orderId,
          checkoutUrl: response.data.data.link,
          status: 'pending'
        };
      } else {
        throw new Error(response.data.message || 'Payment creation failed');
      }
    } catch (error) {
      console.error('Flutterwave payment creation error:', error);
      throw error;
    }
  }

  async verifyPayment(verificationData) {
    try {
      const { reference } = verificationData; // tx_ref in Flutterwave

      const response = await axios.get(
        `${this.baseUrl}/transactions/verify_by_reference?tx_ref=${reference}`,
        {
          headers: {
            'Authorization': `Bearer ${this.secretKey}`
          }
        }
      );

      if (response.data.status === 'success') {
        const transaction = response.data.data;

        let status = 'pending';
        if (transaction.status === 'successful') {
          status = 'completed';
        } else if (transaction.status === 'failed' || transaction.status === 'cancelled') {
          status = 'failed';
        }

        return {
          status,
          transactionId: transaction.id,
          reference: transaction.tx_ref,
          amount: transaction.amount,
          currency: transaction.currency,
          paymentMethod: {
            type: transaction.payment_type
          }
        };
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (error) {
      console.error('Flutterwave payment verification error:', error);
      throw error;
    }
  }

  async processWebhook(webhookData) {
    try {
      // Flutterwave sends webhook data directly
      const event = webhookData;

      if (event.event === 'charge.completed' && event.data.status === 'successful') {
        return {
          orderId: event.data.tx_ref,
          status: 'completed',
          transactionId: event.data.id,
          reference: event.data.tx_ref
        };
      }

      if (event.event === 'charge.completed' && event.data.status === 'failed') {
        return {
          orderId: event.data.tx_ref,
          status: 'failed',
          failureReason: event.data.processor_response || 'Payment failed'
        };
      }

      return null;
    } catch (error) {
      console.error('Flutterwave webhook processing error:', error);
      throw error;
    }
  }

  async refundPayment(refundData) {
    try {
      const { transactionId, amount } = refundData;

      const payload = {
        amount: amount || undefined
      };

      const response = await axios.post(
        `${this.baseUrl}/transactions/${transactionId}/refund`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status === 'success') {
        return {
          refundId: response.data.data.id,
          amount: response.data.data.amount,
          status: response.data.data.status
        };
      } else {
        throw new Error(response.data.message || 'Refund failed');
      }
    } catch (error) {
      console.error('Flutterwave refund error:', error);
      throw error;
    }
  }
}