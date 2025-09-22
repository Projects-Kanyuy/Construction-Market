import { Router } from "express";
import {
  createPayment,
  verifyPayment,
  handleWebhook,
  getPaymentHistory,
  refundPayment,
  getPaymentServices
} from "../controllers/paymentController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = Router();

/**
 * @swagger
 * /api/payments/services:
 *   get:
 *     summary: Get available payment services and pricing
 *     description: |
 *       Retrieve all available payment services, pricing tiers, and supported providers.
 *
 *       **Available Services**:
 *       - **Featured Listing**: Priority placement in search results
 *       - **Premium Subscription**: Full feature access with verification
 *       - **Company Verification**: Blue checkmark verification
 *
 *       **Multi-currency support**: USD, XAF (Central African CFA), NGN (Nigerian Naira)
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: Payment services retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Payment services retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/PaymentServices'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/services", getPaymentServices); // Get available services and pricing

/**
 * @swagger
 * /api/payments/webhook/{provider}:
 *   post:
 *     summary: Handle payment provider webhooks
 *     description: |
 *       Webhook endpoint for payment providers to send payment status updates.
 *
 *       **Supported Providers**:
 *       - `stripe`: Stripe webhook events
 *       - `flutterwave`: Flutterwave webhook events
 *       - `paystack`: Paystack webhook events
 *
 *       This endpoint automatically processes payment completions and applies benefits.
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: provider
 *         required: true
 *         schema:
 *           type: string
 *           enum: [stripe, flutterwave, paystack]
 *         description: Payment provider name
 *         example: "stripe"
 *       - in: header
 *         name: stripe-signature
 *         schema:
 *           type: string
 *         description: Stripe webhook signature (for Stripe webhooks)
 *       - in: header
 *         name: x-webhook-signature
 *         schema:
 *           type: string
 *         description: Generic webhook signature
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Raw webhook payload from payment provider
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Webhook processed successfully"
 *       500:
 *         description: Webhook processing failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/webhook/:provider", handleWebhook); // Handle payment provider webhooks

// Protected routes (require authentication)
router.use(protect);

/**
 * @swagger
 * /api/payments/create:
 *   post:
 *     summary: Create new payment
 *     description: |
 *       Initiate a new payment for a company service.
 *
 *       **Process**:
 *       1. Creates payment record in database
 *       2. Generates payment session with chosen provider
 *       3. Returns checkout URL and payment details
 *       4. Client redirects to payment provider
 *       5. Provider processes payment and sends webhook
 *       6. Benefits are automatically applied on completion
 *
 *       **Supported Services**:
 *       - `featured_listing`: Priority search placement
 *       - `premium_subscription`: Full feature access
 *       - `verification`: Company verification badge
 *     tags: [Payments]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentInput'
 *     responses:
 *       201:
 *         description: Payment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Payment created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     payment:
 *                       type: object
 *                       properties:
 *                         orderId:
 *                           type: string
 *                           example: "ORDER_1640995200000_12ab34cd"
 *                         paymentId:
 *                           type: string
 *                           example: "60f1b2e4d4b0a12345678902"
 *                         amount:
 *                           type: number
 *                           example: 29.99
 *                         currency:
 *                           type: string
 *                           example: "USD"
 *                         provider:
 *                           type: string
 *                           example: "stripe"
 *                         status:
 *                           type: string
 *                           example: "pending"
 *                     providerData:
 *                       type: object
 *                       properties:
 *                         checkoutUrl:
 *                           type: string
 *                           format: uri
 *                           example: "https://checkout.stripe.com/pay/cs_test_123456"
 *                         transactionId:
 *                           type: string
 *                           example: "cs_test_123456"
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/create", createPayment); // Create new payment

/**
 * @swagger
 * /api/payments/verify/{orderId}:
 *   get:
 *     summary: Verify payment status
 *     description: |
 *       Check the current status of a payment using the order ID.
 *
 *       This endpoint queries the payment provider directly to get the most up-to-date
 *       payment status and updates the local database accordingly.
 *
 *       **Use Cases**:
 *       - Check payment completion after redirect
 *       - Handle failed payment redirects
 *       - Manual status verification
 *     tags: [Payments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique order identifier
 *         example: "ORDER_1640995200000_12ab34cd"
 *       - in: query
 *         name: provider
 *         schema:
 *           type: string
 *           enum: [stripe, flutterwave, paystack]
 *         description: Override payment provider (optional)
 *         example: "stripe"
 *     responses:
 *       200:
 *         description: Payment status verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Payment verified successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     payment:
 *                       type: object
 *                       properties:
 *                         orderId:
 *                           type: string
 *                           example: "ORDER_1640995200000_12ab34cd"
 *                         status:
 *                           type: string
 *                           enum: [pending, processing, completed, failed, cancelled]
 *                           example: "completed"
 *                         amount:
 *                           type: number
 *                           example: 29.99
 *                         currency:
 *                           type: string
 *                           example: "USD"
 *                     verification:
 *                       type: object
 *                       description: Provider-specific verification details
 *       404:
 *         description: Payment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/verify/:orderId", verifyPayment); // Verify payment status

/**
 * @swagger
 * /api/payments/history/{companyId}:
 *   get:
 *     summary: Get payment history for a company
 *     description: |
 *       Retrieve paginated payment history for a specific company.
 *
 *       **Includes**: All payments, refunds, and transaction details
 *       **Excludes**: Sensitive payment method details and raw webhook data
 *     tags: [Payments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the company
 *         example: "60f1b2e4d4b0a12345678901"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of payments per page
 *         example: 20
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, processing, completed, failed, cancelled, refunded]
 *         description: Filter by payment status
 *         example: "completed"
 *       - in: query
 *         name: provider
 *         schema:
 *           type: string
 *           enum: [stripe, flutterwave, paystack]
 *         description: Filter by payment provider
 *         example: "stripe"
 *     responses:
 *       200:
 *         description: Payment history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Payment history retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     payments:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Payment'
 *                     pagination:
 *                       $ref: '#/components/schemas/PaginationInfo'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/history/:companyId", getPaymentHistory); // Get payment history

// Admin only routes

/**
 * @swagger
 * /api/payments/refund/{orderId}:
 *   post:
 *     summary: Process payment refund (Admin only)
 *     description: |
 *       Process a full or partial refund for a completed payment.
 *
 *       **Requirements**:
 *       - Payment must be in 'completed' status
 *       - Refund amount cannot exceed original payment amount
 *       - Admin authentication required
 *
 *       **Process**:
 *       1. Validates payment eligibility for refund
 *       2. Processes refund through payment provider
 *       3. Updates payment status to 'refunded'
 *       4. Records refund details and reason
 *     tags: [Payments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique order identifier
 *         example: "ORDER_1640995200000_12ab34cd"
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Refund amount (defaults to full amount)
 *                 example: 15.00
 *               reason:
 *                 type: string
 *                 description: Reason for refund
 *                 example: "Customer requested cancellation"
 *     responses:
 *       200:
 *         description: Refund processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Refund processed successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     refund:
 *                       type: object
 *                       properties:
 *                         refundId:
 *                           type: string
 *                           example: "re_1234567890"
 *                         amount:
 *                           type: number
 *                           example: 29.99
 *                         status:
 *                           type: string
 *                           example: "succeeded"
 *       400:
 *         description: Payment not eligible for refund
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Payment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/refund/:orderId", adminOnly, refundPayment); // Process refunds

export default router;