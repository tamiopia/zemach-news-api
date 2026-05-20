import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const ACCESS_TOKEN_EXPIRES_IN = '15m';

export interface JwtPayload {
  sub: string;
  role: string;
}

export const generateAccessToken = (userId: string, role: string): string => {
  return jwt.sign({ sub: userId, role }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};
