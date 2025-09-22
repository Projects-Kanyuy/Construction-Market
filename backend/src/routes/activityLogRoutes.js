import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { createLog, listLogs } from "../controllers/activityLogController.js";

const router = Router();

/**
 * @swagger
 * /api/activity_logs:
 *   post:
 *     summary: Create activity log entry
 *     description: |
 *       Log user activity for analytics and tracking purposes.
 *
 *       **Public Endpoint**: No authentication required for logging activities.
 *
 *       **Use Cases**:
 *       - Track user interactions (page views, clicks, searches)
 *       - Monitor system usage patterns
 *       - Generate analytics reports
 *       - Debug user behavior issues
 *
 *       **Automatic Data**: IP address and user agent are automatically captured.
 *     tags: [Activity Logs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - action
 *             properties:
 *               action:
 *                 type: string
 *                 example: "view_company"
 *                 description: The action performed by the user
 *               details:
 *                 type: object
 *                 example:
 *                   companyId: "60f1b2e4d4b0a12345678901"
 *                   companyName: "ABC Construction Ltd"
 *                   searchQuery: "construction Lagos"
 *                 description: Additional details about the action
 *               userId:
 *                 type: string
 *                 example: "60f1b2e4d4b0a12345678903"
 *                 description: User ID if available (optional)
 *               sessionId:
 *                 type: string
 *                 example: "sess_1234567890"
 *                 description: Session identifier (optional)
 *     responses:
 *       201:
 *         description: Activity logged successfully
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
 *                   example: "Activity logged successfully"
 *                 logId:
 *                   type: string
 *                   example: "60f1b2e4d4b0a12345678904"
 *       400:
 *         description: Invalid input data
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
router.post("/", createLog); // matches POST /api/activity_logs from the old frontend

/**
 * @swagger
 * /api/activity_logs:
 *   get:
 *     summary: Get activity logs (Admin only)
 *     description: |
 *       Retrieve activity logs for analytics and monitoring.
 *
 *       **Admin Access Required**: Only authenticated users can access activity logs.
 *
 *       **Use Cases**:
 *       - Analytics dashboard
 *       - User behavior analysis
 *       - System monitoring
 *       - Debugging user issues
 *
 *       **Filtering**: Support for date ranges, actions, and user filtering.
 *     tags: [Activity Logs]
 *     security:
 *       - BearerAuth: []
 *     parameters:
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
 *           default: 50
 *         description: Number of logs per page
 *         example: 100
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *         description: Filter by specific action
 *         example: "view_company"
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter by user ID
 *         example: "60f1b2e4d4b0a12345678903"
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter logs from this date
 *         example: "2023-01-01"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter logs until this date
 *         example: "2023-12-31"
 *     responses:
 *       200:
 *         description: Activity logs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 logs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ActivityLog'
 *                 pagination:
 *                   $ref: '#/components/schemas/PaginationInfo'
 *                 summary:
 *                   type: object
 *                   properties:
 *                     totalLogs:
 *                       type: integer
 *                       example: 1500
 *                     uniqueUsers:
 *                       type: integer
 *                       example: 245
 *                     topActions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           action:
 *                             type: string
 *                             example: "view_company"
 *                           count:
 *                             type: integer
 *                             example: 450
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
router.get("/", protect, listLogs);

export default router;
