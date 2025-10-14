# Core Service

A Typescript Deno service for managing **JobPosts**, **Companies**, **Users**,
etc.

Provides a REST API for interacting with entities as well as for event-driven
tasks.

## Quick Start

### 1. Database Setup

Initialize the SQLite database:

```bash
cd core
sqlite3 job-agent-core.db < src/db/migrations/init.sql
```

That's it! The database file `job-agent-core.db` will be created with all
necessary tables.

To verify the setup:

```bash
sqlite3 job-agent-core.db ".tables"
```

### 2. Run the Server

Start the development server:

```bash
cd core
deno task dev
```

Or run without watch mode:

```bash
deno task start
```

The server will start on http://localhost:8000

## Database

We use [pgtyped](https://pgtyped.dev/) for type-safe SQL queries in Typescript.

## Server

We use [tsoa](https://tsoa-community.github.io/docs/) to create a REST API
server with OpenAPI documentation.
