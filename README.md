# bun-hono-boilerplate

# WIP - Do not use yet

Boilerplate project to create a backend with Bun and Hono

(This is a work in progress, don't use it in production yet)

## Why Bun and Hono?

Bun is a modern JavaScript runtime that is fast and efficient. It is designed to be a drop-in replacement for Node.js, but with a focus on performance and developer experience.
Hono is a lightweight web framework for Bun that is designed to be fast and easy to use. It is built on top of the Bun runtime and provides a simple API for building web applications.

The goal of this boilerplate is to provide a starting point for building a REST API backend that is fast, well-structured and easy to maintain.
I value simplicity and ease of understanding (low cognitive complexity). I believe that it will increase the chances of a successful project.
I try to follow standards and best practices. One of the goals is also to create code that is straightforward to test and that can be easily extended in the future.

## Features

- [Bun](https://bun.sh/)
- [Hono](https://hono.dev/)
- TypeScript
- [Biome](https://biomejs.dev/) (Linting and formatting)
- OpenAPI/Swagger

## Getting Started

### Install dependencies

To run this project, you will first need to install the [Bun](https://bun.sh/) runtime.
Bun also comes with a package manager and some utilities that I believe will simplify the project by having fewer packages to install and maintain.

Step-by-step guide to install bun, hono and other dependencies:

1. Install [Bun](https://bun.sh/docs/installation)

```bash
curl -fsSL https://bun.sh/install | bash
```

To validate the installation, run:

```bash
bun --version
```

To upgrade, run:

```bash
bun upgrade
```

2. Initialize a new Bun project

```bash
bun init
```

This will create the following files:

- index.ts
- tsconfig.json
- package.json

3. Install [Hono](https://hono.dev/)

```bash
bun add hono
```

4. Create a .env file

```bash
touch .env
```

And add the following content:

```
PORT=3000
DATABASE_DIR="./data"
```

Run this command to create the data directory:

```bash
mkdir -p data
```

5. Install [Zod](https://zod.dev)

```bash
bun add zod
```

6. Create a config file that will be used to load the environment variables

```bash
touch ./src/config.ts
```

7. Install Swagger-JSDoc

Swagger-JSDoc is a tool that allows you to generate OpenAPI specs document from comments in your code.
It is useful for many reasons :
- It allows you to document your API standardly.
- It allows other developers to understand your API without having to read the code.
- It allows generating a client SDK for your API. (React, Angular, Vue, etc.)
- It allows generating a MCP (Model-Context-Protocol)

```bash
bun add -d swagger-jsdoc @types/swagger-jsdoc
bun add @hono/swagger-ui
```

There is a script in `./scripts/generate-openapi.ts` that will generate the OpenAPI documentation from the comments in the code.
You can run it with:

```bash
bun run openapi
```

8. Install [Biome](https://biomejs.dev) *linting and formatting tool*

```bash
bun add --dev --exact @biomejs/biome
bun add -d eslint @eslint/js @typescript-eslint/parser @typescript-eslint/eslint-plugin typescript-eslint eslint-plugin-import globals
bun create @eslint/config@latest
```

9. Install [Prisma](https://www.prisma.io)

```bash
bun add -d typescript @types/node
bun add prisma
```

10. Install PGLite and its adapter

PGLite is a lightweight, file-based database. Its suitable from demo projects like this one but not for production use.
If you're planning to build a production-ready application, you should consider using a docker service instead.
You can refer to the file `docker-compose.yml` in this repository for an example of how to set up a Postgres database with Docker.

```bash
bun add pglite-prisma-adapter @electric-sql/pglite
```

[PGLite-Prisma-Adapter](https://github.com/lucasthevenet/pglite-utils/tree/main/packages/prisma-adapter)

_Note: PGLite is used as an example for this boilerplate. You can replace it with any other database adapter that is compatible with Prisma._


11. Initialize Prisma

Inside the `./src/prisma` directory, you will find the `schema.prisma` file. This is where you define your database schema.
You can copy the `schema.prisma` file from this boilerplate repository to your project.

Run the following command to generate the Prisma client:

```bash
bun prisma generate --schema=./src/prisma/schema.prisma
```

Run the following command to create the database and tables:

```bash
bun --env-file=.env prisma db push --schema=./src/prisma/schema.prisma
```

12. Install [Better-Auth](https://www.better-auth.com)

Better-Auth is a modern authentication library that provides a simple and secure way to handle user authentication in your application.
There are several authentication strategies available, such as email/password, social logins and more.
It can do a lot, therefore, I recommend you to check the [documentation](https://www.better-auth.com/docs) to understand how it works and how to configure it.


```bash
bun add better-auth
bunx @better-auth/cli generate --config ./src/lib/auth.ts
```

This will create the `src/lib/auth.ts` file with the configuration for Better-Auth.

13. Create the API routes

Create a new folder `src/api` and inside it create the following files:
```bash
mkdir -p src/api
touch src/api/index.ts
touch src/api/health.ts
touch src/api/auth.ts
```

14. Setup the tests
At the root of the project, create a `tests` folder and inside it create a `api` folder.
Then add [faker](https://fakerjs.dev/) package to generate fake data for testing:

```bash
bun add -d @faker-js/faker
```

Inside `tests/api` copy the `auth.test.ts` and `health.test.ts` files from this boilerplate repository.

15. Install [hey-api](https://heyapi.dev/)

Hey-API is a tool that can generate a client SDK from your OpenAPI specs document.

```bash
bun add -d @hey-api/client-fetch && bun add @hey-api/openapi-ts
```

Copy the file `openapi-ts.config.ts` from this boilerplate repository to your project.

Then execute the following command to generate the client SDK:

```bash
bun run openapi:client:hey-api
```

16. Generate an OpenAPI MCP (Model-Context-Protocol) server for LLMs

- https://github.com/ivo-toby/mcp-openapi-server
- https://github.com/ReAPI-com/mcp-openapi

