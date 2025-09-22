import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, required: true, index: true },
    description: { type: String },
    category: { type: String, index: true }, // e.g., Construction, Architecture, Suppliers
    phone: { type: String },
    email: { type: String },
    website: { type: String },
    address: { type: String },
    country: { type: String, index: true },
    city: { type: String, index: true },
    logoUrl: { type: String },
    bannerUrl: { type: String },
    images: [{ type: String }],
    featured: { type: Boolean, default: false, index: true },
    featuredUntil: { type: Date }, // When featured status expires
    premium: { type: Boolean, default: false, index: true },
    premiumUntil: { type: Date }, // When premium status expires
    verified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    tags: [{ type: String, index: true }],
    facebook: { type: String },
    twitter: { type: String },
    instagram: { type: String },
    linkedin: { type: String },
    location: { type: String },
    profileUrl: { type: String }, // Generated profile URL
    viewCount: { type: Number, default: 0 }, // Track profile views
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number }
    }, // For geolocation filtering
    geoLocation: {
      type: { type: String, default: 'Point' },
      coordinates: [Number] // [longitude, latitude] for MongoDB geospatial queries
    }
  },
  { timestamps: true }
);

// Create geospatial index for location-based queries
companySchema.index({ geoLocation: '2dsphere' });

// Create slug from name before saving
companySchema.pre('save', function(next) {
  if (this.isModified('name') || this.isNew) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

    // Generate profile URL
    this.profileUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/company/${this.slug}`;
  }

  // Set geoLocation if coordinates are provided
  if (this.coordinates && this.coordinates.latitude && this.coordinates.longitude) {
    this.geoLocation = {
      type: 'Point',
      coordinates: [this.coordinates.longitude, this.coordinates.latitude]
    };
  }

  next();
});

export default mongoose.model("Company", companySchema);
