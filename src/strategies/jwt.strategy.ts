import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserPayload, AuthenticatedUser } from '../types/user.types';

/**
 * JWT authentication strategy
 * Single responsibility: Validate JWT tokens and create user context
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }

  /**
   * Validate JWT payload and return user context
   * Called automatically by Passport after token verification
   */
  async validate(payload: UserPayload): Promise<AuthenticatedUser> {
    return {
      id: payload.sub,
      email: payload.email,
      roles: payload.roles,
      permissions: payload.permissions,
      isActive: true,
    };
  }
}