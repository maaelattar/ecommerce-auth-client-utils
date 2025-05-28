import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, PERMISSIONS_KEY } from '../decorators/roles.decorators';
import { UserRole, Permission, AuthenticatedUser } from '../types/user.types';

/**
 * Role and permission-based authorization guard
 * Single responsibility: Check user roles and permissions
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // No roles or permissions required
    if (!requiredRoles && !requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: AuthenticatedUser = request.user;

    // User must be authenticated
    if (!user) {
      return false;
    }

    // Check roles if required
    if (requiredRoles && !this.hasRequiredRoles(user.roles, requiredRoles)) {
      return false;
    }

    // Check permissions if required  
    if (requiredPermissions && !this.hasRequiredPermissions(user.permissions, requiredPermissions)) {
      return false;
    }

    return true;
  }

  private hasRequiredRoles(userRoles: UserRole[], requiredRoles: UserRole[]): boolean {
    return requiredRoles.some(role => userRoles.includes(role));
  }

  private hasRequiredPermissions(userPermissions: Permission[], requiredPermissions: Permission[]): boolean {
    return requiredPermissions.every(permission => userPermissions.includes(permission));
  }
}