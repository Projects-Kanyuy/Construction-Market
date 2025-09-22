import { Router } from "express";
import { health } from "../controllers/healthController.js";

const router = Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: API health check
 *     description: |
 *       Check the health status of the Construction Market API.
 *
 *       **Public Endpoint**: No authentication required.
 *
 *       **Use Cases**:
 *       - System monitoring and uptime checks
 *       - Load balancer health checks
 *       - DevOps monitoring and alerting
 *       - API status verification
 *
 *       **Response**: Returns system status, uptime, and basic metrics.
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy and operational
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                   description: Overall health status
 *                 status:
 *                   type: string
 *                   example: "healthy"
 *                   description: Health status message
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-01-01T12:00:00.000Z"
 *                   description: Current server timestamp
 *                 uptime:
 *                   type: number
 *                   example: 86400.5
 *                   description: Server uptime in seconds
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 *                   description: API version
 *                 environment:
 *                   type: string
 *                   example: "development"
 *                   description: Current environment
 *                 services:
 *                   type: object
 *                   properties:
 *                     database:
 *                       type: string
 *                       example: "connected"
 *                       description: Database connection status
 *                     cloudinary:
 *                       type: string
 *                       example: "available"
 *                       description: File upload service status
 *                     payments:
 *                       type: string
 *                       example: "configured"
 *                       description: Payment providers status
 *       503:
 *         description: API is experiencing issues
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: string
 *                   example: "unhealthy"
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-01-01T12:00:00.000Z"
 */
router.get("/", health);

export default router;
