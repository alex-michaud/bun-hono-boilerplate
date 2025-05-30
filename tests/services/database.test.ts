import { beforeAll, describe, expect, it } from 'bun:test';
import { prisma } from '../../src/services/database';

describe('Database tests', () => {
  beforeAll(async () => {
    // Ensure the database is connected before running tests
    await prisma.$connect();
  });

  it('should connect to the database', async () => {
    const users = await prisma.user.findMany();
    expect(Array.isArray(users)).toBe(true);
  });
});
