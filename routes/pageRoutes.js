import express from "express"
import {
  renderRegisterForm,
  registerUser,
  renderLoginForm,
  loginUser,
  logoutUser,
} from "../controllers/authController.js"

const router = express.Router()

router.get("/", (req, res) => {
  res.render("pages/landing")
})

router.route("/register").get(renderRegisterForm).post(registerUser)
router.route("/login").get(renderLoginForm).post(loginUser)
router.get("/logout", logoutUser)

export default router
