import process from 'node:process';
import { swaggerUI } from '@hono/swagger-ui';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { trimTrailingSlash } from 'hono/trailing-slash';
import openapiSpec from '../docs/openapi.json' with { type: 'json' };
import apiRouter from './api';
import { routingErrorHandler } from './services/error/routingErrorHandler';
import { logger } from './services/logger';

export const app = new Hono({ strict: true });

app.use(trimTrailingSlash());

// Configure CORS
app.use(
  '*',
  cors({
    origin: '*', // Replace with your client's domain or use '*' to allow all origins
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowHeaders: ['Authorization', 'Content-Type'], // Allowed headers
    maxAge: 600, // Cache the preflight response for 10 minutes
  }),
);

app.get('/', (c) =>
  c.text(
    'The server is running!\nYou can access the API at /api.\nThe documentation is available at /docs.',
  ),
);

app.route('/api', apiRouter);

app.get(
  '/docs',
  swaggerUI({
    url: '/docs/openapi.json',
    spec: openapiSpec,
  }),
);

app.get('/docs/openapi.json', (c) => c.json(openapiSpec));

// Global error handler
app.onError((err, c) => {
  return routingErrorHandler(err, c);
});

process.on('SIGINT', async () => {
  logger.info('Shutting down gracefully...');
  process.exit(0);
});
