import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: './docs/openapi.json',
  output: {
    path: './dist/client/hey-api', // Output directory for the generated client
    clean: true,
  },
  plugins: ['@hey-api/client-fetch'],
});
