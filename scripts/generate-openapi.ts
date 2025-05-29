import bun from 'bun';
import swaggerJSDoc from 'swagger-jsdoc';

const packageJson = await bun.file('./package.json').json();

const options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'bun-hono-boilerplate',
      version: packageJson.version,
    },
  },
  apis: ['./src/api/**/*.ts'],
};

const openapiSpec = swaggerJSDoc(options);

await bun.write('./docs/openapi.json', JSON.stringify(openapiSpec, null, 2));
console.log(
  `✅ OpenAPI JSON (v${packageJson.version}) saved in /docs/openapi.json`,
);
