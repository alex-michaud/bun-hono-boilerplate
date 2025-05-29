import type { TokenPayload } from './services/auth';

export type Variables = {
  tokenPayload: TokenPayload;
  userId: string;
};
