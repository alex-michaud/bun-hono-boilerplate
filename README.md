# bun-hono-boilerplate

# WIP - Do not use yet

Boilerplate project to create a backend with Bun and Hono

(This is a work in progress, don't use it in production yet)

## Why Bun and Hono?

Bun is a modern JavaScript runtime that is fast and efficient. 
It is designed to be a drop-in replacement for Node.js, but with a focus on 
performance and developer experience. Hono is a fast and lightweight web 
framework that is compatible with Bun. 

The goal of this boilerplate is to provide a starting point for building a REST 
API backend that is fast, well-structured and easy to maintain.
The project values simplicity and ease of understanding (low cognitive 
complexity), which increase the chance of success.
Another goal is to create code that is straightforward to test and easy to extend.

## Features

This boilerplate should provide a solid foundation for building a REST API 
backend with the following features:

- [Bun](https://bun.sh/)
- [Hono](https://hono.dev/)
- TypeScript
- [Biome](https://biomejs.dev/) (Linting and formatting)
- OpenAPI/Swagger
- [Prisma](https://www.prisma.io/) (ORM)
- [Better-Auth](https://www.better-auth.com/) (Authentication)
- [hey-api](https://heyapi.dev/) (Client SDK generation)
- MCP (Model-Context-Protocol) server for LLMs

Both hey-api and MCP server leverage the OpenAPI specs document to generate a 
client SDK and a server that can be used to interact with LLMs.

Before going further, keep a tab open to the Github repository of this 
[boilerplate](https://github.com/alex-michaud/bun-hono-boilerplate). I won't copy 
the code of every file here, but for each step I will tell you where to look in 
the repository to find the code you need to copy or adapt.

## Step by Step Installation Guide

To run this project, you will first need to install the [Bun](https://bun.sh/) runtime.
Bun also comes with a package manager and some utilities that I believe will 
simplify the project by having fewer packages to install and maintain.

Step-by-step guide to install bun, hono and other dependencies:

### 1. Install [Bun](https://bun.sh/docs/installation)

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

### 2. Initialize a new Bun project

```bash
bun init
```

This will create the following files:

- index.ts
- tsconfig.json
- package.json

### 3. Install [Hono](https://hono.dev/)

Hono is the framework that will be used to create the API.

```bash
bun add hono
```

### 4. Create a .env file

```bash
touch .env
```

And add the following content:

```
API_PORT=3000
DATABASE_DIR="./data"
BETTER_AUTH_SECRET=better-auth-secret
TRUSTED_ORIGINS=http://localhost:3000
```

Run this command to create the data directory:

```bash
mkdir -p data
```

### 5. Install [Zod](https://zod.dev)

Zod is a TypeScript-first schema declaration and validation library. It will be 
used to validate the data sent to the API.

```bash
bun add zod
```

### 6. Create a config file that will be used to load the environment variables

```bash
touch ./src/config.ts
```

To know what to put in the `config.ts` file, refer to the 
`./src/config.ts` file in this boilerplate repository.

### 7. Install Swagger-JSDoc

Swagger-JSDoc is a tool that allows you to generate OpenAPI specs document from 
comments in your code.
It is useful for many reasons :
- It allows you to document your API standardly.
- It allows other developers to understand your API without having to read the code.
- It allows generating a client SDK for your API. (React, Angular, Vue, etc.)
- It allows generating a MCP (Model-Context-Protocol)

```bash
bun add -d swagger-jsdoc @types/swagger-jsdoc
bun add @hono/swagger-ui
```

There is a script in `./scripts/generate-openapi.ts` that will generate the 
OpenAPI documentation from the comments in the code.
You can run it with:

```bash
bun run openapi
```

This will generate the OpenAPI specs document in the `./docs/openapi.json` file.

### 8. Install [Biome](https://biomejs.dev) *linting and formatting tool*

Biome is a modern linting and formatting tool that replaces ESLint and Prettier.
It's easier to use and configure than ESLint and Prettier, and it's also a lot 
faster.

```bash
bun add -d @biomejs/biome
```

### 9. Install [Pino](https://getpino.io)

Pino is a fast and lightweight logging library. 

_[Winston](https://github.com/winstonjs/winston) is also a good option, it has a
better documentation and broader support, but it's also a bit heavier_

```bash
bun add pino pino-pretty 
bun add -d @types/pino
```

Copy the file `./src/services/logger.ts` from this boilerplate 
repository to your project.

### 10. Install [Prisma](https://www.prisma.io)

Prisma is a modern ORM that allows you to interact with your database in a 
type-safe way. It offers a great migration system, a modern query API and good 
documentation. 

```bash
bun add -d typescript @types/node
bun add prisma
```

### 11. Install [PGLite](https://pglite.dev/) and its [adapter](https://github.com/lucasthevenet/pglite-utils/tree/main/packages/prisma-adapter)

PGLite is a lightweight, file-based database. It's suitable for demo projects 
like this one, but not for production use. If you're planning to build a 
production-ready application, you should consider using a docker service instead. 
A docker service is more similar to what you will use in production. You can 
refer to the file `docker-compose.yml` in this repository for an example of how 
to set up a Postgres database with Docker.

_skip this step if you plan to use a docker service instead of PGLite._

```bash
bun add pglite-prisma-adapter @electric-sql/pglite
```

_Note: PGLite is used as an example for this boilerplate. You can replace it 
with any other database adapter that is compatible with Prisma._


### 12. Initialize Prisma

Inside the `./src/prisma/` directory, you will find the `schema.prisma` file. 
This is where you define your database schema. You can copy the `schema.prisma` 
file from this boilerplate repository to your project.

Run the following command to generate the Prisma client:

```bash
bun prisma generate --schema=./src/prisma/schema.prisma
```

Run the following command to create the database and tables:

```bash
bun --env-file=.env prisma db push --schema=./src/prisma/schema.prisma
```

Finally, copy the file `src/services/database.ts` from this boilerplate 
repository to your project.

### 13. Install [Better-Auth](https://www.better-auth.com)

Better-Auth is a modern authentication library that provides a simple and secure 
way to handle user authentication in your application. There are several 
authentication strategies available, such as email/password, social logins and 
more. It can do a lot, therefore, I recommend you to check the 
[documentation](https://www.better-auth.com/docs) to understand how it works and how to configure it.


```bash
bun add better-auth
bunx @better-auth/cli generate --config ./src/lib/auth.ts
```

This will create the `src/lib/auth.ts` file with the configuration for Better-Auth.

### 14. Create the API routes

Create a new folder `src/api/`:
```bash
mkdir -p src/api
```

Then copy all the files from the `api` folder of this boilerplate repository to 
your project.

If you open `src/post.ts` you will see that it is a simple Hono route that 
handles the `/post` endpoint.
You will also see that it contains Swagger comments that will be used to generate 
the OpenAPI specs document.

For error handling, refer to the folder `/src/services/error/` in this boilerplate 
repository. Copy all the files from this folder to your project. 

Also copy `src/index.ts` and `src/server.ts` files from this boilerplate 
repository to your project.

To generate the OpenAPI specs document, you can run the following command:

```bash
bun run openapi
```

It will generate the OpenAPI specs document in the `./docs/openapi.json` file.

This document can be used to generate a client SDK or to generate an MCP server 
for LLMs.

### 15. Set up the tests

At the root of the project, create a `tests` folder and inside it copy the content of the `tests` folder from this boilerplate repository.
Then add [faker](https://fakerjs.dev/) package to generate fake data for testing:

```bash
bun add -d @faker-js/faker
```

You can run the tests with the following command:

```bash
bun test
```

Or if you want to run the tests with coverage, you can run:

```bash
bun test --coverage
```

If you want to run tests only for a specific section, like the API tests, you can run:

```bash
bun test ./tests/api
```

### 16. Install [hey-api](https://heyapi.dev/)

Hey-API is a tool that can generate a client SDK from your OpenAPI specs document.

```bash
bun add -d @hey-api/client-fetch
bun add @hey-api/openapi-ts
```

Copy the file `openapi-ts.config.ts` from this boilerplate repository to your project.

Then execute the following command to generate the client SDK:

```bash
bun run openapi:client:hey-api
```

This will generate the client SDK in the `./dist/client/hey-api` folder.

If you want to generate the client SDK for Next.js, refer to this [documentation](https://heyapi.dev/openapi-ts/clients/next-js).

I won't go into the details about how to use the client SDK. Check hey-api's website 
for the documentation and examples.

### 17. Start an OpenAPI MCP (Model-Context-Protocol) server for LLMs

[MCP-OpenAPI-server](https://github.com/ivo-toby/mcp-openapi-server)

*Only do this step if you want to run the MCP server for LLMs.*

This MCP server is a simple server that can be used to interact with LLMs (Large Language Models).
It is based on the OpenAPI specs document generated by Swagger-JSDoc.

You don't need to install anything, run the following command:

```bash
./start-mcp-server.sh
```

This will start the MCP server on port 4000. 

I won't go into the details about how to use the MCP server; this is a subject 
for another article.

## Start the API server

To start the API server, run the following command:

```bash
bun run dev
```

This will start the server on the port defined in the `.env` file (default is 3000).
You can then access the API at `http://localhost:3000`.

You can also access the Swagger UI at `http://localhost:3000/docs` to see the API documentation and test the endpoints.

## License

This project is licensed under the MIT License 

See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please read the [CONTRIBUTING.md](CONTRIBUTING.md) file for details on how to contribute to this project.
