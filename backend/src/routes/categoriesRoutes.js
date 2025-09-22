import express from "express";
import {
  getCategories,
  createCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     description: |
 *       Retrieve a list of all available company categories.
 *
 *       **Use Cases**:
 *       - Populating category dropdowns in forms
 *       - Filtering companies by category
 *       - Category-based navigation
 *
 *       **Public Endpoint**: No authentication required.
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 categories:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", getCategories);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create new category
 *     description: |
 *       Create a new company category in the system.
 *
 *       **Features**:
 *       - Automatic slug generation from category name
 *       - Category name uniqueness validation
 *       - Active/inactive status control
 *
 *       **Note**: This endpoint may require admin authentication depending on implementation.
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Construction"
 *                 description: Category name
 *               description:
 *                 type: string
 *                 example: "Construction and building services"
 *                 description: Category description
 *               isActive:
 *                 type: boolean
 *                 default: true
 *                 example: true
 *                 description: Whether the category is active
 *     responses:
 *       201:
 *         description: Category created successfully
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
 *                   example: "Category created successfully"
 *                 category:
 *                   $ref: '#/components/schemas/Category'
 *       400:
 *         description: Invalid input or category already exists
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
router.post("/", createCategory);

export default router;
