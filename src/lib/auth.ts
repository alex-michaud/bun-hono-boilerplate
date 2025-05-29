import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import type { Context } from 'hono';
import { config } from '../config';
import { prisma } from '../services/database';
import { AuthError, AuthErrorType } from '../services/error/authError';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  // Allow requests from the frontend development server
  trustedOrigins: config.TRUSTED_ORIGINS,
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    defaultCookieAttributes: {
      httpOnly: true,
      secure: true,
    },
    database: {
      useNumberId: false,
      generateId: false,
      casing: 'camel', // Use camelCase for database fields
    },
    useSecureCookies: true,
  },
  user: {
    modelName: 'user',
  },
  account: {
    modelName: 'account',
    fields: {
      userId: 'userId',
    },
    accountLinking: {
      enabled: true,
      trustedProviders: ['google', 'github', 'email-password'],
      allowDifferentEmails: false,
    },
  },
  session: {
    modelName: 'session',
    fields: {
      userId: 'userId',
    },
    expiresIn: 604800, // 7 days
    updateAge: 86400, // 1 day
    disableSessionRefresh: true, // Disable session refresh so that the session is not updated regardless of the `updateAge` option. (default: `false`)
    additionalFields: {
      // Additional fields for the session table
      customField: {
        type: 'string',
      },
    },
    storeSessionInDatabase: true, // Store session in the database when secondary storage is provided (default: `false`)
    preserveSessionInDatabase: false, // Preserve session records in the database when deleted from secondary storage (default: `false`)
    cookieCache: {
      enabled: false, // Enable caching session in cookie (default: `false`)
      maxAge: 300, // 5 minutes
    },
  },
  /*databaseHooks: {
    account: {
      create: {
        before: async (account) => {
          console.log('Account created:', account);
        },
      },
    },
  },*/
  /*socialProviders: {
    github: {
      clientId: config.GITHUB_CLIENT_ID,
      clientSecret: config.GITHUB_CLIENT_SECRET,
    },
    google: {
      clientId: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
    },
  },*/
});

export type AuthType = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
};

export const getUserFromContext = (c: Context<{ Variables: AuthType }>) => {
  const user = c.get('user');
  if (!user) {
    throw new AuthError(AuthErrorType.UNAUTHORIZED);
  }
  return user;
};

export const getSessionFromContext = (c: Context<{ Variables: AuthType }>) => {
  const session = c.get('session');
  if (!session) {
    throw new AuthError(AuthErrorType.UNAUTHORIZED);
  }
  return session;
};
