import express from 'express';
import rangeRoutes from './fee.routes';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../swagger';

const router = express.Router();

router.use('/ranges', rangeRoutes);
router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default router;