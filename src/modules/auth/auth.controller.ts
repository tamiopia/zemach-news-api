import { Request, Response } from 'express';
import { authService } from './auth.service';
import { SignupSchema, LoginSchema, RefreshTokenSchema } from './auth.schema';
import { successResponse, errorResponse } from '../../utils/response';
import { ZodError } from 'zod';

export class AuthController {
  async signup(req: Request, res: Response): Promise<void> {
    try {
      const data = SignupSchema.parse(req.body);
      const result = await authService.signup(data);
      res.status(201).json(successResponse('User created successfully.', result));
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json(errorResponse('Validation error.', error.errors.map(e => e.message)));
        return;
      }
      if (error.message === 'Email already in use.') {
        res.status(409).json(errorResponse('Conflict.', [error.message]));
        return;
      }
      res.status(500).json(errorResponse('Internal server error.', [error.message]));
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const data = LoginSchema.parse(req.body);
      const result = await authService.login(data);
      res.status(200).json(successResponse('Logged in successfully.', result));
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json(errorResponse('Validation error.', error.errors.map(e => e.message)));
        return;
      }
      if (error.message === 'Invalid email or password.') {
        res.status(401).json(errorResponse('Unauthorized.', [error.message]));
        return;
      }
      res.status(500).json(errorResponse('Internal server error.', [error.message]));
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const data = RefreshTokenSchema.parse(req.body);
      const result = await authService.refreshToken(data.refreshToken);
      res.status(200).json(successResponse('Token refreshed successfully.', result));
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json(errorResponse('Validation error.', error.errors.map(e => e.message)));
        return;
      }
      res.status(401).json(errorResponse('Unauthorized.', [error.message]));
    }
  }
}

export const authController = new AuthController();
