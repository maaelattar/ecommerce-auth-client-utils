/**
 * User roles in the ecommerce system
 */
export enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
  VENDOR = 'vendor',
  SUPPORT = 'support'
}

/**
 * System permissions for fine-grained access control
 */
export enum Permission {
  // User permissions
  USER_READ = 'user:read',
  USER_WRITE = 'user:write',
  USER_DELETE = 'user:delete',
  
  // Product permissions
  PRODUCT_READ = 'product:read',
  PRODUCT_WRITE = 'product:write',
  PRODUCT_DELETE = 'product:delete',
  
  // Order permissions
  ORDER_READ = 'order:read',
  ORDER_WRITE = 'order:write',
  ORDER_CANCEL = 'order:cancel',
  
  // Admin permissions
  ADMIN_ACCESS = 'admin:access',
  SYSTEM_CONFIG = 'system:config'
}

/**
 * JWT token payload for authenticated users
 */
export interface UserPayload {
  sub: string;
  email: string;
  roles: UserRole[];
  permissions: Permission[];
  iat?: number;
  exp?: number;
}

/**
 * Authenticated user context available in request
 */
export interface AuthenticatedUser {
  id: string;
  email: string;
  roles: UserRole[];
  permissions: Permission[];
  isActive: boolean;
}