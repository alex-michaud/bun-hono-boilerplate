import { prisma } from '../src/services/database';

export const createTestUser = async ({
  email,
  name,
}: {
  email: string;
  password?: string;
  name: string;
}) => {
  return prisma.user.create({
    data: {
      email,
      name,
    },
  });
};
