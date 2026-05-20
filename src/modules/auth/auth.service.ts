import { userRepository } from '../users/users.repository';
import { hashPassword, verifyPassword } from '../../utils/hash';
import { generateAccessToken } from '../../utils/token';
import prisma from '../../db/prisma';
import crypto from 'crypto';

export class AuthService {
  async signup(data: any) {
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('Email already in use.');
    }

    const hashedPassword = await hashPassword(data.password);
    const user = await userRepository.create({
      ...data,
      password: hashedPassword
    });

    return { id: user.id, name: user.name, email: user.email, role: user.role };
  }

  async login(data: any) {
    const user = await userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const isValid = await verifyPassword(data.password, user.password);
    if (!isValid) {
      throw new Error('Invalid email or password.');
    }

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = crypto.randomBytes(40).toString('hex');
    
    // store refresh token
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      }
    });

    return { accessToken, refreshToken, user: { id: user.id, name: user.name, role: user.role } };
  }

  async refreshToken(token: string) {
    const record = await prisma.refreshToken.findUnique({ where: { token } });
    if (!record || record.revoked || record.expiresAt < new Date()) {
      throw new Error('Invalid or expired refresh token.');
    }

    // Revoke old token
    await prisma.refreshToken.update({
      where: { id: record.id },
      data: { revoked: true }
    });

    const user = await userRepository.findById(record.userId);
    if (!user) throw new Error('User not found.');

    const newAccessToken = generateAccessToken(user.id, user.role);
    const newRefreshToken = crypto.randomBytes(40).toString('hex');

    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async revokeToken(token: string) {
    await prisma.refreshToken.updateMany({
      where: { token },
      data: { revoked: true }
    });
  }
}

export const authService = new AuthService();
