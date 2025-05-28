import { JwtService } from '@nestjs/jwt';
import { RefreshTokenPayload, TokenPair } from '../types/auth.types';
import { UserPayload } from '../types/user.types';

/**
 * Token utility functions  
 * Single responsibility: JWT token creation and validation
 */
export class TokenUtil {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Generate access and refresh token pair
   */
  async generateTokenPair(payload: UserPayload): Promise<TokenPair> {
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });

    const refreshPayload: RefreshTokenPayload = {
      sub: payload.sub,
      tokenId: this.generateTokenId(),
      type: 'refresh',
    };

    const refreshToken = await this.jwtService.signAsync(refreshPayload, {
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60, // 15 minutes in seconds
    };
  }

  /**
   * Verify and decode JWT token
   */
  async verifyToken(token: string): Promise<UserPayload | RefreshTokenPayload> {
    return this.jwtService.verifyAsync(token);
  }

  /**
   * Generate unique token ID for refresh tokens
   */
  private generateTokenId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}