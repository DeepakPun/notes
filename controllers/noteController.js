import Note from "../models/Note.js"

/**
 * @desc    READ: Fetch all notes from database to render grid matrix
 * @route   GET /notes
 */
export const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find().sort({ updatedAt: -1 })
    res.render("notes/index", { notes })
  } catch (error) {
    console.error("// [CRITICAL] Index extraction failed:", error)
    res.status(500).render("pages/error", {
      statusCode: 500,
      message:
        "[500_CLUSTER_OFFLINE] Failed to synchronize with cloud database clusters. Handshake request timeout.",
    })
  }
}

/**
 * @desc    READ: View a single granular note node
 * @route   GET /notes/:id
 */
export const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
    if (!note) {
      req.flash("error", "[MISSING_NODE] Target matrix node address not found.")
      return res.redirect("/notes")
    }
    res.render("notes/show", { note })
  } catch (error) {
    console.error("// [CRITICAL] Node inspection error:", error)
    req.flash(
      "error",
      "[INVALID_SIGNATURE] Invalid node identification parameters.",
    )
    res.redirect("/notes")
  }
}

/**
 * @desc    CREATE: Write a new note node data block to the database
 * @route   POST /notes
 */
export const createNote = async (req, res) => {
  try {
    const { title, content, tags, folderName } = req.body

    // Pro Optimization Pipeline: Generate plain text string extraction for fast search
    const plainTextSummary = content
      ? content.replace(/<[^>]*>/g, "").substring(0, 180)
      : ""

    // Count words accurately using standard regex whitespace split boundaries
    const wordCount = content
      ? content.trim().split(/\s+/).filter(Boolean).length
      : 0

    // Parse incoming comma-separated tag string into a clean array matrix
    const tagsArray = tags
      ? tags.split(",").map((tag) => tag.trim().toLowerCase())
      : []

    const newNote = new Note({
      author: req.session.userId,
      title: title || "Untitled Note Node",
      content: content || "",
      plainTextSummary,
      tags: tagsArray,
      folderName,
      wordCount,
    })

    await newNote.save()

    req.flash(
      "success",
      "[SUCCESS] Memory data block committed to cluster indexes cleanly.",
    )
    res.redirect("/notes")
  } catch (error) {
    console.error("// [CRITICAL] Write operation rejected:", error)
    req.flash(
      "error",
      "[WRITE_REJECTED] Database write transport layer failure.",
    )
    res.redirect("/notes/new")
  }
}

/**
 * @desc    RENDER EDIT FORM: Verify credentials and display rewrite terminal
 * @route   GET /notes/:id/edit
 */
export const renderEditForm = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
    if (!note) {
      req.flash("error", "[FAILURE] Target node instance missing.")
      return res.redirect("/notes")
    }

    // REUSED LOGIC LAYER: Verify user is logged in AND is the explicit note author
    if (!req.session.userId || req.session.userId !== note.author.toString()) {
      req.flash(
        "error",
        "[ACCESS_DENIED] Security violation: Operator credentials mismatch.",
      )
      return res.redirect(`/notes/${note._id}`)
    }

    res.render("notes/edit", { note })
  } catch (error) {
    console.error("// [CRITICAL] Render edit form exception:", error)
    req.flash(
      "error",
      "[HANDSHAKE_EXCEPTION] Failed to open mutation edit layout.",
    )
    res.redirect("/notes")
  }
}

/**
 * @desc    UPDATE: Modify and rewrite an existing ledger document record
 * @route   POST /notes/:id/update
 */
export const updateNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
    if (!note) {
      req.flash("error", "[FAILURE] Target node instance missing.")
      return res.redirect("/notes")
    }

    // STRICT LOGIC LOCK: Prevent cross-tenant POST terminal spoofing
    if (!req.session.userId || req.session.userId !== note.author.toString()) {
      req.flash("error", "[MUTATION_REJECTED] Write lock security violation.")
      return res.redirect(`/notes/${note._id}`)
    }

    const { title, content, tags, folderName } = req.body

    // Re-compile tracking parameter metrics for updated payload string lengths
    const plainTextSummary = content
      ? content.replace(/<[^>]*>/g, "").substring(0, 180)
      : ""
    const wordCount = content
      ? content.trim().split(/\s+/).filter(Boolean).length
      : 0
    const tagsArray = tags
      ? tags.split(",").map((tag) => tag.trim().toLowerCase())
      : []

    // Save modifications safely
    note.title = title || "Untitled Note Node"
    note.content = content || ""
    note.plainTextSummary = plainTextSummary
    note.tags = tagsArray
    note.folderName = folderName
    note.wordCount = wordCount

    await note.save()

    req.flash(
      "success",
      "[SUCCESS] Matrix ledger modification overwrite completed cleanly.",
    )
    res.redirect(`/notes/${note._id}`)
  } catch (error) {
    console.error("Mutation payload exception:", error)
    req.flash("error", "Rewrite pipeline compilation failure.")
    res.redirect(`/notes/${req.params.id}/edit`)
  }
}

/**
 * @desc    DELETE: Purge a data record entirely from cluster node indexes
 * @route   POST /notes/:id/delete
 */
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
    if (!note) {
      req.flash(
        "error",
        "[FAILURE] Deletion target addressable location empty.",
      )
      return res.redirect("/notes")
    }

    // STRICT OWNER ACCESS GUARD: Prevent unauthenticated database execution injections
    if (!req.session.userId || req.session.userId !== note.author.toString()) {
      req.flash(
        "error",
        "[PURGE_REJECTED] Security violation: Unauthorized deletion token.",
      )
      return res.redirect(`/notes/${note._id}`)
    }

    await Note.findByIdAndDelete(req.params.id)

    req.flash(
      "success",
      "[PURGED] Node data structure removed entirely from cluster index parameters.",
    )
    res.redirect("/notes")
  } catch (error) {
    console.error("// [CRITICAL] Purge pipeline exception:", error)
    req.flash(
      "error",
      "[PURGE_FAILED] System deletion execution pipeline crashed.",
    )
    res.redirect("/notes")
  }
}
