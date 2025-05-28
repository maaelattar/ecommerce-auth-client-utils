import { Module, Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import {
  AuthClientModule,
  JwtAuthGuard,
  RolesGuard,
  CurrentUser,
  UserId,
  Public,
  Roles,
  RequirePermissions,
  UserRole,
  Permission,
  AuthenticatedUser,
  JwtConfig,
} from '../index';

/**
 * Example: Configure auth module in your app module
 */
const jwtConfig: JwtConfig = {
  secret: process.env.JWT_SECRET || 'your-secret',
  accessTokenExpiresIn: '15m',
  refreshTokenExpiresIn: '7d',
  issuer: 'ecommerce-api',
  audience: 'ecommerce-users',
};

@Module({
  imports: [
    AuthClientModule.forRoot(jwtConfig),
  ],
  controllers: [UsersController],
})
export class AppModule {}

/**
 * Example: Using auth decorators and guards in controllers
 */
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  
  /**
   * Public endpoint - no authentication required
   */
  @Get('health')
  @Public()
  health() {
    return { status: 'ok' };
  }

  /**
   * Get current user profile - requires authentication
   */
  @Get('me')
  getProfile(@CurrentUser() user: AuthenticatedUser) {
    return {
      id: user.id,
      email: user.email,
      roles: user.roles,
    };
  }

  /**
   * Get user ID only
   */
  @Get('my-id')
  getUserId(@UserId() userId: string) {
    return { userId };
  }

  /**
   * Admin only endpoint
   */
  @Get('admin/all')
  @Roles(UserRole.ADMIN)
  getAllUsers(@CurrentUser() admin: AuthenticatedUser) {
    return { message: 'Admin access granted', admin: admin.email };
  }

  /**
   * Multiple roles allowed
   */
  @Get('vendor/products')
  @Roles(UserRole.ADMIN, UserRole.VENDOR)
  getVendorProducts() {
    return { message: 'Vendor or admin access' };
  }

  /**
   * Permission-based access
   */
  @Post('update')
  @RequirePermissions(Permission.USER_WRITE)
  updateUser(@Body() data: any, @CurrentUser('id') userId: string) {
    return { message: 'User updated', userId };
  }

  /**
   * Combined role and permission requirements
   */
  @Get('admin/system')
  @Roles(UserRole.ADMIN)
  @RequirePermissions(Permission.ADMIN_ACCESS, Permission.SYSTEM_CONFIG)
  systemConfig() {
    return { message: 'System configuration access granted' };
  }
}