import { Hono } from 'hono';
import type { AuthType } from '../lib/auth';
import { AuthError, AuthErrorType } from '../services/error/authError';
import authRouter from './auth';
import { healthHandler, testDBHandler } from './handlers/indexHandlers';
import postRouter from './post';

const apiRouter = new Hono<{ Variables: AuthType }>({
  strict: false,
});

/**
 * @openapi
 * /api/health/db:
 *   get:
 *     summary: Test database connection
 *     description: Check if the database connection is working
 *     responses:
 *       200:
 *         description: Database connected successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 */
apiRouter.get('/health/db', testDBHandler);

/**
 * @openapi
 * /api/health/api:
 *   get:
 *     summary: Health check
 *     description: Check if the API is running
 *     responses:
 *       200:
 *         description: API is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 */
apiRouter.get('/health/api', healthHandler);

apiRouter.route('/auth', authRouter);

// before the authentication middleware, all routes are public
// Authentication middleware
apiRouter.use(async (c, next) => {
  const session = c.get('session');
  console.log('session', session);
  if (!session) {
    throw new AuthError(AuthErrorType.UNAUTHORIZED);
  }
  await next();
});
// from here all routes are protected

apiRouter.route('/post', postRouter);

export default apiRouter;
