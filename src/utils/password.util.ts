import * as bcrypt from 'bcrypt';

/**
 * Password utility functions
 * Single responsibility: Handle password hashing and validation
 */
export class PasswordUtil {
  private static readonly SALT_ROUNDS = 12;

  /**
   * Hash password using bcrypt
   */
  static async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Compare plain password with hashed password
   */
  static async compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  /**
   * Validate password strength
   * Returns true if password meets requirements
   */
  static validateStrength(password: string): boolean {
    // Minimum 8 characters, at least one letter and one number
    const minLength = password.length >= 8;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    return minLength && hasLetter && hasNumber;
  }
}