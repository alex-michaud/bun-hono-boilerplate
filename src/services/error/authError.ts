import type { ContentfulStatusCode } from 'hono/utils/http-status';

export enum AuthErrorType {
  INVALID_TOKEN = 'INVALID_TOKEN',
  INVALID_REFRESH_TOKEN = 'INVALID_REFRESH_TOKEN',
  NO_AUTHORIZATION_HEADER = 'NO_AUTHORIZATION_HEADER',
  UNAUTHORIZED = 'UNAUTHORIZED',
  INVALID_JWT_SIGNATURE = 'INVALID_JWT_SIGNATURE',
  INVALID_REFRESH_TOKEN_SIGNATURE = 'INVALID_REFRESH_TOKEN_SIGNATURE',
  INVALID_SESSION = 'INVALID_SESSION',
  LOGIN_FAILED = 'LOGIN_FAILED',
  INVALID_OR_EXPIRED_TOKEN = 'INVALID_OR_EXPIRED_TOKEN',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  INVALID_CODE = 'INVALID_CODE',
  CODE_EXPIRED = 'CODE_EXPIRED',
}

const _authErrorList: Record<
  AuthErrorType,
  { message: string; httpCode: ContentfulStatusCode }
> = {
  [AuthErrorType.INVALID_TOKEN]: {
    message: 'Invalid token',
    httpCode: 401,
  },
  [AuthErrorType.INVALID_REFRESH_TOKEN]: {
    message: 'Invalid refresh token',
    httpCode: 401,
  },
  [AuthErrorType.INVALID_REFRESH_TOKEN_SIGNATURE]: {
    message: 'Invalid refresh token',
    httpCode: 401,
  },
  [AuthErrorType.NO_AUTHORIZATION_HEADER]: {
    message: 'No authorization header',
    httpCode: 400,
  },
  [AuthErrorType.UNAUTHORIZED]: {
    message: 'Unauthorized',
    httpCode: 401,
  },
  [AuthErrorType.INVALID_JWT_SIGNATURE]: {
    message: 'Unauthorized',
    httpCode: 401,
  },
  [AuthErrorType.INVALID_SESSION]: {
    message: 'Invalid player session',
    httpCode: 401,
  },
  [AuthErrorType.LOGIN_FAILED]: {
    message: 'Login failed',
    httpCode: 401,
  },
  [AuthErrorType.INVALID_OR_EXPIRED_TOKEN]: {
    message: 'Invalid or expired token',
    httpCode: 401,
  },
  [AuthErrorType.INVALID_CREDENTIALS]: {
    message: 'Invalid credentials',
    httpCode: 401,
  },
  [AuthErrorType.INVALID_CODE]: {
    message: 'Invalid code',
    httpCode: 400,
  },
  [AuthErrorType.CODE_EXPIRED]: {
    message: 'Code expired',
    httpCode: 400,
  },
};

export class AuthError extends Error {
  httpCode: ContentfulStatusCode;

  [key: string]: unknown;

  constructor(
    authErrorType: AuthErrorType,
    message?: string,
    extraParams?: unknown,
  ) {
    super(message ?? _authErrorList[authErrorType].message);
    this.httpCode = _authErrorList[authErrorType].httpCode;

    if (extraParams && typeof extraParams === 'object') {
      for (const key in extraParams) {
        if (Object.prototype.hasOwnProperty.call(extraParams, key)) {
          this[key] = (extraParams as Record<string, unknown>)[key];
        }
      }
    }
  }

  static isAuthError(error: unknown): error is AuthError {
    return error instanceof AuthError;
  }
}
