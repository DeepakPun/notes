import User from "../models/User.js"
import bcrypt from "bcryptjs"

// @desc   Render registration form
// @route  GET /register
// @access Public
export const renderRegisterForm = (req, res) => {
  res.render("auth/register")
}

// @desc   Render login form
// @route  GET /login
// @access Public
export const renderLoginForm = (req, res) => {
  res.render("auth/login")
}

/**
 * Handle new user account initialization with validation flash feedback loops
 */
export const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body

    // 1. Enforce strict string presence parameters
    if (!username || !password) {
      req.flash(
        "error",
        "Missing identity parameter segments. Username and password required.",
      )
      return res.redirect("/register")
    }

    const normalizedHandle = username.trim().toLowerCase()

    // 2. Enforce structural safety constraints (e.g., character min length boundaries)
    if (normalizedHandle.length < 3) {
      req.flash(
        "error",
        "Handle signature verification failure. Username must contain at least 3 characters.",
      )
      return res.redirect("/register")
    }

    if (password.length < 6) {
      req.flash(
        "error",
        "Cryptographic passcode weakness. Security token must span 6 parameters minimum.",
      )
      return res.redirect("/register")
    }

    // 2. Pro Feature: Stop common sequential, repetitive, or simple numeric passwords
    const weakBlacklist = [
      "123456",
      "abcdef",
      "qwerty",
      "password",
      "111111",
      "000000",
      "123123",
    ]
    const repetitivePattern = /^(.)\1+$/

    if (
      weakBlacklist.includes(password.toLowerCase()) ||
      repetitivePattern.test(password)
    ) {
      req.flash(
        "error",
        "[SECURITY_REJECTION] Highly vulnerable password structure detected. Use mixed character parameters.",
      )
      return res.redirect("/register")
    }

    const existingUser = await User.findOne({ username: normalizedHandle })
    if (existingUser) {
      req.flash(
        "error",
        "Identity token collision. This terminal handle is already allocated.",
      )
      return res.redirect("/register")
    }

    // 4. Encrypt passcode metrics safely using 12 cryptographic computational rounds
    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(password, salt)

    // 5. Commit clean data user document to live cluster indices
    const newUser = new User({
      username: normalizedHandle,
      password: hashedPassword,
    })
    await newUser.save()

    // 6. Bind user details to active session parameters
    req.session.userId = newUser._id.toString()
    req.session.username = newUser.username

    // Flash success tracking notification downstream
    req.flash(
      "success",
      `Terminal connection established. Operator node ${newUser.username} registered successfully.`,
    )
    res.redirect("/notes")
  } catch (error) {
    console.error("// [FAILURE] Account generation engine crashed:", error)
    req.flash(
      "error",
      "System runtime exception. Account compilation sequence rejected.",
    )
    res.redirect("/register")
  }
}

/**
 * Handle user session verification pipeline with flash alert error states
 */
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body

    // 1. Enforce string presence validations
    if (!username || !password) {
      req.flash(
        "error",
        "Authentication rejected. Missing credential matrix components.",
      )
      return res.redirect("/login")
    }

    const normalizedHandle = username.trim().toLowerCase()

    // 2. Query target identity profile configuration in MongoDB
    const user = await User.findOne({ username: normalizedHandle })
    if (!user) {
      req.flash("error", "[DENIED] Terminal handle signature not found.")
      return res.redirect("/login")
    }

    // 3. Cryptographically compare incoming passcode against hashed database string
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      req.flash(
        "error",
        "[DENIED] Cryptographic access token authorization mismatch.",
      )
      return res.redirect("/login")
    }

    // 4. Verification clean. Commit details into state session memory caches
    req.session.userId = user._id.toString()
    req.session.username = user.username

    // 5. Flash welcome log metrics down cluster transport pipeline
    req.flash(
      "success",
      `Session handshake authorized. Operator node ${user.username} online.`,
    )
    res.redirect("/notes")
  } catch (error) {
    console.error("// [FAILURE] Session authorization crash:", error)
    req.flash(
      "error",
      "Matrix Kernel Exception: Secure transport handshake processing failure.",
    )
    res.redirect("/login")
  }
}

/**
 * Clear tracking state session cookies cleanly
 */
export const logoutUser = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("// [FAILURE] Session clearance exception:", err)
      return res.status(500).send("Failed to drop system connection context.")
    }
    res.clearCookie("matrix_kernel_session") // Clean tracking headers
    res.redirect("/")
  })
}
