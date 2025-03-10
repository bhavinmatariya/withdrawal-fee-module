import { Router } from "express";
import multer from "multer";
import * as controller from "../controllers/rate.controller";
import validate from "../middleware/validate";
import { createRateSchema, getRateSchema, updateRateSchema } from "../validations/rate.validation";

const upload = multer();
const router = Router();

/**
 * @openapi
 * /api/ranges/upload:
 *   post:
 *     summary: Upload withdrawal rate ranges from CSV file
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Rates uploaded successfully.
 *       500:
 *         description: Internal server error.
 */
router.post("/upload", upload.single("file"), controller.uploadRates);

/**
 * @openapi
 * /api/ranges:
 *   post:
 *     summary: Create a new withdrawal rate range
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               minAmount:
 *                 type: number
 *                 example: 0
 *               maxAmount:
 *                 type: number
 *                 example: 100
 *               rate:
 *                 type: number
 *                 example: 1.5
 *     responses:
 *       201:
 *         description: rate range created successfully.
 *       500:
 *         description: Internal server error.
 */
router.post("/", validate(createRateSchema, 'body'), controller.createRate);

/**
 * @openapi
 * /api/ranges/{id}:
 *   put:
 *     summary: Update an existing withdrawal rate range
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the rate range to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               minAmount:
 *                 type: number
 *                 example: 101
 *               maxAmount:
 *                 type: number
 *                 example: 200
 *               rate:
 *                 type: number
 *                 example: 2.0
 *     responses:
 *       200:
 *         description: rate range updated successfully.
 *       500:
 *         description: Internal server error.
 */
router.put("/:id", validate(updateRateSchema, 'body'), controller.updateRate);

/**
 * @openapi
 * /api/ranges/{id}:
 *   delete:
 *     summary: Delete a withdrawal rate range
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the rate range to delete
 *     responses:
 *       204:
 *         description: rate range deleted successfully.
 *       500:
 *         description: Internal server error.
 */
router.delete("/:id", controller.deleteRate);

/**
 * @openapi
 * /api/ranges/getrate:
 *   get:
 *     summary: Get withdrawal rate based on amount
 *     parameters:
 *       - in: query
 *         name: amount
 *         required: true
 *         schema:
 *           type: number
 *           example: 150
 *         description: Amount to get the rate for
 *     responses:
 *       200:
 *         description: Returns applicable rate details.
 *       404:
 *         description: No rate range found for given amount.
 *       500:
 *         description: Internal server error.
 */
router.get("/getrate", validate(getRateSchema, 'query'), controller.getrate);

/**
 * @openapi
 * /api/ranges:
 *   get:
 *     summary: Get all withdrawal rate ranges
 *     responses:
 *       200:
 *         description: Successfully retrieved all rate ranges.
 *       500:
 *         description: Internal server error.
 */
router.get("/", controller.getAllRates);

export default router;
