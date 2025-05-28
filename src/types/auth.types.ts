/**
 * Login credentials for user authentication
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * JWT token pair response
 */
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Refresh token payload structure
 */
export interface RefreshTokenPayload {
  sub: string;
  tokenId: string;
  type: 'refresh';
}

/**
 * JWT configuration settings
 */
export interface JwtConfig {
  secret: string;
  accessTokenExpiresIn: string;
  refreshTokenExpiresIn: string;
  issuer: string;
  audience: string;
}