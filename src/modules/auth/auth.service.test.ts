import { authService } from './auth.service';
import { userRepository } from '../users/users.repository';
import { hashPassword } from '../../utils/hash';

jest.mock('../users/users.repository');
jest.mock('../../utils/hash');
jest.mock('../../utils/token', () => ({
  generateAccessToken: jest.fn().mockReturnValue('mockAccessToken'),
}));
jest.mock('../../db/prisma', () => ({
  refreshToken: {
    create: jest.fn(),
  }
}));

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('should throw an error if email is already in use', async () => {
      (userRepository.findByEmail as jest.Mock).mockResolvedValue({ id: '1', email: 'test@test.com' });

      await expect(authService.signup({ email: 'test@test.com', password: 'Password1!', name: 'Test', role: 'AUTHOR' }))
        .rejects
        .toThrow('Email already in use.');
    });

    it('should create a new user successfully', async () => {
      (userRepository.findByEmail as jest.Mock).mockResolvedValue(null);
      (hashPassword as jest.Mock).mockResolvedValue('hashedPassword');
      (userRepository.create as jest.Mock).mockResolvedValue({
        id: '1',
        name: 'Test',
        email: 'test@test.com',
        role: 'AUTHOR'
      });

      const result = await authService.signup({ email: 'test@test.com', password: 'Password1!', name: 'Test', role: 'AUTHOR' });

      expect(result).toEqual({
        id: '1',
        name: 'Test',
        email: 'test@test.com',
        role: 'AUTHOR'
      });
      expect(userRepository.create).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'hashedPassword',
        name: 'Test',
        role: 'AUTHOR'
      });
    });
  });
});
