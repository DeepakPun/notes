/**
 * Express protection middleware blocking unauthorized data operations.
 * Flashes a terminal status error and diverts unauthenticated sessions to login.
 */
export const isLoggedIn = (req, res, next) => {
  // Check if the user object exists in our lightweight native session store
  if (!req.session || !req.session.userId) {
    req.flash(
      "error",
      "[UNAUTHORIZED] Active terminal session signature required. Access denied.",
    )
    return res.redirect("/login")
  }

  // Authorization verified. Proceed directly to the next operation in the execution stack.
  next()
}
