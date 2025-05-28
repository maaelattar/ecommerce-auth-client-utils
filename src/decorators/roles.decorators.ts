import { SetMetadata } from '@nestjs/common';
import { UserRole, Permission } from '../types/user.types';

export const ROLES_KEY = 'roles';
export const PERMISSIONS_KEY = 'permissions';

/**
 * Require specific roles for endpoint access
 * Usage: @Roles(UserRole.ADMIN, UserRole.VENDOR)
 */
export const Roles = (...roles: UserRole[]) => 
  SetMetadata(ROLES_KEY, roles);

/**
 * Require specific permissions for endpoint access
 * Usage: @RequirePermissions(Permission.USER_READ, Permission.USER_WRITE)
 */
export const RequirePermissions = (...permissions: Permission[]) => 
  SetMetadata(PERMISSIONS_KEY, permissions);