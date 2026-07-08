# 📝 Notes Application

A full-stack notes management application built with Node.js, Mongoose, and deployed seamlessly on Vercel.

## 🚀 Features

- Secure user authentication and account creation.
- Full CRUD operations for personal notes.
- Serverless architecture fully optimized for Vercel deployment.
- High-performance cloud database caching via Mongoose.

## 🛠️ Tech Stack

- **Frontend:** HTML5, Bootstrap 5, JavaScript
- **Backend:** Node.js / Express or Next.js API Routes
- **Database:** MongoDB Atlas (Production) / Localhost (Development)
- **ODM:** Mongoose
- **Environment Management:** `@dotenvx/dotenvx`

## ⚙️ Environment Configuration

This project utilizes `dotenvx` for smart configuration encryption. Create a `.env.local` file in your root directory:

```env
DB_URL="your_mongodb_connection_string"
```

### Development Switching

To switch between your local database and Atlas cloud, run:

```bash
# Target Local Host
npx dotenvx set DB_URL "mongodb://localhost:27017/notes_dev" -f .env.local

# Target MongoDB Atlas
npx dotenvx set DB_URL "your_atlas_connection_string" -f .env.local
```

## 📦 Deployment

Deploys automatically via Vercel integration. Ensure the `DB_URL` environment variable is mapped inside your project's Vercel Dashboard under Settings.
