# Project Blueprint: notes

This document outlines the architectural structure and directory layout for the `notes` application.

## Directory Tree

```text
notes/
├── config/           # Database connection and Passport authentication strategies
├── controllers/      # Request handlers (authController, noteController)
├── middleware/       # Auth guards (isLoggedIn, hasNoteAccess)
├── models/           # Mongoose Schemas (User.js, Note.js)
├── routes/           # HTTP Route definitions (auth.js, notes.js)
├── views/            # EJS Templates (layouts/, partials/, pages/)
├── public/           # Static assets (custom CSS, client JS)
├── .env              # Secret keys and Mongo URI variables
├── Dockerfile        # Container configuration
└── server.js         # Express App initialization core
```

## Module Definitions

### 📂 config/

Manages the application configuration setup. This includes establishing the database connection lifecycle and defining Passport.js authentication strategies.

### 📂 controllers/

Contains the core business logic. These files act as request handlers, processing incoming data from routes and interacting with models to return responses.

### 📂 middleware/

Houses custom Express middleware functions. These act as security and access guards, verifying if a user is logged in or if they possess the correct permissions to view a specific note.

### 📂 models/

Defines the data layer architecture. Contains Mongoose schemas and models that dictate how data like Users and Notes are structured and stored in MongoDB.

### 📂 routes/

Maps HTTP methods and endpoints to their respective controller logic. Separates routing concerns cleanly by feature (e.g., authentication routes vs. note management routes).

### 📂 views/

Contains the frontend presentation layer templates. Built using EJS (Embedded JavaScript) and structured into reusable layouts, partial blocks, and standalone pages.

### 📂 public/

Serves as the public-facing directory for static assets. Holds browser-side resources including custom CSS stylesheets, images, and client-side JavaScript files.

### 📄 .env

Stores sensitive environment variables. Keeps secret keys, application ports, and MongoDB connection strings safe and separated from the source code.

### 📄 Dockerfile

Provides blueprint instructions for building a Docker container image. Automates the deployment environment setup for consistency across development and production.

### 📄 server.js

The entry point of the entire application. Initializes the Express framework, binds middleware, connects routes, and starts the HTTP network server.
