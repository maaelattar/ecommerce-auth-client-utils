import { PasswordUtil } from './password.util';

// Mock bcrypt to avoid native module issues in tests
jest.mock('bcrypt', () => ({
  hash: jest.fn((password: string) => Promise.resolve(`hashed_${password}`)),
  compare: jest.fn((password: string, hashed: string) => 
    Promise.resolve(hashed === `hashed_${password}`)
  ),
}));

describe('PasswordUtil', () => {
  describe('hash', () => {
    it('should hash password', async () => {
      const password = 'test123';
      const hashed = await PasswordUtil.hash(password);
      
      expect(hashed).toBeDefined();
      expect(hashed).not.toBe(password);
      expect(hashed).toBe('hashed_test123');
    });
  });

  describe('compare', () => {
    it('should return true for correct password', async () => {
      const password = 'test123';
      const hashed = 'hashed_test123';
      
      const result = await PasswordUtil.compare(password, hashed);
      expect(result).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const password = 'test123';
      const wrongPassword = 'wrong';
      const hashed = 'hashed_test123';
      
      const result = await PasswordUtil.compare(wrongPassword, hashed);
      expect(result).toBe(false);
    });
  });

  describe('validateStrength', () => {
    it('should return true for strong password', () => {
      expect(PasswordUtil.validateStrength('password123')).toBe(true);
    });

    it('should return false for weak password', () => {
      expect(PasswordUtil.validateStrength('weak')).toBe(false);
      expect(PasswordUtil.validateStrength('12345678')).toBe(false);
      expect(PasswordUtil.validateStrength('onlyletters')).toBe(false);
    });
  });
});