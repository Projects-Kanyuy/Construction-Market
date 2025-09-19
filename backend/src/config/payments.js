import PaymentService from '../services/paymentService.js';
import { StripeProvider } from '../services/providers/stripeProvider.js';
import { FlutterwaveProvider } from '../services/providers/flutterwaveProvider.js';

// Initialize payment service with providers
const initializePaymentService = () => {
  const paymentService = new PaymentService();

  // Register Stripe provider if configured
  if (process.env.STRIPE_SECRET_KEY) {
    const stripeProvider = new StripeProvider({
      secretKey: process.env.STRIPE_SECRET_KEY,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET
    });
    paymentService.registerProvider('stripe', stripeProvider);
    console.log('✅ Stripe payment provider registered');
  }

  // Register Flutterwave provider if configured
  if (process.env.FLUTTERWAVE_SECRET_KEY) {
    const flutterwaveProvider = new FlutterwaveProvider({
      publicKey: process.env.FLUTTERWAVE_PUBLIC_KEY,
      secretKey: process.env.FLUTTERWAVE_SECRET_KEY,
      environment: process.env.FLUTTERWAVE_ENVIRONMENT || 'sandbox'
    });
    paymentService.registerProvider('flutterwave', flutterwaveProvider);
    console.log('✅ Flutterwave payment provider registered');
  }

  // Add more providers as needed (Paystack, PayPal, etc.)
  // if (process.env.PAYSTACK_SECRET_KEY) {
  //   const paystackProvider = new PaystackProvider({
  //     secretKey: process.env.PAYSTACK_SECRET_KEY
  //   });
  //   paymentService.registerProvider('paystack', paystackProvider);
  // }

  return paymentService;
};

export default initializePaymentService;