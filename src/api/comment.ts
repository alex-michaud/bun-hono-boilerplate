import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod/v4';
import { type AuthType, getUserFromContext } from '../lib/auth';
import {
  createCommentHandler,
  getCommentHandler,
  getCommentListHandler,
  updateCommentHandler,
} from './handlers/commentHandlers';

const app = new Hono<{ Variables: AuthType }>({
  strict: false,
});

// Define the schema for comment creation
const createCommentSchema = z.object({
  postId: z.string().min(1, 'Post ID is required'),
  content: z.string().min(1, 'Content is required'),
});

export type CreateComment = z.infer<typeof createCommentSchema>;

// Define the schema for comment update
const updateCommentSchema = z.object({
  id: z.ulid('Invalid comment ID format'),
  content: z.string(),
});

export type UpdateComment = z.infer<typeof updateCommentSchema>;

/**
 * @openapi
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: ulid
 *           description: The ID of the comment
 *         commentId:
 *           type: string
 *           description: The ID of the comment the comment belongs to
 *         userId:
 *           type: string
 *           description: The ID of the user who created the comment
 *         content:
 *           type: string
 *           description: The content of the comment
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the comment was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the comment was last updated
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateCommentRequest:
 *       type: object
 *       properties:
 *         content:
 *           type: string
 *           description: The content of the comment
 *           required: true
 *
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     UpdateCommentRequest:
 *       type: object
 *       properties:
 *         content:
 *           type: string
 *           description: The content of the comment
 *           required: false
 *
 */

/**
 * @openapi
 * /api/comment/{commentId}:
 *   get:
 *     tags:
 *       - Comment
 *     summary: Get comment by ID
 *     description: Retrieve a comment by its ID
 *     parameters:
 *       - name: commentId
 *         in: path
 *         required: true
 *         description: The ID of the comment to retrieve
 *         schema:
 *           type: string
 *           format: ulid
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 */
app.get('/:commentId', async (c) => {
  // getCommentHandler
  const commentId = c.req.param('commentId');
  if (!commentId) {
    throw new HTTPException(400, {
      message: 'Comment ID is required',
    });
  }

  const user = getUserFromContext(c);

  const comment = await getCommentHandler({ commentId, userId: user.id });
  if (!comment) {
    throw new HTTPException(404, {
      message: 'Comment not found',
    });
  }
  return c.json(comment);
});

/**
 * @openapi
 * /api/comment:
 *   get:
 *     tags:
 *       - Comment
 *     summary: List comments
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 */
app.get('/', async (c) => {
  const user = getUserFromContext(c);
  const commentList = await getCommentListHandler({ userId: user.id });
  return c.json(commentList);
});

/**
 * @openapi
 * /api/comment:
 *   comment:
 *     tags:
 *       - Comment
 *     summary: Create a new comment
 *     description: Create a new comment with the provided data
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: The content of the comment
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 */
app.post('/', async (c) => {
  // createCommentHandler
  const user = getUserFromContext(c);
  const commentData = await c.req.json();
  const parsedData = createCommentSchema.parse(commentData);
  const comment = await createCommentHandler({
    userId: user.id,
    data: parsedData,
  });
  if (!comment) {
    throw new HTTPException(400, {
      message: 'Failed to create comment',
    });
  }
  return c.json(comment, 201);
});

/**
 * @openapi
 * /api/comment:
 *   patch:
 *     tags:
 *       - Comment
 *     summary: Update an existing comment
 *     description: Update a comment with the provided data
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: ulid
 *                 description: The ID of the comment to update
 *               content:
 *                 type: string
 *                 description: The new content of the comment
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 */
app.patch('/:commentId', async (c) => {
  // updateCommentHandler
  const user = getUserFromContext(c);
  const commentId = c.req.param('commentId');
  if (!commentId) {
    throw new HTTPException(400, {
      message: 'Comment ID is required',
    });
  }
  const commentData = await c.req.json();
  const parsedData = updateCommentSchema.parse({
    ...commentData,
    id: commentId,
  });
  const comment = await updateCommentHandler({
    userId: user.id,
    data: parsedData,
  });
  if (!comment) {
    throw new HTTPException(404, {
      message: 'Comment not found or update failed',
    });
  }
  return c.json(comment);
});

export default app;
