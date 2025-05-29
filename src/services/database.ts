import { PGlite } from '@electric-sql/pglite';
import { citext } from '@electric-sql/pglite/contrib/citext';
import { PrismaClient } from '@prisma/client';
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { PrismaPGlite } from 'pglite-prisma-adapter';
import { config } from '../config';

export * from '@prisma/client';

const client = new PGlite(config.DATABASE_DIR, {
  extensions: { citext },
});
const adapter = new PrismaPGlite(client);
export const prisma = new PrismaClient({ adapter });

export {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
};
