import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { UserRole, Permission } from '../types/user.types';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  const mockContext = (user: any) => ({
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
    getHandler: () => {},
    getClass: () => {},
  });

  it('should allow access when no roles required', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
    
    const context = mockContext({ id: 'user1', roles: [UserRole.CUSTOMER] });
    expect(guard.canActivate(context as any)).toBe(true);
  });

  it('should deny access when user not authenticated', () => {
    jest.spyOn(reflector, 'getAllAndOverride')
      .mockReturnValueOnce([UserRole.ADMIN])
      .mockReturnValueOnce(undefined);
    
    const context = mockContext(null);
    expect(guard.canActivate(context as any)).toBe(false);
  });

  it('should allow access with correct role', () => {
    jest.spyOn(reflector, 'getAllAndOverride')
      .mockReturnValueOnce([UserRole.ADMIN])
      .mockReturnValueOnce(undefined);
    
    const context = mockContext({ 
      id: 'user1', 
      roles: [UserRole.ADMIN],
      permissions: []
    });
    expect(guard.canActivate(context as any)).toBe(true);
  });

  it('should allow access with correct permission', () => {
    jest.spyOn(reflector, 'getAllAndOverride')
      .mockReturnValueOnce(undefined)
      .mockReturnValueOnce([Permission.USER_READ]);
    
    const context = mockContext({ 
      id: 'user1', 
      roles: [UserRole.CUSTOMER],
      permissions: [Permission.USER_READ]
    });
    expect(guard.canActivate(context as any)).toBe(true);
  });
});