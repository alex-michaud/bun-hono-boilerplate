import { prisma } from '../../services/database';
import type { CreateComment, UpdateComment } from '../comment';

export const createCommentHandler = async ({
  userId,
  data,
}: {
  userId: string;
  data: CreateComment;
}) => {
  return prisma.comment.create({
    data: {
      ...data,
      userId,
    },
  });
};

export const getCommentHandler = async ({
  userId,
  commentId,
}: {
  userId: string;
  commentId: string;
}) => {
  return prisma.comment.findUnique({
    where: { userId, id: commentId },
  });
};

export const getCommentListHandler = async ({ userId }: { userId: string }) => {
  return prisma.comment.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

export const updateCommentHandler = async ({
  userId,
  data,
}: {
  userId: string;
  data: UpdateComment;
}) => {
  const { id, ...updateData } = data;
  return prisma.comment.update({
    where: { id, userId },
    data: updateData,
  });
};

export const deleteCommentHandler = async ({
  userId,
  commentId,
}: {
  userId: string;
  commentId: string;
}) => {
  return prisma.comment.delete({
    where: { id: commentId, userId },
  });
};
