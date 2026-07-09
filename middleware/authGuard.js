/**
 * Express protection middleware blocking unauthorized data operations.
 * Flashes a terminal status error and diverts unauthenticated sessions to login.
 */
export const isLoggedIn = (req, res, next) => {
  if (req.session.userId) return next()

  req.session.returnTo = req.originalUrl

  req.flash(
    "error",
    `[ACCESS DENIED] You must be logged in to access this page.`,
  )

  req.session.save(() => res.redirect("/login"))
}
