import type { Context } from 'hono';
import { prisma } from '../../services/database';

export const healthHandler = async (c: Context) => {
  return c.json({ status: 'OK' });
};

export const testDBHandler = async (c: Context) => {
  await prisma.$connect();
  return c.json({ status: 'Database connected successfully' });
};
