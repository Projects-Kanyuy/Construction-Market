import { Router } from "express";
import {
  listCompanies,
  getCompany,
  getCompanyBySlug,
  incrementCompanyViewCount,
  createCompany,
  updateCompany,
  deleteCompany,
} from "../controllers/companyController.js";
import { companyUploader } from "../middleware/upload.js"; // Cloudinary upload middleware
import { protect, adminOnly } from "../middleware/auth.js";
import {
  trackCompanySearch,
  trackCompanyView,
  trackCompanyRegistration
} from "../middleware/tracking.js";

const router = Router();

/**
 * @swagger
 * /api/companies:
 *   get:
 *     summary: List companies with advanced filtering
 *     description: |
 *       Retrieve a paginated list of companies with comprehensive filtering options:
 *       - **Location-based filtering**: Use latitude, longitude, and radius for geospatial search
 *       - **Text-based filtering**: Filter by city, country, category, or search terms
 *       - **Analytics**: Automatically tracked via Facebook Pixel and Google Analytics
 *     tags: [Companies]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in company name, description, or tags
 *         example: "construction"
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by company category
 *         example: "Construction"
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by city (case-insensitive partial match)
 *         example: "Lagos"
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: Filter by country (case-insensitive partial match)
 *         example: "Nigeria"
 *       - in: query
 *         name: latitude
 *         schema:
 *           type: number
 *           format: float
 *         description: User's latitude for geospatial search
 *         example: 6.5244
 *       - in: query
 *         name: longitude
 *         schema:
 *           type: number
 *           format: float
 *         description: User's longitude for geospatial search
 *         example: 3.3792
 *       - in: query
 *         name: radius
 *         schema:
 *           type: integer
 *           default: 50000
 *         description: Search radius in meters (only used with latitude/longitude)
 *         example: 25000
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
 *         description: Number of items per page
 *         example: 20
 *     responses:
 *       200:
 *         description: Successfully retrieved companies
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompanyList'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", trackCompanySearch, listCompanies); // Track searches

/**
 * @swagger
 * /api/companies/by-id/{id}:
 *   get:
 *     summary: Get company by MongoDB ID
 *     description: Retrieve a single company using its MongoDB ObjectId. This endpoint tracks views for analytics.
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the company
 *         example: "60f1b2e4d4b0a12345678901"
 *     responses:
 *       200:
 *         description: Company found successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       404:
 *         description: Company not found
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
router.get("/by-id/:id", trackCompanyView, getCompany); // Track views by ID

/**
 * @swagger
 * /api/companies/profile/{slug}:
 *   get:
 *     summary: Get company by slug (Shareable Profile Links)
 *     description: |
 *       🔗 **Shareable Profile Links Feature**
 *
 *       Retrieve a company using its unique slug for shareable profile URLs.
 *       This endpoint is designed for:
 *       - Social media sharing
 *       - Email marketing campaigns
 *       - WhatsApp/SMS sharing
 *       - SEO-friendly URLs
 *
 *       **URL Pattern**: `yourdomain.com/company/{slug}`
 *
 *       The response includes a `profileUrl` field that can be used for "Copy Profile Link" functionality.
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: |
 *           URL-friendly slug of the company (auto-generated from company name)
 *         example: "abc-construction-ltd"
 *     responses:
 *       200:
 *         description: Company profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Company'
 *                 - type: object
 *                   properties:
 *                     profileUrl:
 *                       type: string
 *                       format: uri
 *                       description: Full shareable profile URL
 *                       example: "https://yoursite.com/company/abc-construction-ltd"
 *       404:
 *         description: Company not found or inactive
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
router.get("/profile/:slug", trackCompanyView, getCompanyBySlug); // Track profile views

/**
 * @swagger
 * /api/companies/{identifier}/view:
 *   post:
 *     summary: Track company profile view
 *     description: |
 *       Manually increment the view count for a company profile.
 *       This endpoint accepts either a MongoDB ID or a slug as identifier.
 *
 *       **Used for**: Analytics, popularity tracking, engagement metrics
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: identifier
 *         required: true
 *         schema:
 *           type: string
 *         description: Either MongoDB ObjectId or company slug
 *         example: "abc-construction-ltd"
 *     responses:
 *       200:
 *         description: View count incremented successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "View count incremented"
 *                 viewCount:
 *                   type: integer
 *                   example: 146
 *       404:
 *         description: Company not found
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
router.post("/:identifier/view", incrementCompanyViewCount); // Manual view tracking

/**
 * @swagger
 * /api/companies:
 *   post:
 *     summary: Create new company (Admin only)
 *     description: |
 *       Create a new company with file upload support and automatic tracking.
 *
 *       **Features**:
 *       - Automatic slug generation from company name
 *       - Profile URL generation
 *       - Geolocation support for location-based filtering
 *       - Facebook Pixel and GA4 tracking for registrations
 *       - File upload support for logo, banner, and images
 *     tags: [Companies]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *                 example: "ABC Construction Ltd"
 *               description:
 *                 type: string
 *                 example: "Leading construction company"
 *               category:
 *                 type: string
 *                 example: "Construction"
 *               phone:
 *                 type: string
 *                 example: "+234123456789"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "info@abc-construction.com"
 *               website:
 *                 type: string
 *                 format: uri
 *                 example: "https://abc-construction.com"
 *               address:
 *                 type: string
 *                 example: "123 Construction Ave, Lagos"
 *               country:
 *                 type: string
 *                 example: "Nigeria"
 *               city:
 *                 type: string
 *                 example: "Lagos"
 *               latitude:
 *                 type: number
 *                 format: float
 *                 example: 6.5244
 *               longitude:
 *                 type: number
 *                 format: float
 *                 example: 3.3792
 *               tags:
 *                 type: string
 *                 description: Comma-separated tags
 *                 example: "construction,residential,commercial"
 *               facebook:
 *                 type: string
 *                 example: "https://facebook.com/abc-construction"
 *               twitter:
 *                 type: string
 *                 example: "https://twitter.com/abc_construction"
 *               instagram:
 *                 type: string
 *                 example: "https://instagram.com/abc_construction"
 *               linkedin:
 *                 type: string
 *                 example: "https://linkedin.com/company/abc-construction"
 *               logo:
 *                 type: string
 *                 format: binary
 *                 description: Company logo image file
 *               banner:
 *                 type: string
 *                 format: binary
 *                 description: Company banner image file
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Additional company images
 *     responses:
 *       201:
 *         description: Company created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       400:
 *         description: Invalid input or company name already exists
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
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", protect, adminOnly, companyUploader, trackCompanyRegistration, createCompany);

/**
 * @swagger
 * /api/companies/{id}:
 *   put:
 *     summary: Update company (Admin only)
 *     description: |
 *       Update an existing company with file upload support.
 *
 *       **Features**:
 *       - Automatic slug regeneration if name changes
 *       - Profile URL updates
 *       - Geolocation coordinate updates
 *       - File upload support for logo, banner, and images
 *     tags: [Companies]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the company
 *         example: "60f1b2e4d4b0a12345678901"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "ABC Construction Ltd"
 *               description:
 *                 type: string
 *                 example: "Leading construction company"
 *               category:
 *                 type: string
 *                 example: "Construction"
 *               phone:
 *                 type: string
 *                 example: "+234123456789"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "info@abc-construction.com"
 *               website:
 *                 type: string
 *                 format: uri
 *                 example: "https://abc-construction.com"
 *               address:
 *                 type: string
 *                 example: "123 Construction Ave, Lagos"
 *               country:
 *                 type: string
 *                 example: "Nigeria"
 *               city:
 *                 type: string
 *                 example: "Lagos"
 *               latitude:
 *                 type: number
 *                 format: float
 *                 example: 6.5244
 *               longitude:
 *                 type: number
 *                 format: float
 *                 example: 3.3792
 *               tags:
 *                 type: string
 *                 description: Comma-separated tags
 *                 example: "construction,residential,commercial"
 *               facebook:
 *                 type: string
 *                 example: "https://facebook.com/abc-construction"
 *               twitter:
 *                 type: string
 *                 example: "https://twitter.com/abc_construction"
 *               instagram:
 *                 type: string
 *                 example: "https://instagram.com/abc_construction"
 *               linkedin:
 *                 type: string
 *                 example: "https://linkedin.com/company/abc-construction"
 *               logo:
 *                 type: string
 *                 format: binary
 *                 description: Company logo image file
 *               banner:
 *                 type: string
 *                 format: binary
 *                 description: Company banner image file
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Additional company images
 *     responses:
 *       200:
 *         description: Company updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       400:
 *         description: Invalid input or company name already exists
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
 *         description: Company not found
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
router.put("/:id", protect, adminOnly, companyUploader, updateCompany);

/**
 * @swagger
 * /api/companies/{id}:
 *   delete:
 *     summary: Delete company (Admin only)
 *     description: Permanently delete a company from the database. This action cannot be undone.
 *     tags: [Companies]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the company
 *         example: "60f1b2e4d4b0a12345678901"
 *     responses:
 *       200:
 *         description: Company deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Deleted"
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
 *         description: Company not found
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
router.delete("/:id", protect, adminOnly, deleteCompany);

export default router;
