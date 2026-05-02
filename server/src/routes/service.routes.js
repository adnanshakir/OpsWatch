import { Router } from 'express';
import {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
} from '../controllers/service.controller.js';
import {
  authenticate,
  requireWorkspace,
} from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import {
  createServiceSchema,
  updateServiceSchema,
} from '../validators/service.validator.js';
import { apiLimiter } from '../middlewares/rateLimit.middleware.js';

const router = Router();

// Protect all routes
router.use(authenticate);
router.use(requireWorkspace);
router.use(apiLimiter);

/**
 * @route   GET /api/services
 * @desc    Get all services for the current workspace
 * @access  Private
 */
router.get('/', getServices);

/**
 * @route   GET /api/services/:id
 * @desc    Get a single service by ID
 * @access  Private
 */
router.get('/:id', getServiceById);

/**
 * @route   POST /api/services
 * @desc    Create a new service for the current workspace
 * @access  Private
 */
router.post(
  '/',
  // requireVerification, // Temporarily disabled
  validate(createServiceSchema),
  createService
);

/**
 * @route   PATCH /api/services/:id
 * @desc    Update a service (partial update)
 * @access  Private
 */
router.patch('/:id', validate(updateServiceSchema), updateService);

/**
 * @route   DELETE /api/services/:id
 * @desc    Delete a service (only if not used in any incident)
 * @access  Private
 */
router.delete('/:id', deleteService);

export default router;
