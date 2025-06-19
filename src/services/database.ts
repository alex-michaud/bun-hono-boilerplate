import { PGlite } from '@electric-sql/pglite'; // You don't need PGLite if you use a docker service instead
import { citext } from '@electric-sql/pglite/contrib/citext';
import { PrismaClient } from '@prisma/client';
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { PrismaPGlite } from 'pglite-prisma-adapter'; // You don't need to import this adapter if you use a docker service instead
import { config } from '../config';

export * from '@prisma/client';

const client = new PGlite(config.DATABASE_DIR, {
  extensions: { citext },
});
const adapter = new PrismaPGlite(client);
export const prisma = new PrismaClient({ adapter });

// If you are using a docker service instead of PGlite, you can use the following code:
// export const prisma = new PrismaClient(config.DATABASE_URL);

export {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
};
