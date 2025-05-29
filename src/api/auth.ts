import { type Context, Hono } from 'hono';
import { auth } from '../lib/auth';
import type { AuthType } from '../lib/auth';

const router = new Hono<{ Bindings: AuthType }>({
  strict: false,
});

router.on(['POST', 'GET'], '/*', (c: Context) => {
  console.log('Auth request:', c.req.method, c.req.path);
  return auth.handler(c.req.raw);
});

export default router;
