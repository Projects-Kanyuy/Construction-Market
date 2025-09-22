import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'],
      default: 'pending'
    },
    provider: {
      type: String,
      enum: ['stripe', 'paypal', 'flutterwave', 'paystack', 'momo', 'bank_transfer', 'other'],
      required: true
    },
    providerTransactionId: { type: String }, // Transaction ID from payment provider
    providerReference: { type: String }, // Provider-specific reference
    description: { type: String },
    metadata: {
      service: { type: String }, // e.g., 'featured_listing', 'premium_subscription'
      duration: { type: Number }, // Duration in days for subscriptions
      features: [String], // Array of features included
      customerInfo: {
        name: String,
        email: String,
        phone: String
      }
    },
    paymentMethod: {
      type: { type: String }, // 'card', 'mobile_money', 'bank_transfer', etc.
      details: { type: mongoose.Schema.Types.Mixed } // Flexible storage for payment method details
    },
    webhook: {
      received: { type: Boolean, default: false },
      data: { type: mongoose.Schema.Types.Mixed },
      receivedAt: { type: Date }
    },
    refund: {
      amount: { type: Number },
      reason: { type: String },
      refundedAt: { type: Date },
      providerRefundId: { type: String }
    },
    expiresAt: { type: Date }, // For pending payments
    completedAt: { type: Date },
    failedReason: { type: String }
  },
  { timestamps: true }
);

// Index for efficient queries
// Note: orderId already has unique index from schema definition
paymentSchema.index({ companyId: 1, status: 1 });
paymentSchema.index({ provider: 1, status: 1 });
paymentSchema.index({ providerTransactionId: 1 });

// Auto-expire pending payments after 30 minutes
paymentSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("Payment", paymentSchema);