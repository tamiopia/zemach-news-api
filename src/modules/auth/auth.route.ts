import { Router } from 'express';
import { authController } from './auth.controller';

const router = Router();

router.post('/signup', (req, res) => { authController.signup(req, res); });
router.post('/login', (req, res) => { authController.login(req, res); });
router.post('/refresh-token', (req, res) => { authController.refreshToken(req, res); });

export default router;
