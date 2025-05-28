# @ecommerce-auth-client-utils

Clean authentication utilities for ecommerce microservices built with NestJS.

## Philosophy

- **Simplicity**: Easy to understand and use
- **Clean Code**: Single responsibility, clear naming
- **Readability**: Self-documenting code with clear interfaces  
- **Maintainability**: Minimal dependencies, focused scope

## Features

### 🔐 Authentication
- JWT token validation with Passport strategy
- Public endpoint support (bypass auth)
- User context extraction from tokens

### 🛡️ Authorization  
- Role-based access control (RBAC)
- Permission-based access control
- Flexible guard combinations

### 🛠️ Utilities
- Password hashing with bcrypt
- JWT token generation and validation
- Password strength validation

## Installation

```bash
pnpm add @ecommerce-auth-client-utils
```

## Quick Start

### 1. Configure the module

```typescript
import { AuthClientModule, JwtConfig } from '@ecommerce-auth-client-utils';

const jwtConfig: JwtConfig = {
  secret: process.env.JWT_SECRET,
  accessTokenExpiresIn: '15m',
  refreshTokenExpiresIn: '7d',
  issuer: 'ecommerce-api',
  audience: 'ecommerce-users',
};

@Module({
  imports: [
    AuthClientModule.forRoot(jwtConfig),
  ],
})
export class AppModule {}
```

### 2. Use in controllers

```typescript
import { 
  JwtAuthGuard, 
  RolesGuard, 
  CurrentUser, 
  Roles, 
  Public,
  UserRole,
  AuthenticatedUser 
} from '@ecommerce-auth-client-utils';

@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
  
  @Get('public')
  @Public()
  getPublicProducts() {
    return { products: [] };
  }

  @Get('me')
  getMyProducts(@CurrentUser() user: AuthenticatedUser) {
    return { userId: user.id, products: [] };
  }

  @Post()
  @Roles(UserRole.VENDOR, UserRole.ADMIN)
  createProduct(@CurrentUser() user: AuthenticatedUser) {
    return { message: 'Product created by', user: user.email };
  }
}
```