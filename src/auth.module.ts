import { Module, DynamicModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies';
import { JwtAuthGuard, RolesGuard } from './guards';
import { TokenUtil } from './utils';
import { JwtConfig } from './types';

/**
 * Auth client module for ecommerce microservices
 * Single responsibility: Provide authentication utilities and configuration
 */
@Module({})
export class AuthClientModule {
  /**
   * Configure auth module with JWT settings
   */
  static forRoot(config: JwtConfig): DynamicModule {
    return {
      module: AuthClientModule,
      imports: [
        PassportModule,
        JwtModule.register({
          secret: config.secret,
          signOptions: {
            expiresIn: config.accessTokenExpiresIn,
            issuer: config.issuer,
            audience: config.audience,
          },
        }),
      ],
      providers: [
        JwtStrategy,
        JwtAuthGuard,
        RolesGuard,
        TokenUtil,
      ],
      exports: [
        JwtAuthGuard,
        RolesGuard,
        TokenUtil,
        JwtModule,
      ],
    };
  }
}