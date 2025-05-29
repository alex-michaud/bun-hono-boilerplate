// prisma.config.ts
import { PGlite } from '@electric-sql/pglite';
import { citext } from '@electric-sql/pglite/contrib/citext';
import { PrismaPGlite } from 'pglite-prisma-adapter';
import type { PrismaConfig } from 'prisma';
import { config } from './src/config';

type Env = {
  DATABASE_DIR: string;
};

const client = new PGlite(config.DATABASE_DIR, {
  extensions: { citext },
});
const adapter = new PrismaPGlite(client);

export default {
  earlyAccess: true,
  schema: './src/prisma/schema.prisma',
  migrate: {
    async adapter() {
      return adapter;
    },
  },
  studio: {
    async adapter() {
      return adapter;
    },
  },
} satisfies PrismaConfig<Env>;
