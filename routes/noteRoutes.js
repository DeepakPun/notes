import express from "express"
import {
  getAllNotes,
  createNote,
  getNoteById,
  updateNote,
  deleteNote,
  renderEditForm,
} from "../controllers/noteController.js"

import { isLoggedIn } from "../middleware/authGuard.js"

const router = express.Router()

router.route("/").get(getAllNotes).post(isLoggedIn, createNote)

// Render new note Form
router.get("/new", isLoggedIn, (req, res) => {
  res.render("notes/new")
})

// Render edit form
router.get("/:id/edit", isLoggedIn, renderEditForm) // READ: Render edit form for a specific note

// Parameterized Token Paths // Target: /notes/:id
router.route("/:id").get(getNoteById) // READ: Fetch single granular note document

// Form-Friendly Mutation Streams (Handles browser POST constraints natively)
router.post("/:id/update", isLoggedIn, updateNote) // UPDATE: Re-write data metrics
router.post("/:id/delete", isLoggedIn, deleteNote) // DELETE: Purge record from indices

export default router
