# Complete boilerplate with Bun and Hono

Since 2014 I've been building several REST API backends with Node.js, mostly 
with Express.js. Over the years, I've learned a lot about how to structure a project 
and select the right tools to build a solid foundation for a REST API backend. 
More recently, I've been exploring Bun and Hono, which are modern alternatives 
to Node.js and Express.js, respectively. 

Even though one of Bun's best-selling points is its performance, the main reason 
it caught my attention is its tooling and its TypeScript support out of the box. 
I've been working for several startups and I give a lot of importance 
to [TCO](https://en.wikipedia.org/wiki/Total_cost_of_ownership) and I believe that 
Bun can be part of the solution to reduce the TCO of a project.

Consequently, I decided to create a boilerplate that combines Bun and Hono, as 
well as other tools that I find useful for building a REST API backend. I try to 
keep the complexity as low as possible without sacrificing important aspects like 
testing, documentation, security and maintainability. 

## Table of Contents

- [Why Bun and Hono?](#why-bun-and-hono)
- [Features](#features)
- [Step-by-Step Installation Guide](#step-by-step-installation-guide)
- [Start the API server](#start-the-api-server)
- [Conclusion](#conclusion)
- [License](#license)
- [Contributing](#contributing)

## Why Bun and Hono?

Bun is a modern JavaScript runtime that is fast and efficient. 
It is designed to be a drop-in replacement for Node.js, but with a focus on 
performance and developer experience. 

Hono is a fast and lightweight web framework that is compatible with Bun.

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

Before going further, keep a tab open to the GitHub repository of this 
[boilerplate](https://github.com/alex-michaud/bun-hono-boilerplate). I won't copy 
the code of every file here, but for each step I will tell you where to look in 
the repository to find the code you need to copy or adapt.

## Step-by-Step Installation Guide

To run this project, you will first need to install the [Bun](https://bun.sh/) runtime.
Bun also comes with a package manager and some utilities that I believe will 
simplify the project by having fewer packages to install and maintain.

Step-by-step guide to install Bun, Hono and other dependencies:

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

Create a new directory for your project, navigate into it and run the following 
command:

```bash
bun init
```

This will create the following files:

- index.ts
- tsconfig.json
- package.json

### 3. Install [Hono](https://hono.dev/)

Hono is the framework that will be used to build the API. To install it, run the 
following command:

```bash
bun add hono
```

### 4. Create a .env file

We will use environment variables to configure the API. Create a `.env` file with
the following command:

```bash
touch .env
```

And add the following content:

```
API_PORT=3000
DATABASE_DIR=./data
BETTER_AUTH_SECRET=better-auth-secret
TRUSTED_ORIGINS=http://localhost:3000
```

### 5. Install [Zod](https://zod.dev)

Zod is a TypeScript-first schema declaration and validation library. It will be 
used to validate the data sent to the API.

```bash
bun add zod
```

### 6. Create a config file

The configuration file will be used to load the environment variables.

```bash
mkdir src
touch ./src/config.ts
```

**Copy the content of the `config.ts` file** from this boilerplate repository to
your project. This file will load the environment variables from the `.env` file
and provide a type-safe way to access them throughout the application.

### 7. Import the scripts and prisma config from package.json

From the boilerplate repository, open the `package.json` file and copy the `scripts`
and `prisma` sections to your project's `package.json` file.


### 8. Install Swagger-JSDoc

Swagger-JSDoc is a tool that allows you to generate OpenAPI specs document from 
comments in your code.
It is useful for many reasons :
- It allows you to document your API in a standard way.
- It allows other developers to understand your API without having to read the code.
- It allows generating a client SDK for your API. (React, Angular, Vue, etc.)
- It allows generating an MCP (Model-Context-Protocol)

```bash
bun add -d swagger-jsdoc @types/swagger-jsdoc
bun add @hono/swagger-ui
```

Create a `scripts` folder in the root of your project:
```bash
mkdir scripts
```

Then **copy the file `generate-openapi.ts`** from this boilerplate repository to
your project. This script will generate the OpenAPI specs document from the comments
in the code. It uses Swagger-JSDoc to parse the comments and generate the OpenAPI
specs document.

To generate the OpenAPI specs document, you can run the following command:

```bash
bun run openapi
```

This will generate the OpenAPI specs document in the `./docs/openapi.json` file.

### 9. Install [Biome](https://biomejs.dev) *(linting and formatting tool)*

Biome is a modern linting and formatting tool that replaces ESLint and Prettier.
It's easier to use and configure than ESLint and Prettier, and it's also a lot 
faster. If you currently use ESLint and Prettier, you can replace them with Biome.

```bash
bun add -D -E @biomejs/biome
```

To generate the configuration file, run:

```bash
bunx --bun biome init
```

This will create a `biome.json` file in the root of your project.

### 10. Install [Pino](https://getpino.io)

Pino is a fast and lightweight logging library.

_[Winston](https://github.com/winstonjs/winston) is also a good option, it has a
better documentation and broader support, but it's also a bit heavier_

```bash
bun add pino pino-pretty
bun add -d @types/pino
```

Create a `src/services/` directory:

```bash
mkdir -p src/services
```

**Copy the file `./src/services/logger.ts`** from this boilerplate 
repository to your project.

### 11. Install [Prisma](https://www.prisma.io)

Prisma is a modern ORM that allows you to interact with your database in a 
type-safe way. It offers a great migration system, a modern query API and good 
documentation. 

```bash
bun add -d typescript @types/node
bun add prisma
```

### 12.A. Install [PGLite](https://pglite.dev/) and its [adapter](https://github.com/lucasthevenet/pglite-utils/tree/main/packages/prisma-adapter)

PGLite is a lightweight, file-based database. It's suitable for demo projects 
like this one, but not for production use. If you're planning to build a 
production-ready application, you should consider using a docker service instead. 
A docker service is more similar to what you will use in production. You can 
refer to the file `docker-compose.yml` in this repository for an example of how 
to set up a Postgres database with Docker.

*skip this step if you plan to use a docker service instead of PGLite.*

Run this command to create the data directory:

```bash
mkdir data
```

Then install the PGLite Prisma adapter and the PGLite database:
```bash
bun add pglite-prisma-adapter 
bun add @electric-sql/pglite
```

**Copy the file `prisma.config.ts`** from this boilerplate repository to your 
project.

*Note: PGLite is used as an example for this boilerplate. You can replace it 
with any other database adapter that is compatible with Prisma.*

### 12.B. Use a Docker Postgresql service

If you prefer to use a Docker service instead of PGLite, you can use the 
`docker-compose.yml` file in this repository. To start the Docker service, run:

```bash
docker compose up -d
```

### 13. Initialize Prisma

Create a new directory `src/prisma/`:

```bash
mkdir -p src/prisma
```

Then **copy the file `src/prisma/schema.prisma`** from this boilerplate 
repository to your project.

Run the following command to generate the Prisma client:

```bash
bun --env-file=.env prisma generate --schema=./src/prisma/schema.prisma
```

Run the following command to create the database and tables:

```bash
bun --env-file=.env prisma db push --schema=./src/prisma/schema.prisma
```

Finally, **copy the file `src/services/database.ts`** from this boilerplate 
repository to your project.

### 14. Install [Better-Auth](https://www.better-auth.com)

Better-Auth is a modern authentication library that provides a simple and secure 
way to handle user authentication in your application. There are several 
authentication strategies available, such as email/password, social logins and 
more. It can do a lot, therefore, I recommend you to check the 
[documentation](https://www.better-auth.com/docs) to understand how it works and how to configure it.

```bash
bun add better-auth
mkdir -p src/lib
mkdir -p src/services/error
```

**Copy all the files from `src/services/error/`** from this boilerplate repository 
to your project.

Then **copy the file `src/lib/auth.ts`** from this boilerplate repository to 
your project.

### 15. Create the API routes

Create a new folder `src/api/`:
```bash
mkdir -p src/api
```

Then **copy all the files from the `api` folder** from the boilerplate repository to 
your project.

If you open `src/post.ts` you will see that it is a simple Hono route that 
handles the `/post` endpoint.
You will also see that it contains Swagger comments that will be used to generate 
the OpenAPI specs document.

Also **copy `src/index.ts` and `src/server.ts` files** from this boilerplate 
repository to your project.

To generate the OpenAPI specs document, you can run the following command:

```bash
bun run openapi
```

It will generate the OpenAPI specs document in the `./docs/openapi.json` file.

This document can be used to generate a client SDK or to generate an MCP server 
for LLMs.

### 16. Set up the tests

To ensure the quality of your code, it's important to write tests. 

First, create a tests folder at the root of your project:

```bash
mkdir tests
```

Now **copy the content of the `tests` folder** from this boilerplate repository. 
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

### 17. Install [Hey-API](https://heyapi.dev/)

Hey-API is a tool that can generate a client SDK from your OpenAPI specs document.

```bash
bun add -d @hey-api/client-fetch
bun add @hey-api/openapi-ts
```

**Copy the file `openapi-ts.config.ts`** from this boilerplate repository to your project.

Then execute the following command to generate the client SDK:

```bash
bun run openapi:client:hey-api
```

This will generate the client SDK in the `./dist/client/hey-api` folder.

If you want to generate the client SDK for Next.js, refer to this [documentation](https://heyapi.dev/openapi-ts/clients/next-js).

I won't go into the details about how to use the client SDK. Check [Hey-API's](https://heyapi.dev/openapi-ts/get-started) 
website for the documentation and examples.

### 18. Start an OpenAPI MCP (Model-Context-Protocol) server for LLMs

[MCP-OpenAPI-server](https://github.com/ivo-toby/mcp-openapi-server)

*Only do this step if you want to run the MCP server for LLMs.*

This MCP server is a simple server that can be used to interact with LLMs (Large Language Models).
It is based on the OpenAPI specs document generated by Swagger-JSDoc.

**Copy the file `start-mcp-server.sh`** from this boilerplate repository to your 
project.

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

You can also access the Swagger UI at `http://localhost:3000/docs` to see the 
API documentation and test the endpoints.

## Conclusion

I will continue to improve this boilerplate over time. I'm planning to use it 
as a base for my future projects. Feel free to use it as you wish, and if you 
have any suggestions or improvements, please open an issue or a pull request on 
the [GitHub repository](https://github.com/alex-michaud/bun-hono-boilerplate/issues).

## License

This project is licensed under the MIT License 

See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please read the [CONTRIBUTING.md](CONTRIBUTING.md) file for details on how to contribute to this project.
