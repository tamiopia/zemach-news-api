import { Router } from 'express';
import { authController } from './auth.controller';

const router = Router();

/**
 * @openapi
 * tags:
 *   name: Auth
 *   description: Authentication and Identity Management
 * 
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: StrongPass1!
 *               role:
 *                 type: string
 *                 enum: [AUTHOR, READER]
 *                 example: AUTHOR
 * /auth/login:
 *   post:
 *     summary: Log in to the application
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: StrongPass1!
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh JWT access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5...
 */
router.post('/signup', (req, res) => { authController.signup(req, res); });
router.post('/login', (req, res) => { authController.login(req, res); });
router.post('/refresh-token', (req, res) => { authController.refreshToken(req, res); });

export default router;
