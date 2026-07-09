import Note from "../models/Note.js"

/**
 * @desc READ: Fetch all notes from database to render grid matrix with pagination
 * @route GET /notes
 */
export const getAllNotes = async (req, res) => {
  try {
    const { search, sort } = req.query

    // 📄 PAGINATION ENGINE METRICS
    const page = parseInt(req.query.page) || 1
    const limit = 6
    const skip = (page - 1) * limit

    // 🔓 GLOBAL READ SCOPING: Initialize empty to allow anyone to query any note document
    let queryCondition = {}

    // Text query search criteria mapping
    if (search) {
      queryCondition.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ]
    }

    // Sorting evaluation
    let sortCondition = { createdAt: -1 }
    if (sort === "oldest") {
      sortCondition = { createdAt: 1 }
    } else if (sort === "alphabetical") {
      sortCondition = { title: 1 }
    }

    // 🏎️ DATABASE TUNING STREAM: Fetch count and data chunks concurrently
    const totalNotes = await Note.countDocuments(queryCondition)
    const notes = await Note.find(queryCondition)
      .populate("author", "username")
      .sort(sortCondition)
      .skip(skip)
      .limit(limit)

    const totalPages = Math.ceil(totalNotes / limit)

    res.render("notes/index", {
      notes,
      currentFilters: { search, sort },
      pagination: {
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    })
  } catch (error) {
    console.error(
      "// [CRITICAL] Index pagination execution stream failure:",
      error,
    )
    req.flash("error", "[INDEX_FAILED] System index query pipe crashed.")
    req.session.save(() => {
      res.redirect("/")
    })
  }
}

/**
 * @desc READ: View a single granular note node
 * @route GET /notes/:id
 */
export const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id).populate(
      "author",
      "username",
    )
    if (!note) {
      req.flash("error", "[MISSING_NODE] Target matrix node address not found.")
      return req.session.save(() => {
        res.redirect("/notes")
      })
    }
    res.render("notes/show", { note })
  } catch (error) {
    console.error("// [CRITICAL] Node inspection error:", error)
    req.flash(
      "error",
      "[INVALID_SIGNATURE] Invalid node identification parameters.",
    )
    req.session.save(() => {
      res.redirect("/notes")
    })
  }
}

/**
 * @desc CREATE: Write a new note node data block to the database
 * @route POST /notes
 */
export const createNote = async (req, res) => {
  try {
    const {
      title,
      content,
      tags,
      folderName,
      coreFeatures,
      codeSnippet,
      useCase,
      officialDocs,
    } = req.body

    const plainTextSummary = content
      ? content.replace(/<[^>]*>/g, "").substring(0, 180)
      : ""
    const wordCount = content
      ? content.trim().split(/\s+/).filter(Boolean).length
      : 0
    const tagsArray = tags
      ? tags
          .split(",")
          .map((tag) => tag.trim().toLowerCase())
          .filter(Boolean)
      : []

    // Parse comma-separated core features into a clean array matrix
    const featuresArray = coreFeatures
      ? coreFeatures
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean)
      : []

    const newNote = new Note({
      author: req.session.userId,
      title: title || "Untitled Note Node",
      content: content || "",
      plainTextSummary,
      tags: tagsArray,
      folderName: folderName || "Root_Directory",
      wordCount,
      coreFeatures: featuresArray,
      codeSnippet: codeSnippet || "",
      useCase: useCase || "",
      officialDocs: officialDocs || "",
    })

    await newNote.save()

    req.flash(
      "success",
      "[SUCCESS] Memory data block committed to cluster indexes cleanly.",
    )
    req.session.save((err) => {
      if (err) console.error("// Session save exception failure:", err)
      res.redirect("/notes")
    })
  } catch (error) {
    console.error("// [CRITICAL] Write operation rejected:", error)
    req.flash(
      "error",
      "[WRITE_REJECTED] Database write transport layer failure.",
    )
    req.session.save(() => {
      res.redirect("/notes/new")
    })
  }
}

/**
 * @desc RENDER EDIT FORM: Verify credentials and display rewrite terminal
 * @route GET /notes/:id/edit
 */
export const renderEditForm = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
    if (!note) {
      req.flash("error", "[FAILURE] Target node instance missing.")
      return req.session.save(() => {
        res.redirect("/notes")
      })
    }

    if (!req.session.userId || req.session.userId !== note.author.toString()) {
      req.flash(
        "error",
        "[ACCESS_DENIED] Security violation: Operator credentials mismatch.",
      )
      return req.session.save(() => {
        res.redirect(`/notes/${note._id}`)
      })
    }

    res.render("notes/edit", { note })
  } catch (error) {
    console.error("// [CRITICAL] Render edit form exception:", error)
    req.flash(
      "error",
      "[HANDSHAKE_EXCEPTION] Failed to open mutation edit layout.",
    )
    req.session.save(() => {
      res.redirect("/notes")
    })
  }
}

/**
 * @desc UPDATE: Modify and rewrite an existing ledger document record
 * @route POST /notes/:id/update
 */
export const updateNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
    if (!note) {
      req.flash("error", "[FAILURE] Target note instance missing.")
      return req.session.save(() => res.redirect("/notes"))
    }

    if (!req.session.userId || req.session.userId !== note.author.toString()) {
      req.flash("error", "[MUTATION_REJECTED] Write lock security violation.")
      return req.session.save(() => res.redirect(`/notes/${note._id}`))
    }

    const {
      title,
      content,
      tags,
      folderName,
      coreFeatures,
      codeSnippet,
      useCase,
      officialDocs,
    } = req.body

    const plainTextSummary = content
      ? content.replace(/<[^>]*>/g, "").substring(0, 180)
      : ""
    const wordCount = content
      ? content.trim().split(/\s+/).filter(Boolean).length
      : 0
    const tagsArray = tags
      ? tags
          .split(",")
          .map((tag) => tag.trim().toLowerCase())
          .filter(Boolean)
      : []
    const featuresArray = coreFeatures
      ? coreFeatures
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean)
      : []

    note.title = title || "Untitled Note Node"
    note.content = content || ""
    note.plainTextSummary = plainTextSummary
    note.tags = tagsArray
    note.folderName = folderName || "Root_Directory"
    note.wordCount = wordCount
    note.coreFeatures = featuresArray
    note.codeSnippet = codeSnippet || ""
    note.useCase = useCase || ""
    note.officialDocs = officialDocs || ""

    await note.save()

    req.flash(
      "success",
      "[SUCCESS] Matrix ledger modification overwrite completed cleanly.",
    )
    req.session.save(() => {
      res.redirect(`/notes/${note._id}`)
    })
  } catch (error) {
    console.error("Mutation payload exception:", error)
    req.flash("error", "Rewrite pipeline compilation failure.")
    req.session.save(() => {
      res.redirect(`/notes/${req.params.id}/edit`)
    })
  }
}

/**
 * @desc DELETE: Purge a data record entirely from cluster node indexes
 * @route POST /notes/:id/delete
 */
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
    if (!note) {
      req.flash(
        "error",
        "[FAILURE] Deletion target addressable location empty.",
      )
      return req.session.save(() => {
        res.redirect("/notes")
      })
    }

    // Owner Access Guard Check
    if (!req.session.userId || req.session.userId !== note.author.toString()) {
      req.flash(
        "error",
        "[PURGE_REJECTED] Security violation: Unauthorized deletion token.",
      )
      return req.session.save(() => {
        res.redirect(`/notes/${note._id}`)
      })
    }

    await Note.findByIdAndDelete(req.params.id)

    // Queue flash message payload
    req.flash(
      "success",
      "[PURGED] Node data structure removed entirely from cluster index parameters.",
    )

    // Force Express to save the session to Atlas BEFORE redirecting
    req.session.save((err) => {
      if (err) {
        console.error("// Session save exception failure:", err)
      }
      res.redirect("/notes")
    })
  } catch (error) {
    console.error("// [CRITICAL] Purge pipeline exception:", error)
    req.flash(
      "error",
      "[PURGE_FAILED] System deletion execution pipeline crashed.",
    )
    req.session.save(() => {
      res.redirect("/notes")
    })
  }
}
