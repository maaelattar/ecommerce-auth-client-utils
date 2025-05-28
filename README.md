# 🔐 @ecommerce/auth-client-utils

> **Shared Authentication & Authorization Library for Ecommerce Microservices**

[![npm version](https://badge.fury.io/js/%40ecommerce%2Fauth-client-utils.svg)](https://badge.fury.io/js/%40ecommerce%2Fauth-client-utils)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)](https://nestjs.com/)

## 📖 **Overview**

Centralized authentication and authorization utilities for ecommerce microservices built with NestJS. This package provides consistent auth patterns, JWT strategies, guards, decorators, and user types across all services.

## ✨ **Features**

- 🔒 **JWT Authentication Strategy** - Ready-to-use Passport JWT strategy
- 🛡️ **Authorization Guards** - `JwtAuthGuard`, `RolesGuard` for route protection
- 🎯 **Custom Decorators** - `@CurrentUser()`, `@Roles()` for clean controller code
- 📋 **User Types & Enums** - `UserRole`, `UserStatus`, `AuthUser` interfaces
- 🔧 **Configuration Module** - Easy JWT setup and configuration
- 🧪 **Testing Utilities** - Mocks and helpers for unit/integration tests

## 🚀 **Quick Start**

### Installation
```bash
npm install @ecommerce/auth-client-utils
```

### Basic Setup
```typescript
// app.module.ts
import { AuthModule } from '@ecommerce/auth-client-utils';

@Module({
  imports: [
    AuthModule.forRoot({
      jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: '24h',
      },
    }),
  ],
})
export class AppModule {}
```

### Protected Routes
```typescript
// user.controller.ts
import { 
  CurrentUser, 
  Roles, 
  JwtAuthGuard, 
  RolesGuard,
  UserRole,
  AuthUser 
} from '@ecommerce/auth-client-utils';

@Controller('users')
export class UserController {
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: AuthUser) {
    return { userId: user.sub, email: user.email };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteUser(@Param('id') id: string) {
    // Only admins can access this endpoint
    return this.userService.delete(id);
  }
}
```

## 📚 **API Reference**

### **Types & Enums**

#### UserRole
```typescript
enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
  MODERATOR = 'moderator'
}
```

#### UserStatus  
```typescript
enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING_VERIFICATION = 'pending_verification',
  SUSPENDED = 'suspended'
}
```

#### AuthUser Interface
```typescript
interface AuthUser {
  sub: string;        // User ID
  email: string;      // User email
  role: UserRole;     // User role
  status: UserStatus; // User status
  iat: number;        // Issued at
  exp: number;        // Expires at
}
```

### **Decorators**

#### @CurrentUser()
Extracts the authenticated user from the request context.

```typescript
@Get('profile')
@UseGuards(JwtAuthGuard)
async getProfile(@CurrentUser() user: AuthUser) {
  return user;
}
```

#### @Roles(...roles)
Restricts access to specific user roles.

```typescript
@Post('admin-action')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.MODERATOR)
async adminAction() {
  // Only admins and moderators can access
}
```

### **Guards**

#### JwtAuthGuard
Validates JWT tokens and populates the user context.

```typescript
@UseGuards(JwtAuthGuard)
```

#### RolesGuard  
Checks if the authenticated user has required roles.

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
```

### **Strategies**

#### JwtStrategy
Passport strategy for JWT token validation.

```typescript
// Automatically configured when using AuthModule.forRoot()
```

## 🔧 **Configuration**

### Environment Variables
```env
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=24h
```

### Module Configuration
```typescript
AuthModule.forRoot({
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
})
```

## 🧪 **Testing**

The package includes testing utilities:

```typescript
import { createMockAuthUser, mockJwtGuard } from '@ecommerce/auth-client-utils/testing';

describe('UserController', () => {
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: JwtAuthGuard,
          useValue: mockJwtGuard,
        },
      ],
    }).compile();
  });

  it('should return user profile', () => {
    const mockUser = createMockAuthUser({ role: UserRole.CUSTOMER });
    // Test with mock user...
  });
});
```

## 🏗️ **Architecture**

This package follows the **shared library pattern** for microservices:

```
@ecommerce/auth-client-utils
├── 📁 src/
│   ├── 📁 decorators/     # @CurrentUser, @Roles
│   ├── 📁 guards/         # JwtAuthGuard, RolesGuard  
│   ├── 📁 strategies/     # JwtStrategy
│   ├── 📁 types/          # UserRole, UserStatus, AuthUser
│   ├── 📁 utils/          # Helper functions
│   ├── 📁 examples/       # Usage examples
│   ├── auth.module.ts     # Main module
│   └── index.ts           # Public API
├── 📁 dist/               # Compiled output
├── package.json
└── README.md
```

## 🤝 **Contributing**

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 **Related Packages**

- [@ecommerce/core-utils](https://github.com/your-org/ecommerce-core-utils) - Core utilities and common functionality
- [@ecommerce/rabbitmq-event-utils](https://github.com/your-org/ecommerce-rabbitmq-event-utils) - Event-driven messaging utilities

---

**Built with ❤️ for the Ecommerce Microservices Ecosystem**