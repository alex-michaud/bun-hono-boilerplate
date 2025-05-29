import process from 'node:process';
import bun from 'bun';
import { config } from './config';
import { app } from './server';
import cleanStack from './services/error/cleanStack';
import { logger } from './services/logger';

bun.serve({
  port: config.API_PORT,
  fetch: app.fetch,
});

logger.info(`Server running at http://localhost:${config.API_PORT}`);

process.on('unhandledRejection', (reason: unknown) => {
  if (reason instanceof Error) {
    logger.error('unhandledRejection', {
      message: reason.message,
      stack: cleanStack(reason.stack),
    });
  } else if (typeof reason === 'string') {
    logger.error('unhandledRejection', {
      message: reason,
    });
  }
});

process.on('uncaughtException', (error: Error) => {
  logger.error('uncaughtException', {
    message: error.message,
    stack: cleanStack(error.stack),
  });
  process.exit(1);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received. Closing server.');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received. Closing server.');
  process.exit(0);
});
