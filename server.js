import express from "express"
import path from "path"
import { fileURLToPath } from "url"
import engine from "ejs-mate"
import session from "express-session"
import flash from "connect-flash"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

app.engine("ejs", engine)
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))

app.use(
  session({
    secret: process.env.SESSION_SECRET || "matrix_core_fallback_signature_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  }),
)

app.use(flash())

app.use((req, res, next) => {
  res.locals.success = req.flash("success")
  res.locals.error = req.flash("error")
  next()
})

app.get("/", (req, res) => {
  res.render("pages/landing")
})

app.get("/notes", (req, res) => {
  const mockNotes = [
    {
      id: "660d1b",
      title: "Docker Production Clusters Setup",
      plainTextSummary:
        "Multi-stage Node builds combined with isolated network networks provide massive infrastructure deployment advantages.",
      tags: ["docker", "devops", "architecture"],
      folderName: "Infrastructure",
      isPinned: true,
      wordCount: 142,
      updatedAt: "2026-07-07",
    },
    {
      id: "660d2c",
      title: "Mongoose Index Strategies",
      plainTextSummary:
        "Compound indexing fields like userId and updatedAt dramatically reduces scan overhead on high-frequency read pipelines.",
      tags: ["mongodb", "database", "backend"],
      folderName: "Database_Core",
      isPinned: false,
      wordCount: 98,
      updatedAt: "2026-07-06",
    },
    {
      id: "660d3d",
      title: "Security Header Injection Architecture",
      plainTextSummary:
        "Helmet configuration rules mitigate data scraping vectors by strictly binding XSS and transport layers scripts safely.",
      tags: ["security", "express"],
      folderName: "Security_Audit",
      isPinned: false,
      wordCount: 210,
      updatedAt: "2026-07-04",
    },
  ]

  res.render("notes/index", { notes: mockNotes })
})

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () =>
    console.log(
      `[SYSTEM_ONLINE]: Server cluster listening at http://localhost:${PORT}`,
    ),
  )
}

export default app
