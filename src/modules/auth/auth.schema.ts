import { z } from 'zod';

export const SignupSchema = z.object({
  name: z.string().regex(/^[a-zA-Z\s]+$/, 'Name must contain only alphabets and spaces.'),
  email: z.string().email('Invalid email address.'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters long.')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
    .regex(/[0-9]/, 'Password must contain at least one number.')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character.'),
  role: z.enum(['AUTHOR', 'READER'], { required_error: 'Role is mandatory and must be AUTHOR or READER.' })
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(1, 'Password is required.')
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required.')
});
