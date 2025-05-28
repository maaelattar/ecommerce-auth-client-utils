import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { AuthenticatedUser } from '../types/user.types';

/**
 * Extract current user from request context
 * Usage: @CurrentUser() user: AuthenticatedUser
 * Usage: @CurrentUser('id') userId: string
 */
export const CurrentUser = createParamDecorator(
  (field: keyof AuthenticatedUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as AuthenticatedUser;
    
    return field ? user?.[field] : user;
  }
);

/**
 * Extract user ID from request context
 * Usage: @UserId() userId: string
 */
export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.id;
  }
);

/**
 * Mark endpoint as public (no authentication required)
 * Usage: @Public()
 */
export const Public = () => SetMetadata('isPublic', true);