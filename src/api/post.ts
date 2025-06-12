import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod/v4';
import { type AuthType, getUserFromContext } from '../lib/auth';
import {
  createPostHandler,
  getPostHandler,
  getPostListHandler,
  updatePostHandler,
} from './handlers/postHandlers';

const app = new Hono<{ Variables: AuthType }>({ strict: false });

// Define the schema for post creation
const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
});

export type CreatePost = z.infer<typeof createPostSchema>;

// Define the schema for post update
const updatePostSchema = z.object({
  id: z.ulid('Invalid post ID format'),
  title: z.string().optional(),
  content: z.string().optional(),
});

export type UpdatePost = z.infer<typeof updatePostSchema>;

/**
 * @openapi
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: ulid
 *           description: The ID of the post
 *         userId:
 *           type: string
 *           description: The ID of the user who created the post
 *         title:
 *           type: string
 *           description: The title of the post
 *         content:
 *           type: string
 *           description: The content of the post
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the post was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the post was last updated
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     CreatePostRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the post
 *           required: true
 *         content:
 *           type: string
 *           description: The content of the post
 *           required: true
 *
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     UpdatePostRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the post
 *           required: false
 *         content:
 *           type: string
 *           description: The content of the post
 *           required: false
 *
 */

/**
 * @openapi
 * /api/post/{postId}:
 *   get:
 *     tags:
 *       - Post
 *     summary: Get post by ID
 *     description: Retrieve a post by its ID
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         description: The ID of the post to retrieve
 *         schema:
 *           type: string
 *           format: ulid
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 */
app.get('/:postId', async (c) => {
  // getPostHandler
  const postId = c.req.param('postId');
  if (!postId) {
    throw new HTTPException(400, {
      message: 'Post ID is required',
    });
  }

  const user = getUserFromContext(c);

  const post = await getPostHandler({ postId, userId: user.id });
  if (!post) {
    throw new HTTPException(404, {
      message: 'Post not found',
    });
  }
  return c.json(post);
});

/**
 * @openapi
 * /api/post:
 *   get:
 *     tags:
 *       - Post
 *     summary: List posts
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */
app.get('/', async (c) => {
  const user = getUserFromContext(c);
  const postList = await getPostListHandler({ userId: user.id });
  return c.json(postList);
});

/**
 * @openapi
 * /api/post:
 *   post:
 *     tags:
 *       - Post
 *     summary: Create a new post
 *     description: Create a new post with the provided data
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the post
 *               content:
 *                 type: string
 *                 description: The content of the post
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 */
app.post('/', async (c) => {
  // createPostHandler
  const user = getUserFromContext(c);
  const postData = await c.req.json();
  const parsedData = createPostSchema.parse(postData);
  const post = await createPostHandler({
    userId: user.id,
    data: parsedData,
  });
  if (!post) {
    throw new HTTPException(400, {
      message: 'Failed to create post',
    });
  }
  return c.json(post, 201);
});

/**
 * @openapi
 * /api/post:
 *   patch:
 *     tags:
 *       - Post
 *     summary: Update an existing post
 *     description: Update a post with the provided data
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
 *                 description: The ID of the post to update
 *               title:
 *                 type: string
 *                 description: The new title of the post
 *               content:
 *                 type: string
 *                 description: The new content of the post
 *     responses:
 *       200:
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 */
app.patch('/:postId', async (c) => {
  // updatePostHandler
  const user = getUserFromContext(c);
  const postId = c.req.param('postId');
  if (!postId) {
    throw new HTTPException(400, {
      message: 'Post ID is required',
    });
  }
  const postData = await c.req.json();
  const parsedData = updatePostSchema.parse({
    ...postData,
    id: postId,
  });
  const post = await updatePostHandler({
    userId: user.id,
    data: parsedData,
  });
  if (!post) {
    throw new HTTPException(404, {
      message: 'Post not found or update failed',
    });
  }
  return c.json(post);
});

export default app;
