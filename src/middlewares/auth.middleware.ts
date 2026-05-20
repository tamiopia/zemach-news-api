import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/token';
import { errorResponse } from '../utils/response';

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json(errorResponse('Unauthorized. Missing or invalid token.'));
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = verifyToken(token);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch (err) {
    res.status(401).json(errorResponse('Unauthorized. Token is invalid or expired.'));
  }
};
