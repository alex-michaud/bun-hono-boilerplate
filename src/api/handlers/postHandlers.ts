import { prisma } from '../../services/database';
import type { CreatePost, UpdatePost } from '../post';

export const createPostHandler = async ({
  userId,
  data,
}: {
  userId: string;
  data: CreatePost;
}) => {
  return prisma.post.create({
    data: {
      ...data,
      userId,
    },
  });
};

export const getPostHandler = async ({
  postId,
  userId,
}: {
  postId: string;
  userId: string;
}) => {
  return prisma.post.findUnique({
    where: { id: postId, userId },
  });
};

export const getPostListHandler = async ({ userId }: { userId: string }) => {
  return prisma.post.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

export const updatePostHandler = async ({
  userId,
  data,
}: {
  userId: string;
  data: UpdatePost;
}) => {
  const { id, ...updateData } = data;
  return prisma.post.update({
    where: { id, userId },
    data: updateData,
  });
};
