import { Router } from "express";
import { login, getAllUsers } from "../controllers/authController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = Router();

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: User login
 *     description: |
 *       Authenticate a user and receive a JWT token for API access.
 *
 *       **Token Usage**: Include the returned token in the Authorization header
 *       as `Bearer {token}` for protected endpoints.
 *
 *       **Token Expiration**: Tokens expire after 7 days by default.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Invalid credentials
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
router.post("/login", login);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     description: |
 *       Retrieve a list of all registered users in the system.
 *
 *       **Admin Access Required**: This endpoint requires admin-level authentication.
 *
 *       **Use Cases**:
 *       - User management dashboard
 *       - System administration
 *       - User analytics
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
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
router.get("/", protect, adminOnly, getAllUsers);

export default router;
