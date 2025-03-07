import { Router } from "express";
import multer from "multer";
import * as controller from "../controllers/fee.controller";
import validate from "../middleware/validate";
import { calculateFeeSchema, createFeeSchema, updateFeeSchema } from "../validations/fee.validation";

const upload = multer();
const router = Router();

/**
 * @openapi
 * /api/ranges/upload:
 *   post:
 *     summary: Upload withdrawal fee ranges from CSV file
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
 *         description: Fees uploaded successfully.
 *       500:
 *         description: Internal server error.
 */
router.post("/upload", upload.single("file"), controller.uploadFees);

/**
 * @openapi
 * /api/ranges:
 *   post:
 *     summary: Create a new withdrawal fee range
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
 *               fee:
 *                 type: number
 *                 example: 1.5
 *     responses:
 *       201:
 *         description: Fee range created successfully.
 *       500:
 *         description: Internal server error.
 */
router.post("/", validate(createFeeSchema, 'body'), controller.createFee);

/**
 * @openapi
 * /api/ranges/{id}:
 *   put:
 *     summary: Update an existing withdrawal fee range
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the fee range to update
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
 *               fee:
 *                 type: number
 *                 example: 2.0
 *     responses:
 *       200:
 *         description: Fee range updated successfully.
 *       500:
 *         description: Internal server error.
 */
router.put("/:id", validate(updateFeeSchema, 'body'), controller.updateFee);

/**
 * @openapi
 * /api/ranges/{id}:
 *   delete:
 *     summary: Delete a withdrawal fee range
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the fee range to delete
 *     responses:
 *       204:
 *         description: Fee range deleted successfully.
 *       500:
 *         description: Internal server error.
 */
router.delete("/:id", controller.deleteFee);

/**
 * @openapi
 * /api/ranges/calculate:
 *   get:
 *     summary: Calculate withdrawal fee based on amount
 *     parameters:
 *       - in: query
 *         name: amount
 *         required: true
 *         schema:
 *           type: number
 *           example: 150
 *         description: Amount to calculate the fee for
 *     responses:
 *       200:
 *         description: Returns applicable fee details.
 *       404:
 *         description: No fee range found for given amount.
 *       500:
 *         description: Internal server error.
 */
router.get("/calculate", validate(calculateFeeSchema, 'query'), controller.calculateFee);

/**
 * @openapi
 * /api/ranges:
 *   get:
 *     summary: Get all withdrawal fee ranges
 *     responses:
 *       200:
 *         description: Successfully retrieved all fee ranges.
 *       500:
 *         description: Internal server error.
 */
router.get("/", controller.getAllFees);

export default router;
