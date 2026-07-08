import express from "express"
import path from "path"
import { fileURLToPath } from "url"
import engine from "ejs-mate"
import session from "express-session"
import flash from "connect-flash"
import connectDB from "./config/db.js"
import noteRoutes from "./routes/noteRoutes.js"
import pageRoutes from "./routes/pageRoutes.js"
import MongoStore from "connect-mongo"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

// Connect to MongoDB
connectDB()

app.engine("ejs", engine)
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(
  session({
    secret: process.env.SESSION_SECRET || "matrix_core_fallback_signature_key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL || "mongodb://localhost:27017/notes-matrix",
      ttl: 14 * 24 * 60 * 60, // 14 days
    }),
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  }),
)

app.use(flash())

app.use((req, res, next) => {
  // Pack the separate session strings into a clean local template object
  if (req.session.userId) {
    res.locals.currentUser = {
      id: req.session.userId,
      username: req.session.username,
    }
  } else {
    res.locals.currentUser = null
  }

  // console.log("Current User Payload Matrix:", res.locals.currentUser)
  res.locals.success = req.flash("success")
  res.locals.error = req.flash("error")
  next()
})

app.use("/notes", noteRoutes)
app.use("/", pageRoutes)

/**
 * Global 404 Route Handler Fallback
 * Captures unknown paths and explicitly renders the dedicated system error layout canvas.
 */
app.use("/{*splat}", (req, res) => {
  res.status(404).render("pages/error", {
    statusCode: 404,
    message: `[404_NOT_FOUND] Target system address layout string '${req.originalUrl}' does not match any operational workspace endpoints.`,
  })
})

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () =>
    console.log(
      `[SYSTEM_ONLINE]: Server cluster listening at http://localhost:${PORT}`,
    ),
  )
}

export default app
